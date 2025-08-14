import { type NextRequest, NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET se mantiene igual
export async function GET(request: NextRequest) {
    try {
        const pool = getPool();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let query = 'SELECT * FROM quotes';
        const queryParams = [];

        if (status && status !== 'all') {
            queryParams.push(status);
            query += ` WHERE status = $1`;
        }

        query += ' ORDER BY created_at DESC';

        const { rows } = await pool.query(query, queryParams);
        return NextResponse.json({ quotes: rows });
    } catch (error) {
        console.error('Error al obtener presupuestos:', error);
        return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
    }
}

// POST: Crea un nuevo presupuesto (VERSIÓN CORREGIDA)
export async function POST(request: NextRequest) {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const body = await request.json();
        const { customer, items, total, notes, valid_until } = body;

        if (!customer || !customer.name || !items || items.length === 0) {
            return NextResponse.json({ message: "Nombre del cliente y al menos un producto son requeridos." }, { status: 400 });
        }

        await client.query('BEGIN');

        const quoteNumber = `QT-${Date.now()}`;
        const quoteQuery = `
            INSERT INTO quotes (quote_number, customer_name, customer_email, total_amount, valid_until, notes, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'draft') RETURNING id;
        `;
        const quoteRes = await client.query(quoteQuery, [quoteNumber, customer.name, customer.email, total, valid_until || null, notes]);
        const newQuoteId = quoteRes.rows[0].id;
        
        console.log(`Presupuesto base creado con ID: ${newQuoteId}`);

        for (const item of items) {
            console.log(`Insertando item:`, item);
            const itemQuery = `
                INSERT INTO quote_items (quote_id, product_id, quantity, unit_price, total_price) 
                VALUES ($1, $2, $3, $4, $5)
            `;
            // Aseguramos que productId sea un número
            const productId = parseInt(item.productId, 10); 
            if (isNaN(productId)) {
                // Si el productId no es válido, saltamos este item para evitar errores
                console.warn("Saltando item con productId inválido:", item.productId);
                continue;
            }

            await client.query(itemQuery, [newQuoteId, productId, item.quantity, item.unitPrice, item.totalPrice]);
        }

        await client.query('COMMIT');
        console.log("COMMIT exitoso.");
        return NextResponse.json({ message: "Presupuesto creado con éxito", quoteId: newQuoteId }, { status: 201 });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear presupuesto:', error);
        return NextResponse.json({ message: "Error al crear el presupuesto", error: (error as Error).message }, { status: 500 });
    } finally {
        client.release();
    }
}
// app/api/quotes/[id]/convert/route.ts
import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const pool = getPool();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Obtener presupuesto y sus items
        const quoteRes = await client.query('SELECT * FROM quotes WHERE id = $1', [id]);
        if (quoteRes.rows.length === 0) throw new Error("Presupuesto no encontrado");
        const quote = quoteRes.rows[0];
        
        const itemsRes = await client.query('SELECT * FROM quote_items WHERE quote_id = $1', [id]);
        const items = itemsRes.rows;

        // 2. Crear un pedido basado en el presupuesto
        const orderNumber = `ORD-FROM-QT-${quote.id}`;
        const orderQuery = `INSERT INTO orders (customer_id, order_number, status, total) VALUES ($1, $2, 'confirmed', $3) RETURNING id`;
        const orderRes = await client.query(orderQuery, [quote.customer_id, orderNumber, quote.total_amount]);
        const newOrderId = orderRes.rows[0].id;

        // 3. Copiar items del presupuesto a items de pedido
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)`,
                [newOrderId, item.product_id, item.quantity, item.unit_price, item.total_price]
            );
        }

        // 4. Actualizar estado del presupuesto a 'convertido'
        await client.query("UPDATE quotes SET status = 'converted' WHERE id = $1", [id]);

        await client.query('COMMIT');
        return NextResponse.json({ message: 'Presupuesto convertido a pedido', orderId: newOrderId });
    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ message: 'Error al convertir presupuesto', error: (error as Error).message }, { status: 500 });
    } finally {
        client.release();
    }
}
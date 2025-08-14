import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const pool = getPool();
    const client = await pool.connect();
    try {
        const quoteRes = await client.query('SELECT * FROM quotes WHERE id = $1', [id]);
        if (quoteRes.rows.length === 0) {
            return NextResponse.json({ message: 'Presupuesto no encontrado' }, { status: 404 });
        }
        
        // Obtenemos los ítems y les unimos el nombre del producto
        const itemsRes = await client.query(`
            SELECT qi.*, p.name as product_name 
            FROM quote_items qi
            JOIN products p ON qi.product_id = p.id
            WHERE qi.quote_id = $1
        `, [id]);
        
        const quote = quoteRes.rows[0];
        quote.items = itemsRes.rows; // Adjuntamos los ítems

        return NextResponse.json(quote);
    } catch (error) {
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}

// ... (El resto de las funciones PUT y DELETE se mantienen igual) ...
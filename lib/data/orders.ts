import 'server-only';
import getPool from '@/lib/db/postgres';

export async function getOrderById(id: string) {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const orderQuery = `
            SELECT o.*, c.first_name, c.last_name, c.email, c.phone, c.address
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            WHERE o.id = $1;
        `;
        const orderRes = await client.query(orderQuery, [id]);

        if (orderRes.rows.length === 0) return null;

        const itemsQuery = `
            SELECT oi.*, p.name as product_name, pv.name as variant_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN product_variants pv ON oi.variant_id = pv.id
            WHERE oi.order_id = $1
        `;
        const itemsRes = await client.query(itemsQuery, [id]);

        const order = orderRes.rows[0];
        order.items = itemsRes.rows;
        return order;
    } catch (error) {
        console.error(`Error al obtener pedido ${id} directamente:`, error);
        return null;
    } finally {
        client.release();
    }
}
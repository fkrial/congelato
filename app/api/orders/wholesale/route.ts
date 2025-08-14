// app/api/orders/wholesale/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET: Obtiene todos los pedidos mayoristas
export async function GET(request: NextRequest) {
    try {
        const pool = getPool();
        const query = `
            SELECT 
                o.id,
                o.order_number,
                o.status,
                o.payment_status,
                'net_7' AS payment_terms, -- Simulado, en un futuro vendría de la DB
                o.created_at AS order_date,
                o.delivery_date,
                (o.delivery_date + INTERVAL '7 day') AS payment_due_date, -- Simulado: vence 7 días post-entrega
                CASE 
                    WHEN o.payment_status = 'pending' AND (o.delivery_date + INTERVAL '7 day') < CURRENT_DATE
                    THEN 'overdue'
                    ELSE o.payment_status
                END AS calculated_payment_status,
                CASE 
                    WHEN o.payment_status = 'pending' AND (o.delivery_date + INTERVAL '7 day') < CURRENT_DATE
                    THEN EXTRACT(DAY FROM CURRENT_DATE - (o.delivery_date + INTERVAL '7 day'))
                    ELSE 0
                END AS days_overdue,
                o.total AS total_amount,
                c.first_name || ' ' || c.last_name AS customer_name,
                c.email AS customer_email,
                c.phone AS customer_phone
            FROM orders AS o
            JOIN customers AS c ON o.customer_id = c.id
            WHERE o.order_type = 'wholesale'
            ORDER BY calculated_payment_status, days_overdue DESC, o.delivery_date ASC;
        `;
        const { rows } = await pool.query(query);
        // Mapeamos para asegurar que los nombres de campo coincidan con el componente
        const orders = rows.map(row => ({
            ...row,
            payment_status: row.calculated_payment_status
        }));
        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error al obtener pedidos mayoristas:', error);
        return NextResponse.json({ message: 'Error interno del servidor', error: String(error) }, { status: 500 });
    }
}

// PATCH: Actualiza el estado de pago de un pedido
export async function PATCH(request: NextRequest) {
    try {
        const { orderId, payment_status } = await request.json();
        if (!orderId || !payment_status) {
            return NextResponse.json({ message: "Se requiere orderId y payment_status" }, { status: 400 });
        }
        const pool = getPool();
        const { rows } = await pool.query(
            "UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2 AND order_type = 'wholesale' RETURNING *",
            [payment_status, orderId]
        );
        if (rows.length === 0) {
            return NextResponse.json({ message: "Pedido mayorista no encontrado" }, { status: 404 });
        }
        return NextResponse.json({ message: "Estado de pago actualizado", order: rows[0] });
    } catch (error) {
        console.error('Error al actualizar estado de pago:', error);
        return NextResponse.json({ message: 'Error interno del servidor', error: String(error) }, { status: 500 });
    }
}
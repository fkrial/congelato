import { type NextRequest, NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET: Obtiene el plan de producción para una fecha
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    try {
        const pool = getPool();
        const client = await pool.connect();
        
        let plan;
        const planRes = await client.query('SELECT * FROM production_plans WHERE date = $1', [date]);
        
        if (planRes.rows.length > 0) {
            plan = planRes.rows[0];
            const itemsRes = await client.query(`
                SELECT ppi.*, p.name as product_name 
                FROM production_plan_items ppi
                JOIN products p ON ppi.product_id = p.id
                WHERE ppi.plan_id = $1 ORDER BY ppi.priority ASC, ppi.id ASC`, [plan.id]
            );
            plan.items = itemsRes.rows;
        } else {
            // Si no existe plan, creamos uno 'draft' con sugerencias
            const suggestionsQuery = `
                SELECT p.id as product_id, p.name as product_name, SUM(oi.quantity) as total_quantity
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                JOIN products p ON oi.product_id = p.id
                WHERE o.status = 'confirmed' AND o.delivery_date = $1
                GROUP BY p.id, p.name ORDER BY total_quantity DESC;
            `;
            const { rows: suggestions } = await client.query(suggestionsQuery, [date]);
            plan = {
                date,
                status: 'draft',
                items: suggestions.map((row, index) => ({
                    id: `sugg-${row.product_id}`,
                    product_id: row.product_id,
                    product_name: row.product_name,
                    quantity_needed: parseInt(row.total_quantity),
                    status: 'scheduled',
                    progress: 0,
                    priority: index < 2 ? 1 : 2,
                    assigned_to: 'Equipo A',
                }))
            };
        }
        
        client.release();
        return NextResponse.json({ plan });
    } catch (error) {
        console.error('Error al obtener el plan de producción:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}

// POST: Crea un nuevo item en el plan de producción
export async function POST(request: NextRequest) {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const { date, productId, quantity } = await request.json();
        await client.query('BEGIN');

        let planId;
        const planRes = await client.query('SELECT id FROM production_plans WHERE date = $1', [date]);
        if (planRes.rows.length > 0) {
            planId = planRes.rows[0].id;
        } else {
            const newPlanRes = await client.query("INSERT INTO production_plans (date, status) VALUES ($1, 'confirmed') RETURNING id", [date]);
            planId = newPlanRes.rows[0].id;
        }

        const newItemQuery = `
            INSERT INTO production_plan_items (plan_id, product_id, quantity_needed, status)
            VALUES ($1, $2, $3, 'scheduled') RETURNING *;
        `;
        const newItemRes = await client.query(newItemQuery, [planId, productId, quantity]);
        
        await client.query('COMMIT');
        client.release();
        return NextResponse.json({ message: "Item de producción añadido.", item: newItemRes.rows[0] }, { status: 201 });
    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json({ message: 'Error al añadir item de producción' }, { status: 500 });
    }
}
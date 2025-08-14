import { type NextRequest, NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// PUT: Actualiza un item de producción
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const body = await request.json();
        const { status, progress, quantity_needed, assigned_to } = body;
        
        const pool = getPool();
        const client = await pool.connect();
        
        const updateFields = [];
        const values = [];
        let paramIndex = 1;

        if (status !== undefined) {
            updateFields.push(`status = $${paramIndex++}`);
            values.push(status);
        }
        if (progress !== undefined) {
            updateFields.push(`progress = $${paramIndex++}`);
            values.push(progress);
        }
        if (quantity_needed !== undefined) {
            updateFields.push(`quantity_needed = $${paramIndex++}`);
            values.push(quantity_needed);
        }
        if (assigned_to !== undefined) {
            updateFields.push(`assigned_to = $${paramIndex++}`);
            values.push(assigned_to);
        }

        if (updateFields.length === 0) {
            client.release();
            return NextResponse.json({ message: 'No se proporcionaron campos para actualizar' }, { status: 400 });
        }

        // Añadimos la actualización de 'updated_at'
        updateFields.push(`updated_at = NOW()`);

        values.push(id);
        const query = `UPDATE production_plan_items SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        
        const { rows } = await client.query(query, values);
        client.release();
        
        if (rows.length === 0) {
            return NextResponse.json({ message: 'Item de producción no encontrado' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Item actualizado', item: rows[0] });
    } catch (error) {
        console.error("Error al actualizar item de producción:", error);
        return NextResponse.json({ message: 'Error al actualizar item', error: (error as Error).message }, { status: 500 });
    }
}
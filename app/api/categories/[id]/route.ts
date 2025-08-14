// app/api/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET: Obtener una categoría por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const pool = getPool();
        const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (rows.length === 0) {
            return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}

// PUT: Actualizar una categoría por ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const { name, description } = await request.json();
        const pool = getPool();
        const { rows } = await pool.query(
            'UPDATE categories SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        if (rows.length === 0) {
            return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Categoría actualizada con éxito', category: rows[0] });
    } catch (error) {
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}

// DELETE: Borrar una categoría por ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const pool = getPool();
        const { rowCount } = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        if (rowCount === 0) {
            return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Categoría borrada con éxito' });
    } catch (error) {
        return NextResponse.json({ message: 'Error interno del servidor', error: "No se puede eliminar una categoría si está siendo usada por algún producto." }, { status: 500 });
    }
}
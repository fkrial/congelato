// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET: Obtiene la lista de categorías (sin cambios)
export async function GET() {
  try {
    const pool = getPool();
    const { rows } = await pool.query('SELECT * FROM categories WHERE is_active = true ORDER BY name ASC');
    return NextResponse.json({ categories: rows });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crea una nueva categoría
export async function POST(request: Request) {
    try {
        const { name, description } = await request.json();
        if (!name) {
            return NextResponse.json({ message: "El nombre es requerido" }, { status: 400 });
        }
        const pool = getPool();
        const { rows } = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        return NextResponse.json({ message: "Categoría creada con éxito", category: rows[0] }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
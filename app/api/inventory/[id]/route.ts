// app/api/inventory/[id]/route.ts
import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET un solo material por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = getPool();
    const { rows } = await pool.query('SELECT * FROM raw_materials WHERE id = $1', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Material no encontrado' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener material:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT (UPDATE) para actualizar un material
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = getPool();
    const body = await request.json();
    const { name, category, unit, costPerUnit, currentStock, minStock, supplier } = body;

    if (!name || !unit || !costPerUnit || !minStock) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
    }

    const query = `
      UPDATE raw_materials
      SET name = $1, category = $2, unit = $3, cost_per_unit = $4, current_stock = $5, minimum_stock = $6, supplier = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *;
    `;
    const values = [name, category, unit, parseFloat(costPerUnit), parseFloat(currentStock), parseFloat(minStock), supplier, id];
    
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Material no encontrado para actualizar' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Material actualizado con éxito', material: rows[0] });
  } catch (error) {
    console.error('Error al actualizar material:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE para borrar un material
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = getPool();
    const { rowCount } = await pool.query('DELETE FROM raw_materials WHERE id = $1', [id]);
    if (rowCount === 0) {
      return NextResponse.json({ message: 'Material no encontrado para borrar' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Material borrado con éxito' });
  } catch (error) {
    console.error('Error al borrar material:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
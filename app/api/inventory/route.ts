import { type NextRequest, NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

function getStockStatus(current: number, min: number): string {
  if (current <= 0) return 'out_of_stock';
  if (current <= min) return 'low_stock';
  return 'in_stock';
}

// ====================================================================
// ÚNICA FUNCIÓN GET - Para leer el inventario CON filtros
// ====================================================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search');
  const status = searchParams.get('status');
  const category = searchParams.get('category');

  try {
    const pool = getPool();
    let query = `SELECT * FROM raw_materials`;
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (searchTerm) {
      conditions.push(`name ILIKE $${paramIndex}`);
      queryParams.push(`%${searchTerm}%`);
      paramIndex++;
    }
    if (category && category !== 'all') {
      conditions.push(`category = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY name ASC;';

    const { rows } = await pool.query(query, queryParams);

    let inventoryData = rows.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category || 'Sin Categoría',
      currentStock: parseFloat(item.current_stock),
      minStock: parseFloat(item.minimum_stock),
      unit: item.unit,
      costPerUnit: parseFloat(item.cost_per_unit),
      supplier: item.supplier || 'N/A',
      lastUpdated: new Date(item.updated_at).toLocaleDateString('es-ES'),
      status: getStockStatus(parseFloat(item.current_stock), parseFloat(item.minimum_stock)),
    }));

    if (status && status !== 'all') {
        inventoryData = inventoryData.filter(item => item.status === status);
    }

    return NextResponse.json({ inventory: inventoryData });

  } catch (error) {
    console.error('Error al obtener el inventario:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: String(error) }, { status: 500 });
  }
}

// ====================================================================
// ÚNICA FUNCIÓN POST - Para crear un nuevo material
// ====================================================================
export async function POST(request: Request) {
  try {
    const pool = getPool();
    const body = await request.json();
    const { name, category, unit, costPerUnit, currentStock, minStock, supplier } = body;

    if (!name || !unit || !costPerUnit || !minStock) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
    }

    const query = `
      INSERT INTO raw_materials (name, category, unit, cost_per_unit, current_stock, minimum_stock, supplier, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *; 
    `;
    const values = [name, category, unit, parseFloat(costPerUnit), parseFloat(currentStock) || 0, parseFloat(minStock), supplier];
    
    const { rows } = await pool.query(query, values);

    return NextResponse.json({ message: "Material creado con éxito", material: rows[0] }, { status: 201 });

  } catch (error) {
    console.error('Error al crear el material:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: String(error) }, { status: 500 });
  }
}
// app/api/products/route.ts
import { NextResponse, NextRequest } from 'next/server';
import getPool from '@/lib/db/postgres'; // <-- SIN llaves

export async function GET(request: NextRequest) {
  try {
    const pool = getPool();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    let query = `
      SELECT p.*, c.name AS category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    
    const conditions = ["p.is_active = true"];
    const queryParams: any[] = [];

    if (featured === 'true') {
      conditions.push('p.is_featured = true');
    }

    if (categoryId && categoryId !== 'all') {
      queryParams.push(categoryId);
      conditions.push(`p.category_id = $${queryParams.length}`);
    }

    if (search) {
      queryParams.push(`%${search}%`);
      conditions.push(`p.name ILIKE $${queryParams.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY p.name ASC;';

    const { rows } = await pool.query(query, queryParams);
    return NextResponse.json({ products: rows });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}


// La función POST se mantiene igual...
export async function POST(request: Request) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    const { variants, ...productData } = await request.json();
    
    await client.query('BEGIN');

    const productQuery = `
      INSERT INTO products (
        name, description, category_id, base_price, cost_price, is_active, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `;
    const productValues = [
      productData.name, productData.description, productData.categoryId, 
      productData.basePrice, productData.costPrice, productData.isActive, productData.isFeatured
    ];
    const productResult = await client.query(productQuery, productValues);
    const newProductId = productResult.rows[0].id;

    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        const variantQuery = `
          INSERT INTO product_variants (product_id, name, price_modifier, cost_modifier, is_available)
          VALUES ($1, $2, $3, $4, $5);
        `;
        const variantValues = [newProductId, variant.name, variant.price_modifier || 0, variant.cost_modifier || 0, variant.is_available];
        await client.query(variantQuery, variantValues);
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({ message: "Producto creado con éxito", productId: newProductId }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear el producto:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}
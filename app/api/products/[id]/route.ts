// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres'; // <-- SIN llaves

// GET: Obtiene un producto específico con sus variantes
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const pool = getPool();
    const client = await pool.connect();
    try {
        const productRes = await client.query('SELECT * FROM products WHERE id = $1', [id]);
        if (productRes.rows.length === 0) {
            return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
        }
        
        const variantsRes = await client.query('SELECT * FROM product_variants WHERE product_id = $1 ORDER BY id ASC', [id]);
        
        const product = productRes.rows[0];
        product.variants = variantsRes.rows;

        return NextResponse.json(product);
    } catch (error) {
        console.error(`Error al obtener producto con ID ${id}:`, error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}

// PUT: Actualiza un producto y sus variantes (transaccional)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const pool = getPool();
    const client = await pool.connect();

    try {
        const { variants, ...productData } = await request.json();
        await client.query('BEGIN');

        // 1. Actualizar el producto principal
        const productQuery = `
            UPDATE products SET
                name = $1, description = $2, category_id = $3, base_price = $4, cost_price = $5, 
                is_active = $6, is_featured = $7, updated_at = NOW()
            WHERE id = $8;
        `;
        const productValues = [
            productData.name, productData.description, productData.categoryId,
            productData.basePrice, productData.costPrice, productData.isActive, productData.isFeatured, id
        ];
        await client.query(productQuery, productValues);

        // 2. Borrar variantes antiguas
        await client.query('DELETE FROM product_variants WHERE product_id = $1', [id]);

        // 3. Insertar las nuevas variantes
        if (variants && Array.isArray(variants) && variants.length > 0) {
            for (const variant of variants) {
                const variantQuery = `
                  INSERT INTO product_variants (product_id, name, price_modifier, cost_modifier, is_available)
                  VALUES ($1, $2, $3, $4, $5);
                `;
                await client.query(variantQuery, [id, variant.name, variant.price_modifier, variant.cost_modifier, variant.is_available]);
            }
        }
        
        await client.query('COMMIT');
        return NextResponse.json({ message: "Producto actualizado con éxito" });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Error al actualizar producto con ID ${id}:`, error);
        return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
    } finally {
        client.release();
    }
}

// DELETE: Elimina un producto (las variantes se borran en cascada)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const pool = getPool();
        // Gracias a "ON DELETE CASCADE" en la DB, las variantes se borran solas.
        const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        
        if (rowCount === 0) {
            return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Producto borrado con éxito' });
    } catch (error) {
        console.error(`Error al borrar producto con ID ${id}:`, error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
// app/api/recipes/[id]/route.ts
import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET: Obtiene una receta específica con sus ingredientes
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ message: 'ID de receta no proporcionado' }, { status: 400 });
    }

    const pool = getPool();
    const client = await pool.connect();
    try {
        const recipeRes = await client.query('SELECT * FROM recipes WHERE id = $1', [id]);
        if (recipeRes.rows.length === 0) {
            return NextResponse.json({ message: 'Receta no encontrada' }, { status: 404 });
        }
        
        const ingredientsRes = await client.query('SELECT * FROM recipe_ingredients WHERE recipe_id = $1', [id]);
        
        const recipe = recipeRes.rows[0];
        recipe.ingredients = ingredientsRes.rows; // Adjuntamos los ingredientes al objeto

        return NextResponse.json(recipe);
    } catch (error) {
        console.error(`Error al obtener receta con ID ${id}:`, error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}

// PUT: Actualiza una receta y sus ingredientes
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const pool = getPool();
    const client = await pool.connect();

    try {
        const body = await request.json();
        const { name, description, category, difficulty, prepTime, cookTime, yield_quantity, yield_unit, sellingPrice, ingredients, totalCost } = body;

        await client.query('BEGIN'); // Iniciar transacción

        // 1. Actualizar la receta principal
        const recipeQuery = `
            UPDATE recipes 
            SET name = $1, description = $2, category = $3, difficulty = $4, prep_time = $5, cook_time = $6, 
                yield_quantity = $7, yield_unit = $8, selling_price = $9, total_cost = $10, updated_at = NOW()
            WHERE id = $11;
        `;
        await client.query(recipeQuery, [name, description, category, difficulty, prepTime, cookTime, yield_quantity, yield_unit, sellingPrice, totalCost, id]);

        // 2. Borrar los ingredientes antiguos
        await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);

        // 3. Insertar los nuevos ingredientes
        if (ingredients && ingredients.length > 0) {
            for (const ing of ingredients) {
                const ingredientQuery = `
                    INSERT INTO recipe_ingredients (recipe_id, raw_material_id, quantity, unit, cost)
                    VALUES ($1, $2, $3, $4, $5);
                `;
                await client.query(ingredientQuery, [id, ing.materialId, ing.quantity, ing.unit, ing.cost]);
            }
        }

        await client.query('COMMIT');

        return NextResponse.json({ message: "Receta actualizada con éxito" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Error al actualizar receta con ID ${id}:`, error);
        return NextResponse.json({ message: 'Error interno del servidor', error: String(error) }, { status: 500 });
    } finally {
        client.release();
    }
}

// DELETE: Borra una receta y sus ingredientes
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const pool = getPool();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);
        const { rowCount } = await client.query('DELETE FROM recipes WHERE id = $1', [id]);
        await client.query('COMMIT');

        if (rowCount === 0) {
          return NextResponse.json({ message: 'Receta no encontrada' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Receta borrada con éxito' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Error al borrar receta con ID ${id}:`, error);
        return NextResponse.json({ message: 'Error interno del servidor', error: String(error) }, { status: 500 });
    } finally {
        client.release();
    }
}
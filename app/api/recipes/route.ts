// app/api/recipes/route.ts
import { NextResponse, NextRequest } from 'next/server';
import getPool from '@/lib/db/postgres';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search');
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');

  try {
    const pool = getPool();
    let query = `SELECT * FROM recipes`;
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
    if (difficulty && difficulty !== 'all') {
        conditions.push(`difficulty = $${paramIndex}`);
        queryParams.push(difficulty);
        paramIndex++;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY name ASC';
    
    const { rows } = await pool.query(query, queryParams);
    return NextResponse.json({ recipes: rows });
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// NUEVA Y COMPLETA función POST para crear una receta con sus ingredientes
export async function POST(request: Request) {
  const pool = getPool();
  // Obtenemos un "cliente" del pool para manejar la transacción
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { 
      name, description, category, difficulty, prepTime, cookTime, 
      yield_quantity, yield_unit, sellingPrice, ingredients, totalCost 
    } = body;

    // --- INICIO DE LA TRANSACCIÓN ---
    await client.query('BEGIN');

    // 1. Insertar la receta principal en la tabla 'recipes'
    const recipeQuery = `
      INSERT INTO recipes 
        (name, description, category, difficulty, prep_time, cook_time, yield_quantity, yield_unit, selling_price, total_cost, created_at, updated_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING id;
    `;
    const recipeValues = [
      name, description, category, difficulty, prepTime, cookTime, 
      yield_quantity, yield_unit, sellingPrice, totalCost
    ];
    const recipeResult = await client.query(recipeQuery, recipeValues);
    const newRecipeId = recipeResult.rows[0].id;

    // 2. Insertar cada ingrediente en la tabla 'recipe_ingredients'
    if (ingredients && ingredients.length > 0) {
      for (const ing of ingredients) {
        const ingredientQuery = `
          INSERT INTO recipe_ingredients (recipe_id, raw_material_id, quantity, unit, cost)
          VALUES ($1, $2, $3, $4, $5);
        `;
        // Asegúrate de que los nombres de las propiedades coincidan con los del frontend
        const ingredientValues = [newRecipeId, ing.materialId, ing.quantity, ing.unit, ing.cost];
        await client.query(ingredientQuery, ingredientValues);
      }
    }
    
    // Si todo fue bien, confirmamos los cambios en la base de datos
    await client.query('COMMIT');

    return NextResponse.json({ message: "Receta creada con éxito", recipeId: newRecipeId }, { status: 201 });

  } catch (error) {
    // Si algo falla, revertimos TODOS los cambios hechos en la transacción
    await client.query('ROLLBACK');
    console.error('Error al crear receta:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: String(error) }, { status: 500 });
  } finally {
    // Liberamos el cliente para que vuelva al pool, sin importar si hubo éxito o error
    client.release();
  }
}
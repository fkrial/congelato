import { type NextRequest, NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET: Obtiene toda la configuración
export async function GET() {
    try {
        const pool = getPool();
        const { rows } = await pool.query('SELECT key, value FROM settings');
        
        // Convertimos el array de {key, value} en un solo objeto
        const settings = rows.reduce((acc, row) => {
            acc[row.key] = row.value;
            return acc;
        }, {});

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener la configuración' }, { status: 500 });
    }
}

// POST: Guarda la configuración (sobrescribe todo)
export async function POST(request: NextRequest) {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const settings = await request.json();
        
        await client.query('BEGIN');

        for (const key in settings) {
            const value = JSON.stringify(settings[key]);
            const query = `
                INSERT INTO settings (key, value) 
                VALUES ($1, $2)
                ON CONFLICT (key) 
                DO UPDATE SET value = $2, updated_at = NOW();
            `;
            await client.query(query, [key, value]);
        }
        
        await client.query('COMMIT');
        return NextResponse.json({ message: 'Configuración guardada con éxito.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error guardando configuración:", error);
        return NextResponse.json({ message: 'Error al guardar la configuración' }, { status: 500 });
    } finally {
        client.release();
    }
}
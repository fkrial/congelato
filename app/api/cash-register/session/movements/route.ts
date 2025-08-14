import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// POST: Añade un nuevo movimiento a la caja activa
export async function POST(request: Request) {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const { type, amount, description } = await request.json();
        const token = cookies().get('auth_token')?.value;
        const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: number };
        const userId = decoded.id;
        
        const sessionRes = await client.query("SELECT id FROM cash_sessions WHERE status = 'open' LIMIT 1");
        if (sessionRes.rows.length === 0) {
            return NextResponse.json({ message: 'No hay una caja abierta para registrar movimientos.' }, { status: 400 });
        }
        const sessionId = sessionRes.rows[0].id;
        
        const movementAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

        const movementRes = await client.query(
            "INSERT INTO cash_movements (session_id, type, amount, description, created_by_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [sessionId, type, movementAmount, description, userId]
        );

        return NextResponse.json({ message: 'Movimiento registrado con éxito', movement: movementRes.rows[0] }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al registrar el movimiento' }, { status: 500 });
    } finally {
        client.release();
    }
}
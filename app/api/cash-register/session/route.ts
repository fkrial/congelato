import { type NextRequest, NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';
import jwt from 'jsonwebtoken';

// GET: Obtiene la sesión de caja activa, si existe
export async function GET(request: NextRequest) {
    console.log("\n--- [API] INICIANDO GET /api/cash-register/session ---");
    const pool = getPool();
    const client = await pool.connect();
    try {
        const sessionRes = await client.query("SELECT * FROM cash_sessions WHERE status = 'open' ORDER BY opened_at DESC LIMIT 1");
        if (sessionRes.rows.length === 0) {
            console.log("No se encontró ninguna sesión de caja abierta.");
            return NextResponse.json({ session: null });
        }
        const session = sessionRes.rows[0];
        console.log(`Sesión abierta encontrada: ID ${session.id}`);
        const movementsRes = await client.query("SELECT * FROM cash_movements WHERE session_id = $1 ORDER BY created_at ASC", [session.id]);
        console.log(`Se encontraron ${movementsRes.rows.length} movimientos para esta sesión.`);
        return NextResponse.json({ session, movements: movementsRes.rows });
    } catch (error) {
        console.error("--- [API] ERROR en GET /api/cash-register/session ---", error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    } finally {
        client.release();
        console.log("--- [API] FIN DE LA PETICIÓN GET ---");
    }
}

// POST: Abre una nueva sesión de caja
export async function POST(request: NextRequest) {
    console.log("\n--- [API] INICIANDO POST /api/cash-register/session ---");
    const pool = getPool();
    const client = await pool.connect();
    
    try {
        console.log("Paso 1: Leyendo body de la petición...");
        const { start_amount } = await request.json();
        console.log(`Paso 2: Monto inicial recibido: ${start_amount}`);

        console.log("Paso 3: Obteniendo token de las cookies...");
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            console.error("Error: No se encontró el token de autenticación.");
            return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
        }
        console.log("Paso 4: Token encontrado.");

        console.log("Paso 5: Verificando JWT_SECRET...");
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("ERROR CRÍTICO: La variable de entorno JWT_SECRET no está definida en el servidor.");
            throw new Error("JWT_SECRET no está configurado en el servidor.");
        }
        console.log("Paso 6: JWT_SECRET encontrado.");

        console.log("Paso 7: Verificando el token...");
        const decoded = jwt.verify(token, jwtSecret) as { id: number };
        const userId = decoded.id;
        console.log(`Paso 8: Token verificado. User ID: ${userId}`);

        await client.query('BEGIN');
        console.log("Paso 9: Transacción iniciada.");
        
        const existingSession = await client.query("SELECT id FROM cash_sessions WHERE status = 'open'");
        if (existingSession.rows.length > 0) {
            console.warn("Advertencia: Se intentó abrir una caja que ya estaba abierta.");
            await client.query('ROLLBACK');
            return NextResponse.json({ message: 'Ya hay una caja abierta.' }, { status: 409 });
        }
        
        console.log("Paso 10: Insertando nueva sesión de caja...");
        const sessionRes = await client.query(
            "INSERT INTO cash_sessions (start_amount, opened_by_id, status) VALUES ($1, $2, 'open') RETURNING *",
            [start_amount, userId]
        );
        const newSession = sessionRes.rows[0];
        console.log(`Paso 11: Sesión creada con ID: ${newSession.id}`);

        console.log("Paso 12: Insertando movimiento inicial...");
        await client.query(
            "INSERT INTO cash_movements (session_id, type, amount, description, created_by_id) VALUES ($1, 'initial', $2, 'Apertura de caja', $3)",
            [newSession.id, start_amount, userId]
        );
        console.log("Paso 13: Movimiento inicial creado.");

        await client.query('COMMIT');
        console.log("Paso 14: Transacción completada (COMMIT).");

        return NextResponse.json({ message: 'Caja abierta con éxito', session: newSession }, { status: 201 });

    } catch (error) {
        console.error("--- [API] ERROR CAPTURADO EN EL BLOQUE CATCH ---");
        console.error(error);
        await client.query('ROLLBACK');
        console.log("Transacción revertida (ROLLBACK).");
        return NextResponse.json({ message: 'Error al abrir la caja', error: (error as Error).message }, { status: 500 });
    } finally {
        client.release();
        console.log("--- [API] FIN DE LA PETICIÓN POST ---");
    }
}

// PUT: Cierra la sesión de caja activa
export async function PUT(request: NextRequest) {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const { end_amount, notes } = await request.json();
        
        const token = request.cookies.get('auth_token')?.value;
        
        if (!token) {
            return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET no está configurado en el servidor.");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
        const userId = decoded.id;

        const sessionRes = await client.query("SELECT id FROM cash_sessions WHERE status = 'open' LIMIT 1");
        if (sessionRes.rows.length === 0) {
            return NextResponse.json({ message: 'No hay ninguna caja abierta para cerrar.' }, { status: 404 });
        }
        const session = sessionRes.rows[0];

        const movementsSumRes = await client.query("SELECT SUM(amount) as total FROM cash_movements WHERE session_id = $1", [session.id]);
        const calculated_end_amount = parseFloat(movementsSumRes.rows[0].total || 0);
        const difference = parseFloat(end_amount) - calculated_end_amount;

        await client.query(
            "UPDATE cash_sessions SET end_amount = $1, calculated_end_amount = $2, difference = $3, status = 'closed', closed_by_id = $4, closed_at = NOW(), notes = $5 WHERE id = $6",
            [end_amount, calculated_end_amount, difference, userId, notes, session.id]
        );

        return NextResponse.json({ message: 'Caja cerrada con éxito.' });
    } catch (error) {
        console.error("Error closing cash session:", error);
        return NextResponse.json({ message: 'Error al cerrar la caja' }, { status: 500 });
    } finally {
        client.release();
    }
}
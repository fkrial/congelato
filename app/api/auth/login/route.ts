import { NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose'; // <-- Cambiamos a jose
import { cookies } from 'next/headers';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    return new TextEncoder().encode(secret);
};

export async function POST(request: Request) {
    try {
        const pool = getPool();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email y contraseña son requeridos.' }, { status: 400 });
        }

        const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
        const user = rows[0];

        if (!user) {
            return NextResponse.json({ message: 'Credenciales inválidas.' }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return NextResponse.json({ message: 'Credenciales inválidas.' }, { status: 401 });
        }
        
        // Crear el token JWT usando 'jose'
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(getJwtSecretKey());
        
        // Almacenar el token en una cookie
        cookies().set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 día
            path: '/',
        });

        return NextResponse.json({ message: 'Login exitoso.' });

    } catch (error) {
        console.error('Error en el login:', error);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}
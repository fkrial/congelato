// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Eliminar la cookie de autenticación
        cookies().set('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: -1, // Expira la cookie inmediatamente
            path: '/',
        });

        return NextResponse.json({ message: 'Logout exitoso.' });
    } catch (error) {
        console.error('Error en el logout:', error);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}
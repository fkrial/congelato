import { type NextRequest, NextResponse } from "next/server";
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    
    // *** LA CORRECCIÓN ESTÁ AQUÍ ***
    // Usamos la variable de entorno para asegurar la URL y el puerto correctos.
    // Asegúrate de que en tu .env.local tengas NEXT_PUBLIC_BASE_URL="http://localhost:3000"
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_BASE_URL no está definido en las variables de entorno.");
    }
    const orderUrl = `${baseUrl}/orders/${id}`;
    
    let browser = null;
    try {
        console.log("Iniciando generación de PDF de Pedido para:", orderUrl);
        
        const isProduction = process.env.NODE_ENV === 'production';
        const localChromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        let executablePath: string;

        if (isProduction) {
            executablePath = await chromium.executablePath();
        } else {
            if (fs.existsSync(localChromePath)) {
                executablePath = localChromePath;
            } else {
                executablePath = await chromium.executablePath();
            }
        }
        
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto(orderUrl, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="pedido-${id}.pdf"`,
            },
        });
        
    } catch (error) {
        console.error("Error al generar el PDF del pedido:", error);
        return NextResponse.json({ message: "Error al generar el PDF", error: (error as Error).message }, { status: 500 });
    } finally {
        if (browser) await browser.close();
    }
}
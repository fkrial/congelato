import { type NextRequest, NextResponse } from "next/server";
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    // --- INICIO DE LA CORRECCIÓN ---
    // Usamos la IP de la red en lugar de 'localhost' para el navegador headless
    const host = request.nextUrl.host.includes('localhost')
        ? `127.0.0.1:${request.nextUrl.port}` // Usar 127.0.0.1 es más fiable que localhost
        : request.nextUrl.host;
    
    const protocol = request.nextUrl.protocol;
    const quoteUrl = `${protocol}//${host}/quotes/${id}`;
    // --- FIN DE LA CORRECCIÓN ---
    
    let browser = null;
    try {
        console.log("Iniciando generación de PDF para:", quoteUrl);

        const isProduction = process.env.NODE_ENV === 'production';
        const localChromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        let executablePath: string;

        if (isProduction) {
            executablePath = await chromium.executablePath();
        } else {
            if (fs.existsSync(localChromePath)) {
                executablePath = localChromePath;
            } else {
                console.warn("Chrome local no encontrado. Usando chromium de @sparticuz.");
                executablePath = await chromium.executablePath();
            }
        }
        
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        console.log("Abriendo página en el navegador headless...");
        await page.goto(quoteUrl, { waitUntil: 'networkidle0' });
        console.log("Página cargada. Generando PDF...");

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        console.log("PDF generado exitosamente.");

        const response = new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="presupuesto-${id}.pdf"`,
            },
        });
        
        return response;

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        return NextResponse.json({ message: "Error al generar el PDF", error: (error as Error).message }, { status: 500 });
    } finally {
        if (browser !== null) {
            await browser.close();
            console.log("Navegador cerrado.");
        }
    }
}
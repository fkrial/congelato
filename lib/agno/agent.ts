// File: lib/agno/agent.ts

import { spawn } from 'child_process';
import path from 'path';

/**
 * Ejecuta el script del agente de Python y obtiene una respuesta.
 * @param userMessage El mensaje del usuario de WhatsApp.
 * @param sessionId Un identificador único para la conversación (el número de WhatsApp).
 * @returns La respuesta de texto del agente.
 */
export function getAgnoResponse(userMessage: string, sessionId: string): Promise<string> {
  // Devolvemos una Promise porque ejecutar el script es un proceso asíncrono.
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    
    // Ruta al ejecutable de Python dentro del entorno virtual
    const pythonExecutable = isWindows 
      ? path.join(process.cwd(), 'scripts', 'agente_congelato', 'venv', 'Scripts', 'python.exe')
      : path.join(process.cwd(), 'scripts', 'agente_congelato', 'venv', 'bin', 'python3');

    // Ruta al script que queremos ejecutar
    const scriptPath = path.join(process.cwd(), 'scripts', 'agente_congelato', 'playground_congelato.py');
    
    console.log(`Ejecutando: ${pythonExecutable} ${scriptPath}`);

    // Verificamos si el ejecutable de Python existe antes de intentar usarlo
    const fs = require('fs');
    if (!fs.existsSync(pythonExecutable)) {
        console.error(`Error: No se encontró el ejecutable de Python en: ${pythonExecutable}`);
        reject(new Error("El entorno virtual de Python no está configurado correctamente."));
        return;
    }

    const pythonProcess = spawn(pythonExecutable, [scriptPath]);

    let responseData = '';
    let errorData = '';

    // Enviamos los datos al script de Python como un string JSON en una sola línea.
    const inputData = JSON.stringify({ message: userMessage, sessionId: sessionId });
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();

    // Escuchamos lo que el script de Python imprime (su salida estándar).
    pythonProcess.stdout.on('data', (data) => {
      responseData += data.toString();
    });

    // Escuchamos si hay algún error.
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    // Cuando el proceso de Python termina, resolvemos la Promise.
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Error en script de Python (código ${code}): ${errorData}`);
        reject(new Error("El script del agente de Python falló. Revisa la consola para más detalles."));
      } else {
        try {
          // A veces la respuesta puede tener logs extra, buscamos solo el JSON
          const jsonMatch = responseData.match(/{.*}/s);
          if (jsonMatch) {
            const response = JSON.parse(jsonMatch[0]);
            resolve(response.answer || "El agente no dio una respuesta válida.");
          } else {
            throw new Error("No se encontró un JSON en la respuesta.");
          }
        } catch (e) {
          console.error("Error al parsear la respuesta de Python:", responseData);
          reject(new Error("La respuesta del agente no es un JSON válido."));
        }
      }
    });
  });
}
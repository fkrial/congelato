import { Pool } from 'pg';

let pool: Pool;
let hasConnected = false; 

const getPool = () => {
  if (!pool) {
    console.log("Creando un nuevo pool de conexiones a PostgreSQL...");
    if (!process.env.DATABASE_URL) {
      console.error("ERROR CRÍTICO: La variable de entorno DATABASE_URL no está definida.");
      throw new Error('La variable de entorno DATABASE_URL no está definida.');
    }
    
    const connectionUrl = new URL(process.env.DATABASE_URL);
    console.log(`Intentando conectar a: postgresql://${connectionUrl.username}:****@${connectionUrl.hostname}:${connectionUrl.port}/${connectionUrl.pathname.substring(1)}`);

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    pool.on('connect', () => {
        if (!hasConnected) {
            console.log('✅ Conexión exitosa a la base de datos PostgreSQL establecida.');
            hasConnected = true;
        }
    });

    pool.on('error', (err, client) => {
        console.error('❌ Error inesperado en el cliente del pool de PostgreSQL', err);
        process.exit(-1);
    });
  }
  return pool;
};

// Asegúrate de que esta línea esté presente y sea la exportación por defecto
export default getPool;
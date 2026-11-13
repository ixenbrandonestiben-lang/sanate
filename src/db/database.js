// src/db/database.js
// Placeholder para la conexión a base de datos (Fase 2).
// Por ahora no hace nada, pero la arquitectura ya deja el espacio.

/**
 * Conecta a la base de datos (SQLite / Supabase / PostgreSQL).
 * Implementar en Fase 2 cuando migremos de JSON a DB real.
 */
export const connectDatabase = async () => {
  console.log('📦 Database connection: usando JSON file (Fase 1)');
  // TODO Fase 2: Implementar conexión real
  // const { Pool } = await import('pg');
  // return new Pool({ connectionString: process.env.DATABASE_URL });
};

export default { connectDatabase };
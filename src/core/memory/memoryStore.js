// src/core/memory/memoryStore.js
// Driver de almacenamiento: lee y escribe en data/memory.json (Fase 1).
// Cuando migremos a SQLite/Supabase, solo cambiamos este archivo.

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from '../../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEMORY_FILE = path.join(__dirname, '../../../', PATHS.memoryFile);

/**
 * Lee toda la memoria desde el archivo JSON.
 * Si no existe, crea uno vacío.
 */
const readMemoryFile = async () => {
  try {
    const data = await fs.readFile(MEMORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Archivo no existe, crear uno vacío
      await fs.writeFile(MEMORY_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    throw error;
  }
};

/**
 * Escribe la memoria completa en el archivo JSON.
 */
const writeMemoryFile = async (data) => {
  await fs.writeFile(MEMORY_FILE, JSON.stringify(data, null, 2));
};

/**
 * Obtiene los datos de un usuario específico.
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object|null>} Datos del usuario o null si no existe
 */
export const getUserData = async (userId) => {
  const memory = await readMemoryFile();
  return memory[userId] || null;
};

/**
 * Guarda o actualiza los datos de un usuario.
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos a guardar
 */
export const setUserData = async (userId, userData) => {
  const memory = await readMemoryFile();
  memory[userId] = {
    ...memory[userId],
    ...userData,
    updatedAt: new Date().toISOString(),
  };
  await writeMemoryFile(memory);
};

/**
 * Elimina todos los datos de un usuario.
 * @param {string} userId - ID del usuario
 */
export const deleteUserData = async (userId) => {
  const memory = await readMemoryFile();
  delete memory[userId];
  await writeMemoryFile(memory);
};
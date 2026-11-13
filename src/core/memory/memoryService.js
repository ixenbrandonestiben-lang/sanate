// src/core/memory/memoryService.js
// Lógica de memoria: gestiona historial de mensajes y extracción de "hechos".
// Este servicio decide QUÉ recordar y CÓMO organizarlo.

import { getUserData, setUserData, deleteUserData } from './memoryStore.js';
import { LIMITS } from '../../config/constants.js';

/**
 * Obtiene o crea el perfil de un usuario.
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Perfil del usuario
 */
export const getOrCreateUser = async (userId) => {
  let user = await getUserData(userId);
  
  if (!user) {
    user = {
      userId,
      facts: {},           // Hechos de largo plazo (nombre, gustos, etc.)
      history: [],         // Historial de mensajes
      summary: null,       // Resumen de conversaciones antiguas
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setUserData(userId, user);
  }
  
  return user;
};

/**
 * Agrega un mensaje al historial del usuario.
 * Si el historial supera el límite, resume los mensajes antiguos.
 * @param {string} userId - ID del usuario
 * @param {string} role - 'user' o 'assistant'
 * @param {string} content - Contenido del mensaje
 */
export const addMessageToHistory = async (userId, role, content) => {
  const user = await getOrCreateUser(userId);
  
  user.history.push({
    role,
    content,
    timestamp: new Date().toISOString(),
  });

  // Si el historial es muy largo, resumir los mensajes antiguos
  if (user.history.length > LIMITS.summaryThreshold) {
    const oldMessages = user.history.slice(0, -LIMITS.recentMessages);
    const recentMessages = user.history.slice(-LIMITS.recentMessages);

    // Crear resumen simple (en V2.5 podemos usar IA para resumir)
    const summaryParts = oldMessages
      .filter((msg) => msg.role === 'user')
      .map((msg) => msg.content)
      .slice(0, 5); // Tomar solo los primeros 5 mensajes de usuario

    user.summary = summaryParts.length > 0
      ? `El usuario habló sobre: ${summaryParts.join(', ')}`
      : null;

    user.history = recentMessages;
  }

  await setUserData(userId, user);
};

/**
 * Extrae y guarda "hechos" del mensaje del usuario.
 * En V2 esto es manual, en V3 podemos usar IA para extracción automática.
 * @param {string} userId - ID del usuario
 * @param {string} message - Mensaje del usuario
 */
export const extractFacts = async (userId, message) => {
  const user = await getOrCreateUser(userId);
  const lowerMsg = message.toLowerCase();

  // Extracción simple de hechos (patrones básicos)
  // En V2.5 podemos usar IA para hacer esto automáticamente
  
  // Detectar nombre
  const nameMatch = message.match(/me llamo\s+([a-záéíóúñ]+)/i) ||
                    message.match(/mi nombre es\s+([a-záéíóúñ]+)/i) ||
                    message.match(/soy\s+([a-záéíóúñ]+)/i);
  
  if (nameMatch) {
    user.facts.nombre = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
  }

  // Detectar gustos (ejemplo simple)
  if (lowerMsg.includes('me gusta') || lowerMsg.includes('me encanta')) {
    const gustoMatch = message.match(/me (?:gusta|encanta)\s+(.+)/i);
    if (gustoMatch) {
      user.facts.gustos = user.facts.gustos || [];
      if (!user.facts.gustos.includes(gustoMatch[1])) {
        user.facts.gustos.push(gustoMatch[1]);
      }
    }
  }

  await setUserData(userId, user);
};

/**
 * Obtiene el historial reciente de un usuario (últimos N mensajes).
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Historial reciente
 */
export const getRecentHistory = async (userId) => {
  const user = await getOrCreateUser(userId);
  return user.history.slice(-LIMITS.recentMessages);
};

/**
 * Obtiene los hechos de largo plazo de un usuario.
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Hechos del usuario
 */
export const getUserFacts = async (userId) => {
  const user = await getOrCreateUser(userId);
  return user.facts;
};

/**
 * Obtiene el resumen de conversaciones antiguas.
 * @param {string} userId - ID del usuario
 * @returns {Promise<string|null>} Resumen o null
 */
export const getUserSummary = async (userId) => {
  const user = await getOrCreateUser(userId);
  return user.summary;
};

/**
 * Limpia toda la memoria de un usuario.
 * @param {string} userId - ID del usuario
 */
export const clearUserMemory = async (userId) => {
  await deleteUserData(userId);
};
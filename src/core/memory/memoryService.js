// src/core/memory/memoryService.js
// Lógica de memoria: gestiona historial de mensajes y extracción de "hechos".
// Este servicio decide QUÉ recordar y CÓMO organizarlo.

import { getUserData, updateUserData, deleteUserData } from './memoryStore.js';
import { LIMITS } from '../../config/constants.js';

const createUser = (userId) => ({
  userId,
  facts: {},
  history: [],
  summary: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Obtiene o crea el perfil de un usuario.
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Perfil del usuario
 */
export const getOrCreateUser = async (userId) => {
  const user = await getUserData(userId);
  return user || updateUserData(userId, (currentUser) => currentUser || createUser(userId));
};

/**
 * Agrega un mensaje al historial del usuario.
 * Si el historial supera el límite, resume los mensajes antiguos.
 * @param {string} userId - ID del usuario
 * @param {string} role - 'user' o 'assistant'
 * @param {string} content - Contenido del mensaje
 */
export const addMessageToHistory = async (userId, role, content) => {
  await updateUserData(userId, (currentUser) => {
    const user = currentUser || createUser(userId);
    user.history.push({
      role,
      content,
      timestamp: new Date().toISOString(),
    });

    if (user.history.length > LIMITS.summaryThreshold) {
      const oldMessages = user.history.slice(0, -LIMITS.recentMessages);
      const recentMessages = user.history.slice(-LIMITS.recentMessages);
      const summaryParts = oldMessages
        .filter((msg) => msg.role === 'user')
        .map((msg) => msg.content)
        .slice(0, 5);

      if (summaryParts.length > 0) {
        const newSummary = `El usuario habló sobre: ${summaryParts.join(', ')}`;
        user.summary = [user.summary, newSummary]
          .filter(Boolean)
          .join('\n')
          .slice(-LIMITS.maxSummaryLength);
      }

      user.history = recentMessages;
    }

    return user;
  });
};

/**
 * Extrae y guarda "hechos" del mensaje del usuario.
 * En V2 esto es manual, en V3 podemos usar IA para extracción automática.
 * @param {string} userId - ID del usuario
 * @param {string} message - Mensaje del usuario
 */
export const extractFacts = async (userId, message) => {
  const lowerMsg = message.toLowerCase();

  // Extracción simple de hechos (patrones básicos)
  // En V2.5 podemos usar IA para hacer esto automáticamente
  
  // Detectar nombre
  const nameMatch = message.match(/me llamo\s+([a-záéíóúñ]+)/i) ||
                    message.match(/mi nombre es\s+([a-záéíóúñ]+)/i) ||
                    message.match(/soy\s+([a-záéíóúñ]+)/i);
  
  const gustoMatch = lowerMsg.includes('me gusta') || lowerMsg.includes('me encanta')
    ? message.match(/me (?:gusta|encanta)\s+(.+)/i)
    : null;

  if (nameMatch || gustoMatch) {
    await updateUserData(userId, (currentUser) => {
      const user = currentUser || createUser(userId);

      if (nameMatch) {
        user.facts.nombre = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
      }

      if (gustoMatch) {
        user.facts.gustos = user.facts.gustos || [];
        if (!user.facts.gustos.includes(gustoMatch[1])) {
          user.facts.gustos.push(gustoMatch[1]);
        }
      }

      return user;
    });
  }
};

/**
 * Obtiene el historial reciente de un usuario (últimos N mensajes) formateado para el modelo.
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array<{role: string, content: string}>>} Historial reciente
 */
export const getRecentHistory = async (userId) => {
  const user = await getOrCreateUser(userId);
  return user.history.slice(-LIMITS.recentMessages).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
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

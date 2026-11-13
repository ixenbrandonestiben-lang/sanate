// src/core/chat/chatService.js
// El director de orquesta: valida → busca memoria → llama a IA → guarda → responde.
// Este servicio coordina todos los módulos del core.

import { validateChatMessage } from './chatValidator.js';
import {
  getOrCreateUser,
  addMessageToHistory,
  extractFacts,
  getRecentHistory,
  getUserFacts,
  getUserSummary,
} from '../memory/memoryService.js';
import { callAI } from '../ai/aiService.js';
import { cleanText } from '../../utils/cleanText.js';
import { formatResponse } from '../../utils/formatResponse.js';

/**
 * Procesa un mensaje de chat y devuelve la respuesta del bot.
 * @param {Object} rawData - Datos crudos del request
 * @returns {Promise<Object>} Respuesta del bot con metadata
 */
export const processChatMessage = async (rawData) => {
  // 1. Validar entrada
  const { userId, message, persona } = validateChatMessage(rawData);

  // 2. Limpiar texto de entrada
  const cleanMessage = cleanText(message);

  // 3. Extraer hechos del mensaje (nombre, gustos, etc.)
  await extractFacts(userId, cleanMessage);

  // 4. Obtener contexto de memoria
  const [facts, summary, recentHistory] = await Promise.all([
    getUserFacts(userId),
    getUserSummary(userId),
    getRecentHistory(userId),
  ]);

  // 5. Llamar a la IA con el contexto completo
  const aiResponse = await callAI({
    userMessage: cleanMessage,
    facts,
    summary,
    recentHistory,
    persona,
  });

  // 6. Formatear respuesta
  const formattedResponse = formatResponse(aiResponse);

  // 7. Guardar mensaje del usuario y respuesta del bot en historial
  await Promise.all([
    addMessageToHistory(userId, 'user', cleanMessage),
    addMessageToHistory(userId, 'assistant', formattedResponse),
  ]);

  // 8. Devolver respuesta con metadata
  return {
    reply: formattedResponse,
    userId,
    timestamp: new Date().toISOString(),
    persona,
  };
};
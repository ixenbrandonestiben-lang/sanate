// src/core/ai/aiService.js
// Servicio de IA: arma el prompt completo (sistema + memoria + mensaje) y llama al cliente.
// Este es el "traductor" entre la lógica de negocio y la API de OpenAI/Groq.

import { aiClient, AI_MODEL } from './aiClient.js';
import { getPersonaPrompt } from './prompts/personas.js';

/**
 * Construye el array de mensajes para enviar a la IA.
 * Combina: system prompt + hechos (largo plazo) + resumen + historial reciente + mensaje actual.
 */
const buildMessages = ({ systemPrompt, facts, summary, recentHistory, userMessage }) => {
  const messages = [];

  // 1. System prompt (personalidad)
  messages.push({
    role: 'system',
    content: systemPrompt,
  });

  // 2. Contexto de largo plazo (hechos del usuario)
  if (facts && Object.keys(facts).length > 0) {
    const factsText = Object.entries(facts)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');
    
    messages.push({
      role: 'system',
      content: `Información que recordás del usuario:\n${factsText}`,
    });
  }

  // 3. Resumen de conversaciones antiguas (si existe)
  if (summary) {
    messages.push({
      role: 'system',
      content: `Resumen de conversaciones anteriores:\n${summary}`,
    });
  }

  // 4. Historial reciente (últimos N mensajes)
  if (recentHistory && recentHistory.length > 0) {
    messages.push(...recentHistory);
  }

  // 5. Mensaje actual del usuario
  messages.push({
    role: 'user',
    content: userMessage,
  });

  return messages;
};

/**
 * Llama a la IA con el contexto completo y devuelve la respuesta.
 * @param {Object} params - Parámetros de la llamada
 * @param {string} params.userMessage - Mensaje del usuario
 * @param {Object} params.facts - Hechos de largo plazo del usuario
 * @param {string} params.summary - Resumen de conversaciones antiguas
 * @param {Array} params.recentHistory - Historial reciente (últimos 10 mensajes)
 * @param {string} params.persona - Personalidad a usar (default: 'MAJE')
 * @returns {Promise<string>} Respuesta de la IA
 */
export const callAI = async ({ userMessage, facts, summary, recentHistory, persona = 'MAJE' }) => {
  try {
    const systemPrompt = getPersonaPrompt(persona);
    const messages = buildMessages({
      systemPrompt,
      facts,
      summary,
      recentHistory,
      userMessage,
    });

    const completion = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.7, // Balance entre creatividad y coherencia
      max_tokens: 500,  // Respuestas concisas
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('La IA no devolvió contenido');
    }

    return response.trim();
  } catch (error) {
    console.error('[AI_SERVICE_ERROR]', error.message);

    let message = 'No se pudo completar la solicitud al proveedor de IA.';
    let status = 502;

    if (error.status === 429) {
      message = 'El proveedor de IA alcanzó su límite de solicitudes. Intentá de nuevo más tarde.';
      status = 429;
    } else if (error.status === 401) {
      message = 'El proveedor de IA rechazó la API key. Revisá la configuración del servidor.';
    } else if (error.code === 'ECONNABORTED' || error.name === 'APIConnectionTimeoutError') {
      message = 'El proveedor de IA tardó demasiado en responder.';
      status = 504;
    }

    const aiError = new Error(message);
    aiError.status = status;
    throw aiError;
  }
};

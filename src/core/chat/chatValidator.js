// src/core/chat/chatValidator.js
// Valida que los datos de entrada estén bien formados antes de procesarlos.
// Usa Zod para validación robusta y mensajes de error claros.

import { z } from 'zod';
import { LIMITS } from '../../config/constants.js';

// Schema de validación para el mensaje de chat
const chatMessageSchema = z.object({
  userId: z
    .string()
    .min(1, 'El userId no puede estar vacío')
    .max(100, 'El userId es muy largo'),
  
  message: z
    .string()
    .min(1, 'El mensaje no puede estar vacío')
    .max(LIMITS.maxMessageLength, `El mensaje no puede superar ${LIMITS.maxMessageLength} caracteres`),
  
  persona: z
    .enum(['MAJE', 'FORMAL', 'VEDOR', 'VENDEDOR'])
    .optional()
    .default('MAJE')
    .transform((persona) => persona === 'VEDOR' ? 'VENDEDOR' : persona),
});

/**
 * Valida el payload de chat.
 * @param {Object} data - Datos a validar
 * @returns {Object} Datos validados y tipados
 * @throws {Error} Si la validación falla
 */
export const validateChatMessage = (data) => {
  try {
    return chatMessageSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message).join(', ');
      const validationError = new Error(`Validación fallida: ${messages}`);
      validationError.status = 400;
      throw validationError;
    }
    throw error;
  }
};
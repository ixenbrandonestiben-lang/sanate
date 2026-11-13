// src/utils/formatResponse.js
// Limpia y formatea la respuesta de la IA antes de enviarla al frontend.

/**
 * Formatea la respuesta de la IA.
 * @param {string} response - Respuesta cruda de la IA
 * @returns {string} Respuesta formateada
 */
export const formatResponse = (response) => {
  if (!response) return '';

  return response
    // Eliminar espacios excesivos
    .replace(/\s+/g, ' ')
    // Eliminar saltos de línea múltiples
    .replace(/\n{3,}/g, '\n\n')
    // Eliminar espacios al inicio y final
    .trim();
};
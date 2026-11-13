// src/utils/formatResponse.js
// Limpia y formatea la respuesta de la IA antes de enviarla al frontend.

/**
 * Formatea la respuesta de la IA preservando saltos de línea legítimos.
 * @param {string} response - Respuesta cruda de la IA
 * @returns {string} Respuesta formateada
 */
export const formatResponse = (response) => {
  if (!response) return '';

  return response
    // Normalizar saltos de línea Windows CRLF a LF
    .replace(/\r\n/g, '\n')
    // Normalizar espacios horizontales continuos en una sola línea
    .replace(/[^\S\n]+/g, ' ')
    // Eliminar saltos de línea múltiples excesivos (máximo 2)
    .replace(/\n{3,}/g, '\n\n')
    // Eliminar espacios al inicio y final
    .trim();
};

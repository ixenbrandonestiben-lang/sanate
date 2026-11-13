// src/utils/cleanText.js
// Sanitiza el texto de entrada del usuario.
// Quita caracteres de control, espacios excesivos, etc.

/**
 * Limpia y normaliza el texto de entrada.
 * @param {string} text - Texto a limpiar
 * @returns {string} Texto limpio
 */
export const cleanText = (text) => {
  if (!text) return '';

  return text
    // Eliminar caracteres de control (ASCII 0-31)
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Normalizar espacios (múltiples espacios → uno solo)
    .replace(/\s+/g, ' ')
    // Eliminar espacios al inicio y final
    .trim()
    // Limitar longitud (por seguridad)
    .slice(0, 1000);
};
// src/config/constants.js - Valores fijos del sistema. 
// Si algo cambia, se cambia acá y en un solo lugar.

export const AI_MODELS = {
  groq: 'llama-3.3-70b-versatile',
  openai: 'gpt-4o-mini',
};

export const LIMITS = {
  maxMessageLength: 1000,    // Máximo de caracteres por mensaje del usuario
  maxHistoryLength: 20,      // Mensajes a mantener en memoria por usuario
  summaryThreshold: 20,      // A partir de acá se resume el historial viejo
  recentMessages: 10,        // Mensajes recientes que siempre se mandan completos
  maxRequestSize: '10kb',    // Límite del payload HTTP
};

export const RATE_LIMIT = {
  windowMs: 60 * 1000,       // Ventana de 1 minuto
  maxRequests: 20,           // Máximo 20 peticiones por ventana
};

export const TIMEOUTS = {
  aiResponse: 15000,         // 15 segundos máximo esperando a la IA
};

export const PATHS = {
  memoryFile: 'data/memory.json',
  logFile: 'logs/app.log',
};
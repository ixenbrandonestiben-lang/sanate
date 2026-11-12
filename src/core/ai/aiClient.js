// src/core/ai/aiClient.js
// Cliente de IA agnóstico. Se inicializa según AI_PROVIDER en .env.
// Truco pro: usamos el SDK de OpenAI para ambos (Groq y OpenAI),
// solo cambiamos la baseURL y la API key. Así cumplimos la regla de "1 línea en .env".

import OpenAI from 'openai';
import { config } from '../../config/env.js';
import { AI_MODELS, TIMEOUTS } from '../../config/constants.js';

// Inicializar cliente según el provider
const createClient = () => {
  if (config.aiProvider === 'groq') {
    // Groq usa la API compatible con OpenAI, solo cambiamos baseURL
    return new OpenAI({
      apiKey: config.groqApiKey,
      baseURL: 'https://api.groq.com/openai/v1',
      timeout: TIMEOUTS.aiResponse,
    });
  }

  if (config.aiProvider === 'openai') {
    return new OpenAI({
      apiKey: config.openaiApiKey,
      timeout: TIMEOUTS.aiResponse,
    });
  }

  throw new Error(`Proveedor de IA no soportado: ${config.aiProvider}`);
};

// Instancia única del cliente (singleton)
export const aiClient = createClient();

// Modelo activo según el provider
export const AI_MODEL = AI_MODELS[config.aiProvider];

console.log(`🤖 Cliente IA inicializado: ${config.aiProvider} / ${AI_MODEL}`);
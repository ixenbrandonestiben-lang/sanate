// src/config/env.js - Centraliza y valida las variables de entorno
import dotenv from 'dotenv';

dotenv.config();

// Función helper para exigir variables críticas
const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Falta la variable de entorno: ${key}. Revisá tu .env, maje.`);
  }
  return value;
};

// Validar que el provider sea válido
const aiProvider = (process.env.AI_PROVIDER || 'groq').toLowerCase();
if (!['groq', 'openai'].includes(aiProvider)) {
  throw new Error(`❌ AI_PROVIDER inválido: "${aiProvider}". Usá "groq" u "openai".`);
}

// Validar que exista la API key del provider elegido
if (aiProvider === 'groq' && !process.env.GROQ_API_KEY) {
  throw new Error('❌ Usás Groq pero falta GROQ_API_KEY en el .env');
}
if (aiProvider === 'openai' && !process.env.OPENAI_API_KEY) {
  throw new Error('❌ Usás OpenAI pero falta OPENAI_API_KEY en el .env');
}

// Exportar objeto config centralizado (así el resto del código no toca process.env)
export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  aiProvider,
  groqApiKey: process.env.GROQ_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  nodeEnv: process.env.NODE_ENV || 'development',
};
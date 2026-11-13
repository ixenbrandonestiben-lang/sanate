// server.js - Punto de entrada. Solo prende el server, nada más.
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './src/config/env.js';
import { errorHandler } from './src/api/middlewares/errorHandler.js';
import { requestLogger } from './src/api/middlewares/logger.js';
import chatRoutes from './src/api/routes/chat.routes.js';
import healthRoutes from './src/api/routes/health.routes.js';

// Fix para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpetas necesarias si no existen
const dirsToCreate = ['logs', 'data'];
dirsToCreate.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));
app.use(requestLogger); // Logger custom

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// RUTAS
// ============================================
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);

// ============================================
// MANEJO DE ERRORES (siempre al final)
// ============================================
app.use(errorHandler);

// ============================================
// ARRANQUE DEL SERVER
// ============================================
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🚀 BEE corriendo en el puerto ${PORT}, nítido`);
  console.log(`🤖 Proveedor de IA: ${config.aiProvider}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat\n`);
});

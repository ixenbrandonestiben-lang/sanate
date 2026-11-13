// src/api/middlewares/logger.js
// Middleware custom para loguear detalles de las peticiones en logs/app.log.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from '../../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.join(__dirname, '../../../', PATHS.logFile);

/**
 * Middleware que loguea información de cada petición.
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Loguear cuando termina la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    // Escribir en archivo de logs (no bloqueante)
    fs.appendFile(LOG_FILE, logLine, (err) => {
      if (err) {
        console.error('[LOGGER_ERROR]', err.message);
      }
    });
  });

  next();
};
// src/api/middlewares/rateLimit.js
// Configura el límite de peticiones por IP para evitar spam.

import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../../config/constants.js';

export const chatRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.windowMs,
  max: RATE_LIMIT.maxRequests,
  message: {
    error: 'Muchas peticiones, maje. Esperá un toque y volvé a intentar.',
    status: 429,
  },
  standardHeaders: true, // Devuelve headers con info del rate limit
  legacyHeaders: false,  // No usar headers legacy
});
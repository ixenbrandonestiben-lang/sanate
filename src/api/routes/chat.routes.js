// src/api/routes/chat.routes.js
// Define las rutas del endpoint de chat.

import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';
import { chatRateLimiter } from '../middlewares/rateLimit.js';

const router = Router();

// POST /api/chat - Enviar mensaje y recibir respuesta
router.post('/', chatRateLimiter, chatController.sendMessage);

// DELETE /api/chat/:userId - Borrar historial de un usuario
router.delete('/:userId', chatController.clearHistory);

export default router;
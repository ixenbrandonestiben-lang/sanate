// src/api/controllers/chat.controller.js
// Controlador de chat: recibe el request, llama al service, devuelve response.

import { processChatMessage } from '../../core/chat/chatService.js';
import { clearUserMemory } from '../../core/memory/memoryService.js';

/**
 * Controlador para procesar mensajes de chat.
 */
export const chatController = {
  /**
   * POST /api/chat
   */
  sendMessage: async (req, res, next) => {
    try {
      const result = await processChatMessage(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/chat/:userId
   */
  clearHistory: async (req, res, next) => {
    try {
      const { userId } = req.params;
      await clearUserMemory(userId);
      res.json({
        success: true,
        message: 'Historial borrado, maje',
      });
    } catch (error) {
      next(error);
    }
  },
};
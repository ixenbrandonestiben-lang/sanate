// src/api/routes/health.routes.js
// Endpoint de health check para monitoreo.

import { Router } from 'express';
import { config } from '../../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MajeBot V2 corriendo, nítido',
    provider: config.aiProvider,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
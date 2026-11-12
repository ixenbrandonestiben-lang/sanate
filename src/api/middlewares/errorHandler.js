// src/api/middlewares/errorHandler.js - Atrapa errores y devuelve JSON limpio
export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Algo salió mal, maje. Intentá de nuevo.'
      : err.message;

  res.status(status).json({
    error: message,
    status,
  });
};
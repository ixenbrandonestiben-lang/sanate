import express from "express";
import cors from 'cors';
import morgan from "morgan";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

import { config } from './src/config/env.js';
import { errorHandler } from './src/api/middlewares/errorHandler.js';
import { timeStamp } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dirsToCreate = [ 'logs', 'data' ];
dirsToCreate.forEach((dir) =>{
    const fullPath = path.join(__dirname, dir);
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath, { recursive: true })
    }
});

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));
app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🚀 MajeBot V2 corriendo en el puerto ${PORT}, nítido`);
  console.log(`🤖 Proveedor de IA: ${config.aiProvider}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat\n`);
});
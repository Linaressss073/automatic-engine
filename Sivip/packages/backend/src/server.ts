import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { swaggerUi, specs } from './swagger';
import { log } from './colors/theme';
import sequelize from './config/database';
import './models';
import apiRouter from './routes';

dotenv.config();

export const app = express();
export const PORT = process.env.BACKEND_PORT || 8000;

// ✅ 1. CONFIGURACIÓN DE CORS (DEBE IR PRIMERO)
const allowedOrigins = [
  'http://localhost:3000', // Next.js por defecto
  process.env.FRONTEND_COMPLETE_URL || 'http://localhost:5173',
  process.env.FRONTEND_SHORT_URL || 'http://localhost:2000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
}));

// ✅ 2. MIDDLEWARES PARA PARSEAR EL BODY
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ 3. MIDDLEWARE DE LOGGING (DESPUÉS DE CORS Y BODY PARSERS)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const logDetails: any = {
      origin: req.headers.origin,
      userAgent: req.headers['user-agent']?.substring(0, 50),
    };
    if (req.body && Object.keys(req.body).length > 0) {
      logDetails.body = req.body;
    }
    log.info(`📝 ${req.method} ${req.path}`, logDetails);
    next();
  });
}

// ✅ 4. RUTAS Y DOCUMENTACIÓN
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', apiRouter);

// ✅ 5. MANEJADORES DE ERRORES (AL FINAL)
// Middleware para rutas no encontradas
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

// Middleware de manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  log.error('❌ Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
  });
});

// Arranque del servidor
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    log.success('✅ Conexión a la base de datos establecida.');
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Modelos sincronizados con la base de datos (alter: true).');
    }
    const serverUrl = `http://localhost:${PORT}`;
    log.success(`🚀 Servidor corriendo en ${serverUrl}`);
    console.log(`📖 Swagger docs: ${serverUrl}/api-docs`);
  } catch (error) {
    log.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
});

// Cierre graceful
process.on('SIGINT', async () => {
  console.log('📴 Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});
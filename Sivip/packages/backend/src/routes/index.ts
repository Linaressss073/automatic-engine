// src/routes/index.ts
import { Router } from 'express';
import paquetesRoutes from './paquetes';
// Importar otras rutas aquí cuando las tengas
// import usuariosRoutes from './usuarios';
// import authRoutes from './auth';

const router = Router();

// ✅ MIDDLEWARE DE LOGGING ESPECÍFICO PARA RUTAS API
router.use((req, res, next) => {
  console.log(`🔗 API Route: ${req.method} /api${req.path}`);
  next();
});

// ✅ RUTA DE PRUEBA PARA VERIFICAR QUE EL ROUTER FUNCIONA
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      paquetes: '/api/paquetes',
      health: '/health',
      docs: '/api-docs'
    },
    timestamp: new Date().toISOString()
  });
});

// ✅ MONTAR RUTAS DE PAQUETES
router.use('/paquetes', paquetesRoutes);

// ✅ Aquí puedes agregar más rutas en el futuro:
// router.use('/usuarios', usuariosRoutes);
// router.use('/auth', authRoutes);

// ✅ RUTA CATCH-ALL CORREGIDA - no usar '*'
router.use('/', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint no encontrado: ${req.method} /api${req.originalUrl}`,
    availableEndpoints: [
      'GET /api/',
      'GET /api/paquetes',
      'GET /api/paquetes/:id'
    ]
  });
});

export default router;
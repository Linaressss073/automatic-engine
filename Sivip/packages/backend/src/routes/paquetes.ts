import { Router, Request, Response } from 'express';
import { Paquete, User } from '../models';

const router = Router();

// Ruta GET a la raíz ('/'), que se convierte en /api/paquetes
router.get('/', async (req: Request, res: Response) => {
  try {
    const paquetes = await Paquete.findAll({
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['nombre']
      }],
      attributes: ['id', 'descripcion', 'estado'],
      order: [['createdAt', 'DESC']]
    });

    const resultado = paquetes.map(p => {
      const usuarioNombre = (p as any).usuario?.nombre || 'Usuario no asignado';
      return {
        id: p.id,
        descripcion: p.descripcion,
        estado: p.estado,
        usuario: usuarioNombre 
      };
    });
    
    res.status(200).json({ success: true, data: resultado });

  } catch (error) {
    console.error('Error al obtener paquetes:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

export default router;
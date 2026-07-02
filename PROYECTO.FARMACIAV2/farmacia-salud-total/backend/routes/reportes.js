import express from 'express';
import { verificarToken, soloAdmin } from '../middleware/auth.js';
import { ventasPorFecha } from '../controllers/ReporteController.js';
const router = express.Router();

router.use(verificarToken, soloAdmin);
router.get('/ventas', ventasPorFecha);

export default router;
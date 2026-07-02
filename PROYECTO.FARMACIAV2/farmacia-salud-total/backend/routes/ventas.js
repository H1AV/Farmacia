import express from 'express';
import { verificarToken } from '../middleware/auth.js';
import { registrarVenta, getPendientes, entregarPedido } from '../controllers/VentaController.js';

const router = express.Router();

router.use(verificarToken);
router.post('/', registrarVenta);
router.get('/pendientes', getPendientes);
router.put('/:id/entregar', entregarPedido);

export default router;
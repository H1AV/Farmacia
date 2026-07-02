import express from 'express';
import { verificarToken } from '../middleware/auth.js';
import { obtenerStock } from '../controllers/InventarioController.js';
const router = express.Router();

router.use(verificarToken);
router.get('/stock', obtenerStock);

export default router;
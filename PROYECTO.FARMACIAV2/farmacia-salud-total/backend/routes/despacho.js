import express from 'express';
import { verificarToken, soloFarmaceutico } from '../middleware/auth.js';
import { validar, despachar } from '../controllers/DespachoController.js';
const router = express.Router();

router.use(verificarToken, soloFarmaceutico);
router.get('/validar/:nroReceta', validar);
router.post('/', despachar);

export default router;
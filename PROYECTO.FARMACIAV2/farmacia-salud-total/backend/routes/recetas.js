// backend/routes/recetas.js
import express from 'express';
import { crearRecetaConDetalles } from '../repositories/RecetaRepository.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // 1. Mapeamos exactamente lo que envía nuestro nuevo frontend (Recetas.jsx)
    const nuevaReceta = {
      nro_receta: req.body.numero_receta,
      medico_emisor: req.body.medico_emisor,
      matricula_medico: req.body.matricula,
      fecha_emision: req.body.fecha_emision,
      valida: true, // La marcamos válida directamente
      despachada: false
    };

    // 2. Extraemos la lista de pastillas
    const medicamentos = req.body.medicamentos;

    // 3. Llamamos a la nueva función del repositorio
    const receta = await crearRecetaConDetalles(nuevaReceta, medicamentos);
    
    res.status(201).json({ estado: 'ok', datos: receta });
  } catch (err) {
    console.error("Error en ruta recetas:", err);
    res.status(400).json({ mensaje: err.message });
  }
});

export default router;
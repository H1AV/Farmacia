import express from 'express';
import sequelize from '../config/database.js';
// CAMBIO AQUÍ: Usamos el nombre correcto 'crearRecetaConItems'
import { crearRecetaConItems, obtenerSiguienteNumeroReceta, obtenerTodasLasRecetas, obtenerRecetaPorId } from '../repositories/RecetaRepository.js';

const router = express.Router();

// Ruta para pedir el siguiente número 
router.get('/siguiente-numero', async (req, res) => {
  try {
    const siguiente = await obtenerSiguienteNumeroReceta();
    res.json({ estado: 'ok', numero: siguiente });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// NUEVO: Obtener todo el historial
router.get('/', async (req, res) => {
  try {
    const recetas = await obtenerTodasLasRecetas();
    res.json({ estado: 'ok', datos: recetas });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// NUEVO: Buscar una receta por su número para cargarla en la Venta
router.get('/:id', async (req, res) => {
  try {
    const receta = await obtenerRecetaPorId(req.params.id);
    if (!receta) throw new Error("Receta no encontrada");
    res.json({ estado: 'ok', datos: receta });
  } catch (err) {
    res.status(404).json({ mensaje: err.message });
  }
});

router.post('/', async (req, res) => {
  const transaccion = await sequelize.transaction();
  try {
    const nuevaReceta = {
      nro_receta: req.body.nro_receta,
      medico_emisor: req.body.medico,
      matricula_medico: req.body.matricula,
      fecha_emision: req.body.fecha,
      valida: false,
      despachada: false
    };

    const items = req.body.items || [];
    if (items.length === 0) throw new Error("La receta debe contener al menos un medicamento");

    // CAMBIO AQUÍ: Llamamos a la función con el nombre correcto
    const receta = await crearRecetaConItems(nuevaReceta, items, transaccion);
    
    await transaccion.commit();
    res.status(201).json({ estado: 'ok', datos: receta });
  } catch (err) {
    await transaccion.rollback();
    res.status(400).json({ mensaje: err.message });
  }
});

export default router;

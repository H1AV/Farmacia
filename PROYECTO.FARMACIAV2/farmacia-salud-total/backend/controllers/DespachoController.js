import { procesarDespacho } from '../services/DespachoService.js';
import DetalleReceta from '../models/DetalleReceta.js';
import RecetaMedica from '../models/RecetaMedica.js'; 

export const validar = async (req, res) => {
  try {
    const { nroReceta } = req.params;

    // Buscamos la receta, incluyendo la tabla de detalles
    const receta = await RecetaMedica.findOne({
      where: { nro_receta: nroReceta },
      include: [
        { model: DetalleReceta } 
      ]
    });

    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }

    res.json({ estado: 'ok', datos: receta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al validar receta' });
  }
};

export const despachar = async (req, res) => {
  try {
    const resultado = await procesarDespacho(req.body.nro_receta, req.body.items, req.usuario.id);
    res.json({ estado: 'ok', datos: resultado });
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
};
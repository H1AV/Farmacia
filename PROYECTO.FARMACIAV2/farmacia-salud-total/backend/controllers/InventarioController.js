import { consultarStock } from '../services/StockService.js';

export const obtenerStock = async (req, res) => {
  try {
    const stock = await consultarStock();
    res.json({ estado: 'ok', datos: stock });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};
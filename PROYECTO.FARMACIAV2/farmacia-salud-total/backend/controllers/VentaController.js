// Unimos todo en un solo import y eliminamos 'registrarVenta' de aquí
import { procesarVenta, listarPendientes, marcarComoEntregado } from '../services/VentaService.js';

export const registrarVenta = async (req, res) => {
  try {
    const resultado = await procesarVenta(req.body, req.usuario.id);
    res.status(201).json({ estado: 'ok', datos: resultado });
  } catch (err) {
    res.status(400).json({ estado: 'error', mensaje: err.message });
  }
};

export const getPendientes = async (req, res) => {
  try {
    const pendientes = await listarPendientes();
    res.json({ estado: 'ok', datos: pendientes });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

export const entregarPedido = async (req, res) => {
  try {
    await marcarComoEntregado(req.params.id);
    res.json({ estado: 'ok', mensaje: 'Pedido despachado correctamente' });
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
};
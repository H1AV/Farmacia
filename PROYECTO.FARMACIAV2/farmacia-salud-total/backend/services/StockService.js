import Medicamento from '../models/Medicamento.js';

export const consultarStock = async () => {
  return await Medicamento.findAll({ order: [['nombre', 'ASC']] });
};

export const verificarDisponibilidad = async (cod, cantidad) => {
  const med = await Medicamento.findByPk(cod);
  if (!med) throw new Error('Medicamento no encontrado');
  return med.stock_actual >= cantidad;
};
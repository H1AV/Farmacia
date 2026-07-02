import BoletaVenta from '../models/BoletaVenta.js';
import ItemVenta from '../models/ItemVenta.js';
import Medicamento from '../models/Medicamento.js';

export const crearBoleta = async (datosBoleta, transaccion) => {
  return await BoletaVenta.create(datosBoleta, { transaction: transaccion });
};

export const crearItemVenta = async (datosItem, transaccion) => {
  return await ItemVenta.create(datosItem, { transaction: transaccion });
};

// Obtiene todas las boletas pendientes con sus medicamentos
export const obtenerBoletasPendientes = async () => {
  return await BoletaVenta.findAll({
    where: { estado: 'pendiente' },
    include: [{
      model: ItemVenta,
      as: 'items',
      include: [{
        model: Medicamento,
        as: 'medicamento',
        attributes: ['nombre', 'requiere_receta'] // Necesario para la alerta visual (ícono rojo)
      }]
    }],
    order: [['fecha', 'ASC']] // Los más antiguos primero (FIFO)
  });
};

export const actualizarEstadoBoleta = async (nro_boleta, nuevoEstado) => {
  const boleta = await BoletaVenta.findByPk(nro_boleta);
  if (!boleta) throw new Error('Boleta no encontrada');
  boleta.estado = nuevoEstado;
  return await boleta.save();
};
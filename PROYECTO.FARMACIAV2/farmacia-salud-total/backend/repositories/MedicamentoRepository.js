import Medicamento from '../models/Medicamento.js';

// Busca el medicamento y bloquea la fila en PostgreSQL para evitar condiciones de carrera
export const obtenerMedicamentoConBloqueo = async (codMedicamento, transaccion) => {
  return await Medicamento.findByPk(codMedicamento, {
    transaction: transaccion,
    lock: transaccion.LOCK.UPDATE 
  });
};

export const actualizarMedicamento = async (medicamento, transaccion) => {
  return await medicamento.save({ transaction: transaccion });
};
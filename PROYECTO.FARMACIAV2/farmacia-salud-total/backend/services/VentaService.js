import sequelize from '../config/database.js'; // Solo importamos sequelize para manejar la transacción global
import { crearBoleta, crearItemVenta } from '../repositories/VentaRepository.js';
import { obtenerMedicamentoConBloqueo, actualizarMedicamento } from '../repositories/MedicamentoRepository.js';
import { obtenerBoletasPendientes, actualizarEstadoBoleta } from '../repositories/VentaRepository.js';

export const procesarVenta = async (datosVenta, idUsuario) => {
  const transaccion = await sequelize.transaction();
  try {
    const { items, metodo_pago } = datosVenta;
    let total = 0;

    // 1. VALIDACIÓN Y CÁLCULOS (Reglas de negocio)
    for (const item of items) {
      // Usamos el repositorio (que internamente bloquea la fila)
      const medicamento = await obtenerMedicamentoConBloqueo(item.cod_medicamento, transaccion);
      
      if (!medicamento) throw new Error(`Medicamento ${item.cod_medicamento} no existe`);
      if (medicamento.stock_actual < item.cantidad) throw new Error(`Stock insuficiente para ${medicamento.nombre}`);
      if (medicamento.requiere_receta) throw new Error(`${medicamento.nombre} requiere receta médica`);
      
      total += medicamento.precio_venta * item.cantidad;
    }

    // 2. CREACIÓN DE LA VENTA
    const boleta = await crearBoleta({
      total_venta: total,
      metodo_pago,
      usuario_id: idUsuario,
      estado: 'pendiente'
    }, transaccion);

    // 3. REGISTRO DE ÍTEMS Y DESCUENTO DE STOCK
    for (const item of items) {
      const medicamento = await obtenerMedicamentoConBloqueo(item.cod_medicamento, transaccion);
      const subtotal = medicamento.precio_venta * item.cantidad;
      
      await crearItemVenta({
        nro_boleta: boleta.nro_boleta,
        cod_medicamento: item.cod_medicamento,
        cantidad: item.cantidad,
        precio_unitario: medicamento.precio_venta,
        subtotal
      }, transaccion);

      // Descontamos el stock y guardamos usando el repositorio
      medicamento.stock_actual -= item.cantidad;
      await actualizarMedicamento(medicamento, transaccion);
    }

    // Si todo salió bien, guardamos los cambios definitivamente en PostgreSQL
    await transaccion.commit();
    return boleta;
    
  } catch (error) {
    // Si cualquier validación o guardado falla, deshacemos todo
    await transaccion.rollback();
    throw error;
  }
};

export const listarPendientes = async () => {
  return await obtenerBoletasPendientes();
};

export const marcarComoEntregado = async (nro_boleta) => {
  return await actualizarEstadoBoleta(nro_boleta, 'entregado');
};
import sequelize from '../config/database.js'; // Solo para la transacción
import { obtenerRecetaConBloqueo, actualizarReceta } from '../repositories/RecetaRepository.js';
import { obtenerMedicamentoConBloqueo, actualizarMedicamento } from '../repositories/MedicamentoRepository.js';
import { registrarKardex } from '../repositories/KardexRepository.js';

export const procesarDespacho = async (nroReceta, items, idFarmaceutico) => {
  const transaccion = await sequelize.transaction();
  try {
    // 1. Validar la receta (Usando repositorio)
    const receta = await obtenerRecetaConBloqueo(nroReceta, transaccion);
    
    if (!receta || !receta.valida) throw new Error('Receta no válida');
    if (receta.despachada) throw new Error('Esta receta ya fue despachada anteriormente'); // Prevención de fraude

    // 2. Procesar cada medicamento
    for (const item of items) {
      // Usamos el repositorio con bloqueo para el stock
      const med = await obtenerMedicamentoConBloqueo(item.cod_medicamento, transaccion);
      
      if (!med) throw new Error(`Medicamento ${item.cod_medicamento} no existe`);
      if (med.stock_actual < item.cantidad) throw new Error(`Stock insuficiente para ${med.nombre}`);
      
      // Descontar stock
      med.stock_actual -= item.cantidad;
      await actualizarMedicamento(med, transaccion);

      // Registrar en el Kardex de Control legal
      await registrarKardex({
        nro_receta: nroReceta,
        cod_medicamento: item.cod_medicamento,
        cantidad_dispensada: item.cantidad,
        farmaceutico_id: idFarmaceutico
      }, transaccion);
    }

    // 3. Marcar receta como consumida y guardar
    receta.despachada = true;
    await actualizarReceta(receta, transaccion);
    
    // Guardar cambios en BD
    await transaccion.commit();
    return { mensaje: 'Despacho realizado correctamente' };
    
  } catch (error) {
    await transaccion.rollback();
    throw error;
  }
};

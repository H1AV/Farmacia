// backend/services/ValidacionRecetaService.js
import { obtenerRecetaPorId, actualizarReceta } from '../repositories/RecetaRepository.js';

export const validarReceta = async (nroReceta) => {
  // 1. Usamos el repositorio en lugar de Sequelize directamente
  const receta = await obtenerRecetaPorId(nroReceta);
  
  if (!receta) throw new Error('Receta no encontrada');
  if (receta.despachada) throw new Error('Esta receta ya fue utilizada y despachada');
  
  // 2. Aplicamos la regla de negocio: Vigencia de 30 días
  const hoy = new Date();
  const fechaEmision = new Date(receta.fecha_emision);
  const diferencia = (hoy - fechaEmision) / (1000 * 60 * 60 * 24);
  
  if (diferencia > 30) throw new Error('Receta vencida (tiene más de 30 días de antigüedad)');
  
  // 3. Marcamos como validada y guardamos
  receta.valida = true;
  await actualizarReceta(receta);
  
  // Retornamos los datos para que el frontend los muestre
  return receta;
};
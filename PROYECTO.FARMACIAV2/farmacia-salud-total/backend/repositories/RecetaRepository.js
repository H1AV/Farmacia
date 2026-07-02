import RecetaMedica from '../models/RecetaMedica.js';
import DetalleReceta from '../models/DetalleReceta.js';

// ==========================================
// FUNCIONES PARA EL DESPACHO (Con Transacción)
// ==========================================
export const obtenerRecetaConBloqueo = async (nroReceta, transaccion) => {
  return await RecetaMedica.findByPk(nroReceta, { 
    transaction: transaccion,
    lock: transaccion.LOCK.UPDATE 
  });
};

// ==========================================
// FUNCIONES PARA LA VALIDACIÓN (Sin Transacción)
// ==========================================
export const obtenerRecetaPorId = async (nroReceta) => {
  return await RecetaMedica.findByPk(nroReceta);
};

// ==========================================
// FUNCIONES COMPARTIDAS Y DE CREACIÓN
// ==========================================

// Le ponemos "= null" a la transacción para que sea opcional. 
// Si la llamas desde Despacho le pasas la transacción, si la llamas desde Validación, no le pasas nada.
export const actualizarReceta = async (receta, transaccion = null) => {
  const options = transaccion ? { transaction: transaccion } : {};
  return await receta.save(options);
};

// Para crear una nueva receta (Paso 4)
export const crearReceta = async (datosReceta) => {
  return await RecetaMedica.create(datosReceta);
};


export const crearRecetaConDetalles = async (datosReceta, listaMedicamentos) => {
  // 1. Guardamos la receta principal en la base de datos
  const receta = await RecetaMedica.create(datosReceta);

  // 2. Preparamos el arreglo para los detalles de los medicamentos
  const detalles = listaMedicamentos.map(med => ({
    nro_receta: datosReceta.nro_receta,
    cod_medicamento: med.cod_medicamento,
    cantidad: med.cantidad
  }));

  // 3. Guardamos todos los medicamentos de golpe en la nueva tabla
  await DetalleReceta.bulkCreate(detalles);

  return receta;
};
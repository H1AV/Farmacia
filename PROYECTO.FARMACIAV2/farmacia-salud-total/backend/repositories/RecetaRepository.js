import RecetaMedica from '../models/RecetaMedica.js';
import DetalleReceta from '../models/DetalleReceta.js';
import Medicamento from '../models/Medicamento.js'; // <--- FALTABA ESTA IMPORTACIÓN IMPORTANTE
import { Op } from 'sequelize';

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
// FUNCIONES PARA LA VALIDACIÓN Y BÚSQUEDA
// ==========================================
// CAMBIO CLAVE: Ahora trae la receta con todos sus medicamentos adentro
export const obtenerRecetaPorId = async (nroReceta) => {
  return await RecetaMedica.findOne({ where: { nro_receta: nroReceta } }, {
    include: [{
      model: DetalleReceta,
      as: 'detalles', 
      include: [{ model: Medicamento, as: 'medicamento' }]
    }]
  });
};

// ==========================================
// FUNCIONES COMPARTIDAS Y DE CREACIÓN
// ==========================================

// Le ponemos "= null" a la transacción para que sea opcional. 
export const actualizarReceta = async (receta, transaccion = null) => {
  const options = transaccion ? { transaction: transaccion } : {};
  return await receta.save(options);
};

// Para crear una nueva receta (Paso 4 original)
export const crearReceta = async (datosReceta) => {
  return await RecetaMedica.create(datosReceta);
};

export const crearRecetaConItems = async (datosReceta, items, transaccion) => {
  // 1. Verificar si la receta ya existe para evitar el error de Primary Key
  const existe = await RecetaMedica.findByPk(datosReceta.nro_receta);
  if (existe) throw new Error(`La receta con número ${datosReceta.nro_receta} ya está registrada.`);

  // 2. Crear la cabecera de la receta
  const receta = await RecetaMedica.create(datosReceta, { transaction: transaccion });
  
  // 3. Crear los detalles (medicamentos recetados)
  if (items && items.length > 0) {
    for (const item of items) {
      await DetalleReceta.create({
        nro_receta: receta.nro_receta,
        cod_medicamento: item.cod_medicamento,
        cantidad: item.cantidad
      }, { transaction: transaccion });
    }
  }
  
  return receta;
};

export const obtenerSiguienteNumeroReceta = async () => {
  // 1. Buscamos la última receta registrada que empiece con 'REC-'
  const ultimaReceta = await RecetaMedica.findOne({
    where: { 
      nro_receta: { [Op.like]: 'REC-%' } 
    },
    order: [['nro_receta', 'DESC']] // Ordenamos de mayor a menor
  });

  // 2. Si no hay ninguna receta en la base de datos, empezamos con el 0001
  if (!ultimaReceta) {
    return 'REC-0001';
  }

  // 3. Extraemos el número 
  const ultimoNumero = parseInt(ultimaReceta.nro_receta.replace('REC-', ''), 10);
  
  // 4. Le sumamos 1
  const siguienteNumero = ultimoNumero + 1;

  // 5. Lo volvemos a armar con ceros a la izquierda
  return `REC-${siguienteNumero.toString().padStart(4, '0')}`;
};

export const obtenerTodasLasRecetas = async () => {
  return await RecetaMedica.findAll({
    include: [{
      model: DetalleReceta,
      as: 'detalles', 
      include: [{ model: Medicamento, as: 'medicamento' }]
    }],
    order: [['fecha_emision', 'DESC']]
  });
};

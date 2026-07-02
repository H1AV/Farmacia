import RecetaMedica from '../models/RecetaMedica.js';
import DetalleReceta from '../models/DetalleReceta.js';

export const registrarReceta = async (req, res) => {
  try {
    const { numero_receta, medico_emisor, matricula, fecha_emision, medicamentos } = req.body;

    // 1. Guardamos los datos principales de la receta
    await RecetaMedica.create({
      nro_receta: numero_receta,
      medico_emisor: medico_emisor,
      matricula_medico: matricula,
      fecha_emision: fecha_emision,
      valida: true,        // La marcamos válida al crearla
      despachada: false    // Todavía no se entrega
    });

    // 2. Preparamos la lista dinámica de medicamentos para guardarla de golpe
    const detalles = medicamentos.map(med => ({
      nro_receta: numero_receta,
      cod_medicamento: med.cod_medicamento,
      cantidad: med.cantidad
    }));

    // .bulkCreate guarda toda la lista (sean 1 o 100 medicamentos) en la base de datos
    await DetalleReceta.bulkCreate(detalles);

    res.status(201).json({ estado: 'ok', mensaje: 'Receta registrada con éxito' });
  } catch (error) {
    console.error("❌ Error en backend al guardar receta:", error);
    res.status(500).json({ mensaje: 'Error al registrar', error: error.message });
  }
};
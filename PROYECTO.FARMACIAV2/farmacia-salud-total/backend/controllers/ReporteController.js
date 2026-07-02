import { Op } from 'sequelize';
import BoletaVenta from '../models/BoletaVenta.js';

export const ventasPorFecha = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    // Le agregamos explícitamente la zona horaria UTC-4 a las fechas
    // para que Node.js haga la conversión exacta a la hora de la base de datos.
    const fechaInicio = new Date(`${inicio}T00:00:00-04:00`);
    const fechaFin = new Date(`${fin}T23:59:59-04:00`);

    const ventas = await BoletaVenta.findAll({
      where: { 
        fecha: { 
          [Op.between]: [fechaInicio, fechaFin] 
        } 
      },
      order: [['fecha', 'DESC']]
    });

    res.json({ estado: 'ok', datos: ventas });
  } catch (err) {
    console.error("Error en reporte:", err);
    res.status(500).json({ mensaje: 'Error en el servidor al generar reporte', error: err.message });
  }
};
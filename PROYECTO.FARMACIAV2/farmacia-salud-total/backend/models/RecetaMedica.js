import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RecetaMedica = sequelize.define('RecetaMedica', {
  nro_receta: { type: DataTypes.STRING(30), primaryKey: true },
  medico_emisor: { type: DataTypes.STRING(100), allowNull: false },
  matricula_medico: DataTypes.STRING(30),
  fecha_emision: { type: DataTypes.DATE, allowNull: false },
  valida: { type: DataTypes.BOOLEAN, defaultValue: false },
  despachada: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'recetamedica', timestamps: false });

export default RecetaMedica;
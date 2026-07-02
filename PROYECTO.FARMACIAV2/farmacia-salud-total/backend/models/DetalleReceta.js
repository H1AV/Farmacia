import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DetalleReceta = sequelize.define('DetalleReceta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nro_receta: { type: DataTypes.STRING(30), allowNull: false },
  cod_medicamento: { type: DataTypes.STRING(20), allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, { 
  tableName: 'detallereceta', 
  timestamps: false 
});

export default DetalleReceta;
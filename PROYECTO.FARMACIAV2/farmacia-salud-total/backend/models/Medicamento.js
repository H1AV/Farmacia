import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Medicamento = sequelize.define('Medicamento', {
  cod_medicamento: { type: DataTypes.STRING(20), primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  principio_activo: DataTypes.STRING(100),
  precio_venta: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  stock_actual: { type: DataTypes.INTEGER, defaultValue: 0 },
  requiere_receta: { type: DataTypes.BOOLEAN, defaultValue: false },
  fecha_caducidad: DataTypes.DATE
}, { tableName: 'medicamentos', timestamps: false });

export default Medicamento;
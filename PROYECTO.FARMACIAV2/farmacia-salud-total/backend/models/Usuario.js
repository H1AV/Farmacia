import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  contrasena: { type: DataTypes.STRING(255), allowNull: false },
  rol: { type: DataTypes.STRING(20), allowNull: false },
  nombre_completo: { type: DataTypes.STRING(100), allowNull: false }
}, { tableName: 'usuarios', timestamps: false });

export default Usuario;
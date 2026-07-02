import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './Usuario.js';

const BoletaVenta = sequelize.define('BoletaVenta', {
  nro_boleta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  total_venta: DataTypes.DECIMAL(10,2),
  metodo_pago: DataTypes.STRING(30),
  estado: { type: DataTypes.STRING(20), defaultValue: 'pagado' }
}, { tableName: 'boletaventa', timestamps: false });

BoletaVenta.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default BoletaVenta;
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import BoletaVenta from './BoletaVenta.js';
import Medicamento from './Medicamento.js';

const ItemVenta = sequelize.define('ItemVenta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cantidad: DataTypes.INTEGER,
  precio_unitario: DataTypes.DECIMAL(10,2),
  subtotal: DataTypes.DECIMAL(10,2)
}, { tableName: 'itemventa', timestamps: false });

ItemVenta.belongsTo(BoletaVenta, { foreignKey: 'nro_boleta', onDelete: 'CASCADE' });
ItemVenta.belongsTo(Medicamento, { foreignKey: 'cod_medicamento' });

export default ItemVenta;
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import RecetaMedica from './RecetaMedica.js';
import Medicamento from './Medicamento.js';
import Usuario from './Usuario.js';

const KardexControl = sequelize.define('KardexControl', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cantidad_dispensada: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'kardexcontrol', timestamps: false });

KardexControl.belongsTo(RecetaMedica, { foreignKey: 'nro_receta' });
KardexControl.belongsTo(Medicamento, { foreignKey: 'cod_medicamento' });
KardexControl.belongsTo(Usuario, { foreignKey: 'farmaceutico_id' });

export default KardexControl;
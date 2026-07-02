import Usuario from './Usuario.js';
import BoletaVenta from './BoletaVenta.js';
import ItemVenta from './ItemVenta.js';
import Medicamento from './Medicamento.js';
import RecetaMedica from './RecetaMedica.js';
import DetalleReceta from './DetalleReceta.js'; 
import KardexControl from './KardexControl.js';

// Le decimos a Sequelize cómo se conectan las tablas //

// --- VENTAS ---
BoletaVenta.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'cajero' });
Usuario.hasMany(BoletaVenta, { foreignKey: 'usuario_id' });

BoletaVenta.hasMany(ItemVenta, { foreignKey: 'nro_boleta', as: 'items' });
ItemVenta.belongsTo(BoletaVenta, { foreignKey: 'nro_boleta', as: 'boleta' });

ItemVenta.belongsTo(Medicamento, { foreignKey: 'cod_medicamento', as: 'medicamento' });
Medicamento.hasMany(ItemVenta, { foreignKey: 'cod_medicamento' });


// Una Receta tiene muchos Detalles de medicamentos

RecetaMedica.hasMany(DetalleReceta, { foreignKey: 'nro_receta', as: 'detalles' });
DetalleReceta.belongsTo(RecetaMedica, { foreignKey: 'nro_receta', as: 'receta' });

DetalleReceta.belongsTo(Medicamento, { foreignKey: 'cod_medicamento', as: 'medicamento' });
Medicamento.hasMany(DetalleReceta, { foreignKey: 'cod_medicamento' });

// --- KARDEX ---
KardexControl.belongsTo(RecetaMedica, { foreignKey: 'nro_receta', as: 'receta' });
KardexControl.belongsTo(Medicamento, { foreignKey: 'cod_medicamento', as: 'medicamento' });
KardexControl.belongsTo(Usuario, { foreignKey: 'farmaceutico_id', as: 'farmaceutico' });

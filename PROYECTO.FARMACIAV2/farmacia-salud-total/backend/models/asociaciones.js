import BoletaVenta from './BoletaVenta.js';
import ItemVenta from './ItemVenta.js';
import Medicamento from './Medicamento.js';
import RecetaMedica from './RecetaMedica.js';
import DetalleReceta from './DetalleReceta.js';

// Le decimos a Sequelize cómo se conectan las tablas
BoletaVenta.hasMany(ItemVenta, { foreignKey: 'nro_boleta', as: 'items' });
ItemVenta.belongsTo(BoletaVenta, { foreignKey: 'nro_boleta', as: 'boleta' });

Medicamento.hasMany(ItemVenta, { foreignKey: 'cod_medicamento', as: 'ventas' });
ItemVenta.belongsTo(Medicamento, { foreignKey: 'cod_medicamento', as: 'medicamento' });


// Una Receta tiene muchos Detalles de medicamentos
RecetaMedica.hasMany(DetalleReceta, { foreignKey: 'nro_receta' });
DetalleReceta.belongsTo(RecetaMedica, { foreignKey: 'nro_receta' });

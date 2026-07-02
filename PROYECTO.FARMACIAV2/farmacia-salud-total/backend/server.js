import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import ventaRoutes from './routes/ventas.js';
import despachoRoutes from './routes/despacho.js';
import inventarioRoutes from './routes/inventario.js';
import reporteRoutes from './routes/reportes.js';
// 1. Añadimos la importación del nuevo router de recetas
import recetaRoutes from './routes/recetas.js'; 
import './models/asociaciones.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ventas', ventaRoutes);
app.use('/api/v1/despacho', despachoRoutes);
app.use('/api/v1/inventario', inventarioRoutes);
app.use('/api/v1/reportes', reporteRoutes);
// 2. Registramos el endpoint para que el frontend pueda crear recetas
app.use('/api/v1/recetas', recetaRoutes);

sequelize.sync({ alter: true }) // <--- ESTA ES LA MAGIA
  .then(() => console.log('✅ Conexión a BD exitosa y tablas sincronizadas'))
  .catch(err => console.error('❌ Error de sincronización:', err));

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));

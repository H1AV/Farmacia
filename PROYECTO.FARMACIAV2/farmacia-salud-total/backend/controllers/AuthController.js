import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    console.log(`Tratando de iniciar sesión con -> Usuario: ${usuario} | Clave: ${contrasena}`);

    const usuarioDB = await Usuario.findOne({ where: { usuario } });
    
    if (!usuarioDB) {
      console.log("❌ ERROR: El usuario no existe en la base de datos.");
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (contrasena !== '123456') {
      console.log("❌ ERROR: La contraseña no coincide con 123456.");
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    console.log("✅ ÉXITO: Acceso concedido.");
    const token = jwt.sign(
      { id: usuarioDB.id, usuario: usuarioDB.usuario, rol: usuarioDB.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ estado: 'ok', datos: { token, rol: usuarioDB.rol, nombre: usuarioDB.nombre_completo } });
  } catch (err) {
    console.error("❌ ERROR DEL SERVIDOR:", err.message);
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
};

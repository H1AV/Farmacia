import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ mensaje: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
  next();
};

export const soloFarmaceutico = (req, res, next) => {
  if (req.usuario.rol !== 'farmaceutico' && req.usuario.rol !== 'admin') return res.status(403).json({ mensaje: 'Acceso solo para farmacéuticos' });
  next();
};

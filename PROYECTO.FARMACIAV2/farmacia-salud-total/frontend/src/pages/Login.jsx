import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [datos, setDatos] = useState({ usuario: '', contrasena: '' });
  const navigate = useNavigate();

  const ingresar = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', datos);
      localStorage.setItem('token', res.data.datos.token);
      navigate('/ventas');
    } catch {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Mitad Imagen */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1920&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Farmacia Salud Total</h1>
          <p className="text-xl text-blue-50 drop-shadow-md">Gestión eficiente, control de inventario y atención de primera.</p>
        </div>
      </div>

      {/* Mitad Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-8">
        <form onSubmit={ingresar} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <img src="https://cdn-icons-png.flaticon.com/512/3004/3004018.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Bienvenido de vuelta</h2>
            <p className="text-gray-500 text-sm mt-2">Ingresa tus credenciales para acceder al sistema</p>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input type="text" value={datos.usuario} onChange={e => setDatos({...datos, usuario: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" value={datos.contrasena} onChange={e => setDatos({...datos, contrasena: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all mt-4">
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
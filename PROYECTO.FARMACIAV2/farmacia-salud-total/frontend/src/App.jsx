import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Venta from './pages/Venta';
import ColaDespacho from './pages/ColaDespacho';
import Inventario from './pages/Inventario';
import Recetas from './pages/Recetas';
import Reportes from './pages/Reportes';

const MenuNavegacion = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const linkActivo = (ruta) => location.pathname === ruta ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600" : "text-gray-600 hover:bg-gray-100";

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 bg-white shadow-xl flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b">
          <img src="https://cdn-icons-png.flaticon.com/512/3004/3004018.png" alt="Logo Farmacia" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-blue-800 leading-tight">Salud Total</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/ventas" className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${linkActivo('/ventas')}`}>🛒 Punto de Venta</Link>
          <Link to="/cola-despacho" className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${linkActivo('/cola-despacho')}`}>📦 Cola de Despacho</Link>
          <Link to="/inventario" className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${linkActivo('/inventario')}`}>💊 Inventario</Link>
          <Link to="/recetas" className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${linkActivo('/recetas')}`}>📝 Recetas</Link>
          <Link to="/reportes" className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${linkActivo('/reportes')}`}>📊 Reportes</Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={cerrarSesion} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition">
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <MenuNavegacion>{children}</MenuNavegacion> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ventas" element={<RutaProtegida><Venta /></RutaProtegida>} />
        <Route path="/cola-despacho" element={<RutaProtegida><ColaDespacho /></RutaProtegida>} />
        <Route path="/inventario" element={<RutaProtegida><Inventario /></RutaProtegida>} />
        <Route path="/recetas" element={<RutaProtegida><Recetas /></RutaProtegida>} />
        <Route path="/reportes" element={<RutaProtegida><Reportes /></RutaProtegida>} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from 'react';
import api from '../services/api';

export default function Reportes() {
  const [fechas, setFechas] = useState({ inicio: '', fin: '' });
  const [ventas, setVentas] = useState([]);
  const [buscado, setBuscado] = useState(false);

  const consultar = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/reportes/ventas?inicio=${fechas.inicio}&fin=${fechas.fin}`);
      setVentas(res.data.datos);
      setBuscado(true);
    } catch (err) {
      alert('❌ ' + err.response?.data.mensaje);
    }
  };

  const totalRecaudado = ventas.reduce((acc, v) => acc + Number(v.total_venta), 0);

// Reemplaza tu función anterior por esta versión limpia:
  const formatearFecha = (cadenaFecha) => {
    // El navegador detectará automáticamente que estás en Bolivia y convertirá la fecha
    const fecha = new Date(cadenaFecha);
    return fecha.toLocaleDateString('es-BO'); 
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="bg-orange-100 p-4 rounded-xl"><span className="text-2xl">📊</span></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard de Ventas</h2>
          <p className="text-gray-500">Métricas e histórico de transacciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={consultar} className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Inicio</label>
            <input type="date" value={fechas.inicio} onChange={e => setFechas({...fechas, inicio: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-orange-400 focus:border-orange-400" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Fin</label>
            <input type="date" value={fechas.fin} onChange={e => setFechas({...fechas, fin: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-orange-400 focus:border-orange-400" required />
          </div>
          <button type="submit" className="bg-orange-500 text-white font-bold p-3 rounded-lg px-8 hover:bg-orange-600 transition shadow-md h-[50px]">
            Consultar
          </button>
        </form>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10 text-8xl">💰</div>
          <h3 className="text-gray-300 font-medium mb-1 relative z-10">Total Recaudado (Periodo)</h3>
          <p className="text-4xl font-extrabold relative z-10">${totalRecaudado.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr><th className="p-4">Nro Boleta</th><th className="p-4">Fecha</th><th className="p-4">Total</th><th className="p-4">Método Pago</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ventas.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">
                  {buscado 
                    ? "📭 No hay ventas registradas en estas fechas." 
                    : "Selecciona un rango de fechas para ver resultados"}
                </td>
              </tr>
            ) : (
              ventas.map(v => (
                <tr key={v.nro_boleta} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">#{v.nro_boleta}</td>
                  <td className="p-4 text-gray-600">
                    {/* 👇 Usamos la nueva función aquí 👇 */}
                    {formatearFecha(v.fecha)}
                  </td>
                  <td className="p-4 font-bold text-gray-800">${v.total_venta}</td>
                  <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium capitalize">{v.metodo_pago}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
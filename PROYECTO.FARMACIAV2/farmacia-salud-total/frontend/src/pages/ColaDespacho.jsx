import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ColaDespacho() {
  const [pendientes, setPendientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const cargarPendientes = async () => {
    try {
      const res = await api.get('/ventas/pendientes');
      setPendientes(res.data.datos);
    } catch (err) {
      console.error('Error al cargar la cola:', err);
    }
  };

  useEffect(() => {
    cargarPendientes();
    // Opcional: Polling cada 10 segundos para actualizar la cola automáticamente
    const interval = setInterval(cargarPendientes, 10000);
    return () => clearInterval(interval);
  }, []);

  const despacharPedido = async (nro_boleta) => {
    try {
      await api.put(`/ventas/${nro_boleta}/entregar`);
      alert('✅ Pedido marcado como Entregado');
      setPedidoSeleccionado(null);
      cargarPendientes(); // Recargar la lista
    } catch (err) {
      alert('❌ Error: ' + err.response?.data.mensaje);
    }
  };

  // Filtro por número de boleta
  const pendientesFiltrados = pendientes.filter(p => 
    p.nro_boleta.toString().includes(busqueda)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <span>📦</span> Cola de Preparación y Despacho
        </h2>
        <input 
          type="text" 
          placeholder="🔍 Buscar Boleta (Ej: 15)" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-3 border rounded-lg shadow-sm w-64 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Bandeja de Pendientes (Grilla) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pendientesFiltrados.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">No hay pedidos pendientes de entrega. ¡Buen trabajo! 🎉</p>
        ) : (
          pendientesFiltrados.map((boleta) => (
            <div 
              key={boleta.nro_boleta} 
              onClick={() => setPedidoSeleccionado(boleta)}
              className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-400 cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-600">Boleta #{boleta.nro_boleta}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold animate-pulse">Pendiente</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Hora: {new Date(boleta.fecha).toLocaleTimeString()}
              </p>
              <p className="text-sm font-medium text-gray-700">
                {boleta.ItemVentas?.length || 0} productos a preparar
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal / Detalle del Pedido */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Preparar Boleta #{pedidoSeleccionado.nro_boleta}</h3>
              <button onClick={() => setPedidoSeleccionado(null)} className="text-white hover:text-gray-200 font-bold text-xl">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-gray-600 mb-4 font-medium">Verifique físicamente los siguientes productos:</p>
              
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 text-sm">
                  <tr>
                    <th className="p-3 rounded-l-lg">Producto</th>
                    <th className="p-3 text-center">Cantidad</th>
                    <th className="p-3 text-center rounded-r-lg">Alertas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pedidoSeleccionado.ItemVentas?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{item.Medicamento?.nombre}</td>
                      <td className="p-3 text-center text-lg font-bold text-blue-600">{item.cantidad}</td>
                      <td className="p-3 text-center">
                        {item.Medicamento?.requiere_receta ? (
                          <span title="Requiere Receta Retenida" className="text-red-500 text-xl cursor-help animate-bounce inline-block">🔴 📄</span>
                        ) : (
                          <span className="text-green-500">✅ Libre</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t flex gap-4 justify-end">
              <button 
                onClick={() => setPedidoSeleccionado(null)}
                className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg"
              >
                Cerrar
              </button>
              <button 
                onClick={() => despacharPedido(pedidoSeleccionado.nro_boleta)}
                className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow"
              >
                ✅ Marcar como Despachado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

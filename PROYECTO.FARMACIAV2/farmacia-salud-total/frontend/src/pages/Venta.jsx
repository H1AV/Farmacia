import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Venta() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [codSeleccionado, setCodSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [recetaBusqueda, setRecetaBusqueda] = useState('');
  const [recetaAutorizada, setRecetaAutorizada] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const res = await api.get('/inventario/stock');
      setMedicamentos(res.data.datos);
    };
    cargar();
  }, []);

  const agregarItem = () => {
    const med = medicamentos.find(m => m.cod_medicamento === codSeleccionado);
    if (!med) return alert('Seleccione un medicamento');
    if (med.stock_actual < cantidad) return alert('Stock insuficiente');
    if (medicamentoSeleccionado.requiere_receta && !recetaAutorizada) {
      return alert("Este medicamento requiere receta médica. Por favor cargue una receta primero.");
    }

    const subtotal = Number(med.precio_venta) * cantidad;
    setItems([...items, { ...med, cantidad, subtotal }]);
    setTotal(prev => prev + subtotal);
    setCantidad(1);
    setCodSeleccionado('');
  };

  const finalizarVenta = async () => {
    try {
      await api.post('/ventas', { items, metodo_pago: 'efectivo' });
      alert('✅ Venta registrada correctamente');
      setItems([]);
      setTotal(0);
    } catch (err) {
      alert('❌ Error: ' + err.response?.data.mensaje);
    }
  };

  const cargarRecetaAlCarrito = async () => {
    try {
      if (!recetaBusqueda) return alert("Ingrese un número de receta");
      
      // Añadimos .trim() para limpiar espacios invisibles al inicio o final
      const busquedaLimpia = recetaBusqueda.trim();
      
      const res = await api.get(`/recetas/${busquedaLimpia}`);
      const receta = res.data.datos;

      if (receta.despachada) return alert("Esta receta ya fue utilizada anteriormente.");

      // Formateamos los detalles de la receta para que encajen en el carrito
      const itemsNuevos = receta.detalles.map(det => ({
        cod_medicamento: det.cod_medicamento,
        nombre: det.medicamento.nombre,
        precio_venta: det.medicamento.precio_venta,
        cantidad: det.cantidad,
        requiere_receta: det.medicamento.requiere_receta,
        subtotal: det.cantidad * det.medicamento.precio_venta
      }));

      setCarrito([...carrito, ...itemsNuevos]);
      setRecetaAutorizada(receta.nro_receta);
      setRecetaBusqueda('');
      alert("✅ Receta cargada. Productos añadidos al carrito.");

    } catch (err) {
      alert("❌ " + (err.response?.data?.mensaje || "Receta no encontrada"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Panel Izquierdo: Selección */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span>🛒</span> Nueva Venta
        </h2>
        
        {/* Buscador de Recetas */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg flex gap-4 items-center">
        <span className="text-2xl">📄</span>
        <div className="flex-1">
          <label className="block text-sm font-bold text-blue-800 mb-1">Cargar productos desde Receta Médica:</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ej: REC-0001" 
              value={recetaBusqueda}
              onChange={(e) => setRecetaBusqueda(e.target.value)}
              className="border p-2 rounded w-64 outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button 
              type="button" 
              onClick={cargarRecetaAlCarrito}
              className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700"
            >
              Agregar Productos
            </button>
          </div>
        </div>
        {recetaAutorizada && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold border border-green-300">
            ✅ Receta Autorizada: {recetaAutorizada}
          </div>
        )}
      </div>

        <div className="bg-blue-50 p-4 rounded-xl mb-6 flex gap-4">
          <select value={codSeleccionado} onChange={e => setCodSeleccionado(e.target.value)} className="flex-1 border-0 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400">
            <option value="">Seleccione Medicamento...</option>
            {medicamentos.map(m => <option key={m.cod_medicamento} value={m.cod_medicamento}>{m.nombre} - ${m.precio_venta}</option>)}
          </select>
          <input type="number" min="1" value={cantidad} onChange={e => setCantidad(Number(e.target.value))} className="w-24 border-0 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-center font-bold" />
          <button onClick={agregarItem} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
            Añadir
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr><th className="p-4">Producto</th><th className="p-4 text-center">Cant.</th><th className="p-4 text-right">Precio Unit.</th><th className="p-4 text-right">Subtotal</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 italic">El carrito está vacío</td></tr>
              ) : (
                items.map((i, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{i.nombre}</td>
                    <td className="p-4 text-center">{i.cantidad}</td>
                    <td className="p-4 text-right text-gray-500">${i.precio_venta}</td>
                    <td className="p-4 text-right font-bold text-gray-700">${i.subtotal.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel Derecho: Resumen de Pago */}
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit flex flex-col">
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop" alt="Caja" className="w-full h-32 object-cover rounded-xl mb-6 shadow-inner" />
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Resumen</h3>
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500 font-medium">Total a Pagar:</span>
          <span className="text-4xl font-extrabold text-green-600">${total.toFixed(2)}</span>
        </div>
        <button onClick={finalizarVenta} disabled={items.length === 0} className="w-full bg-green-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-green-600 disabled:bg-gray-300 disabled:shadow-none transition-all">
          Cobrar e Imprimir
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import api from '../services/api';

export default function Despacho() {
  const [nroReceta, setNroReceta] = useState('');
  const [recetaValida, setRecetaValida] = useState(null);

  const validarReceta = async () => {
    try {
      const res = await api.get(`/despacho/validar/${nroReceta}`);
      
      // 🕵️‍♂️ RASTREADOR: Imprime en la consola del navegador todo lo que mandó el backend
      console.log("Datos recibidos de la receta:", res.data.datos);
      
      setRecetaValida(res.data.datos);
    } catch (err) {
      alert('❌ Error de validación: ' + (err.response?.data?.mensaje || err.message));
      setRecetaValida(null);
    }
  };

  const despachar = async () => {
    // 🛡️ ESCUDO 1: Agregamos DetalleRecetas aquí también para que el botón sepa qué enviar
    const listaItems = recetaValida.DetalleRecetas || recetaValida.itemsRecetados || recetaValida.items || [];
    
    if (listaItems.length === 0) {
      return alert('⚠️ No se puede despachar una receta sin medicamentos autorizados.');
    }

    try {
      // 🛡️ ESCUDO 2: Asegura el envío enviando 'listaItems' asegurando que siempre sea un array iterable
      await api.post('/despacho', { 
        nro_receta: recetaValida.nro_receta || recetaValida.numero_receta, 
        items: listaItems 
      });
      
      alert('✅ Despacho realizado y registrado en el Kardex Legal');
      setRecetaValida(null);
      setNroReceta('');
    } catch (err) {
      alert('❌ Error al despachar: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  // Declaramos la variable UNA SOLA VEZ antes del return
  const itemsAMostrar = recetaValida?.DetalleRecetas || recetaValida?.itemsRecetados || recetaValida?.items || [];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2">
        <span>💊</span> Despacho de Medicamentos Controlados
      </h2>
      
      <div className="flex gap-4 mb-8 bg-purple-50 p-6 rounded-lg">
        <input 
          type="text" 
          placeholder="Ingrese Número de Receta (Ej: REC-001)" 
          value={nroReceta} 
          onChange={e => setNroReceta(e.target.value)} 
          className="border border-purple-200 p-3 rounded-lg flex-1 shadow-sm focus:ring-2 focus:ring-purple-400" 
          disabled={recetaValida !== null}
        />
        <button 
          onClick={validarReceta} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg shadow transition-colors"
          disabled={!nroReceta || recetaValida !== null}
        >
          Validar Receta
        </button>
        
        {recetaValida && (
          <button 
            onClick={() => setRecetaValida(null)} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-3 rounded-lg shadow transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>

      {recetaValida && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-6 animate-fade-in-down">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-green-800">✅ Receta Auténtica y Vigente</h3>
            <p className="text-sm text-gray-600">Médico Emisor: {recetaValida.medico_emisor || recetaValida.medico || 'Dr. Desconocido'}</p>
          </div>

          <h4 className="font-bold text-gray-700 mb-2">Medicamentos Autorizados para Despacho:</h4>
          <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Medicamento</th>
                <th className="p-3 text-center">Dosis / Cantidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {itemsAMostrar.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-400 italic">
                    No se encontraron detalles de medicamentos vinculados a esta receta.
                  </td>
                </tr>
              ) : (
                itemsAMostrar.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-500 text-sm">{item.cod_medicamento || item.id_medicamento}</td>
                    <td className="p-3 font-medium text-gray-800">{item.nombre || item.medicamento}</td>
                    <td className="p-3 text-center font-bold text-blue-600">{item.cantidad || item.dosis}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-end">
            <button 
              onClick={despachar} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition-transform transform active:scale-95"
            >
              Confirmar Entrega y Guardar en Kardex
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
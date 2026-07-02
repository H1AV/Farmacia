import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Recetas() {
  // --- ESTADOS ---
  const [datos, setDatos] = useState({
    numero_receta: '',
    medico_emisor: '',
    matricula: '',
    fecha_emision: ''
  });
  
  const [historial, setHistorial] = useState([]);
  
  const [medicamentos, setMedicamentos] = useState([
    { cod_medicamento: '', cantidad: 1 }
  ]);

  // --- FUNCIONES DEL HISTORIAL Y NÚMERO ---
  const cargarHistorial = async () => {
    try {
      const res = await api.get('/recetas');
      setHistorial(res.data.datos);
    } catch (err) {
      console.error("Error al cargar historial", err);
    }
  };

  const cargarSiguienteNumero = async () => {
    try {
      const res = await api.get('/recetas/siguiente-numero');
      setDatos(prevDatos => ({ ...prevDatos, numero_receta: res.data.numero }));
    } catch (err) {
      console.error('Error al obtener el número de receta:', err);
    }
  };

  useEffect(() => {
    cargarSiguienteNumero();
    cargarHistorial();
  }, []);

  // --- FUNCIONES DEL FORMULARIO ---
  const agregarFila = () => {
    setMedicamentos([...medicamentos, { cod_medicamento: '', cantidad: 1 }]);
  };

  const actualizarFila = (index, campo, valor) => {
    const nuevaLista = [...medicamentos];
    nuevaLista[index][campo] = valor;
    setMedicamentos(nuevaLista);
  };

  const eliminarFila = (index) => {
    const nuevaLista = medicamentos.filter((_, i) => i !== index);
    setMedicamentos(nuevaLista);
  };

  const registrar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nro_receta: datos.numero_receta,
        medico: datos.medico_emisor,
        matricula: datos.matricula,
        fecha: datos.fecha_emision,
        items: medicamentos 
      };

      await api.post('/recetas', payload); 
      alert('✅ Receta registrada correctamente');
      
      setDatos({ numero_receta: '', medico_emisor: '', matricula: '', fecha_emision: '' });
      setMedicamentos([{ cod_medicamento: '', cantidad: 1 }]);

      cargarSiguienteNumero();
      cargarHistorial();

    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  return (
    // Contenedor principal: usa flex-row en pantallas grandes para poner columnas lado a lado
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* ================= COLUMNA IZQUIERDA: FORMULARIO ================= */}
      <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-md border border-gray-100 p-6 h-fit">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
          <span>📝</span> Nueva Receta
        </h2>
        
        <form onSubmit={registrar} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text" 
              placeholder="Generando código..." 
              value={datos.numero_receta} 
              readOnly 
              className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 font-bold text-gray-600 outline-none cursor-not-allowed" 
              required 
            />
            <input 
              type="date" 
              value={datos.fecha_emision} 
              onChange={e => setDatos({...datos, fecha_emision: e.target.value})} 
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none" 
              required 
            />
            <input 
              type="text" 
              placeholder="Médico emisor" 
              value={datos.medico_emisor} 
              onChange={e => setDatos({...datos, medico_emisor: e.target.value})} 
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none" 
              required 
            />
            <input 
              type="text" 
              placeholder="Matrícula profesional" 
              value={datos.matricula} 
              onChange={e => setDatos({...datos, matricula: e.target.value})} 
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none" 
              required 
            />
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4 bg-blue-50 p-4 rounded-xl">
            <h3 className="font-bold text-blue-800 mb-3">Medicamentos:</h3>
            
            {medicamentos.map((med, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  placeholder="Cód (Ej: MED001)" 
                  value={med.cod_medicamento} 
                  onChange={e => actualizarFila(index, 'cod_medicamento', e.target.value)} 
                  className="border border-gray-300 p-2 rounded-lg flex-1 w-full outline-none" 
                  required 
                />
                <input 
                  type="number" 
                  min="1" 
                  value={med.cantidad} 
                  onChange={e => actualizarFila(index, 'cantidad', Number(e.target.value))} 
                  className="border border-gray-300 p-2 rounded-lg w-16 text-center outline-none" 
                  required 
                />
                {medicamentos.length > 1 && (
                  <button type="button" onClick={() => eliminarFila(index)} className="bg-red-100 text-red-600 p-2 rounded-lg font-bold">🗑️</button>
                )}
              </div>
            ))}

            <button type="button" onClick={agregarFila} className="text-blue-700 font-semibold hover:text-blue-900 flex items-center gap-1 mt-2 text-sm">
              ➕ Añadir otro
            </button>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl shadow-md">
            Registrar Receta
          </button>
        </form>
      </div>

      {/* ================= COLUMNA DERECHA: HISTORIAL ================= */}
      <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>📚</span> Historial de Recetas Registradas
        </h3>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Nro Receta</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Médico</th>
                <th className="p-3">Medicamentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historial.length === 0 ? (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">No hay recetas registradas aún.</td></tr>
              ) : (
                historial.map((receta) => (
                  <tr key={receta.nro_receta} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-blue-600">{receta.nro_receta}</td>
                    <td className="p-3">{receta.fecha_emision}</td>
                    <td className="p-3">{receta.medico_emisor}</td>
                    <td className="p-3">
                      <ul className="list-disc pl-4 text-sm text-gray-600">
                        {receta.detalles?.map((det, i) => (
                          <li key={i}>{det.cantidad}x {det.medicamento?.nombre}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

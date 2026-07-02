import { useState } from 'react';
import api from '../services/api';

export default function Recetas() {
  // Datos generales de la receta
  const [datos, setDatos] = useState({
    numero_receta: '',
    medico_emisor: '',
    matricula: '',
    fecha_emision: ''
  });

  // Lista dinámica de medicamentos (inicia con 1 fila vacía)
  const [medicamentos, setMedicamentos] = useState([
    { cod_medicamento: '', cantidad: 1 }
  ]);

  // Funciones para manejar la lista dinámica
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
      // Enviamos la receta Y la lista de medicamentos juntos al backend
      await api.post('/recetas', { ...datos, medicamentos });
      
      alert('✅ Receta y medicamentos registrados correctamente');
      
      // Limpiamos el formulario
      setDatos({ numero_receta: '', medico_emisor: '', matricula: '', fecha_emision: '' });
      setMedicamentos([{ cod_medicamento: '', cantidad: 1 }]);
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <span>📝</span> Gestión de Recetas Médicas
      </h2>
      
      <form onSubmit={registrar} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Número de receta (Ej: REC-001)" value={datos.numero_receta} onChange={e => setDatos({...datos, numero_receta: e.target.value})} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none" required />
          <input type="date" value={datos.fecha_emision} onChange={e => setDatos({...datos, fecha_emision: e.target.value})} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none" required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Médico emisor" value={datos.medico_emisor} onChange={e => setDatos({...datos, medico_emisor: e.target.value})} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none" required />
          <input type="text" placeholder="Matrícula profesional" value={datos.matricula} onChange={e => setDatos({...datos, matricula: e.target.value})} className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none" required />
        </div>

        {/* --- ZONA DINÁMICA DE MEDICAMENTOS --- */}
        <div className="border-t border-gray-200 pt-4 mt-4 bg-blue-50 p-4 rounded-xl">
          <h3 className="font-bold text-blue-800 mb-3">Medicamentos Recetados:</h3>
          
          {medicamentos.map((med, index) => (
            <div key={index} className="flex gap-3 mb-3 animate-fade-in-down">
              <input 
                type="text" 
                placeholder="Cód. Medicamento (Ej: MED001)" 
                value={med.cod_medicamento} 
                onChange={e => actualizarFila(index, 'cod_medicamento', e.target.value)} 
                className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400 outline-none" 
                required 
              />
              <input 
                type="number" 
                min="1" 
                placeholder="Cant." 
                value={med.cantidad} 
                onChange={e => actualizarFila(index, 'cantidad', Number(e.target.value))} 
                className="border border-gray-300 p-3 rounded-lg w-24 text-center focus:ring-2 focus:ring-blue-400 outline-none" 
                required 
              />
              
              {/* Botón de eliminar (solo aparece si hay más de 1 fila) */}
              {medicamentos.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => eliminarFila(index)} 
                  className="bg-red-100 text-red-600 hover:bg-red-200 p-3 rounded-lg font-bold transition-colors"
                  title="Eliminar fila"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}

          <button 
            type="button" 
            onClick={agregarFila} 
            className="text-blue-700 font-semibold hover:text-blue-900 flex items-center gap-1 mt-2 text-sm"
          >
            ➕ Agregar otro medicamento
          </button>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl mt-6 shadow-md transition-transform transform active:scale-95 text-lg">
          Registrar Receta Completa
        </button>
      </form>
    </div>
  );
}
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Inventario() {
  const [medicamentos, setMedicamentos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const res = await api.get('/inventario/stock');
      setMedicamentos(res.data.datos);
    };
    cargar();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-cyan-700">Consulta de Inventario</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock Actual</th><th>Requiere Receta</th></tr>
        </thead>
        <tbody>
          {medicamentos.map(m => (
            <tr key={m.cod_medicamento} className={`border-t ${m.stock_actual < 10 ? 'bg-red-50' : ''}`}>
              <td>{m.cod_medicamento}</td>
              <td>{m.nombre}</td>
              <td>${m.precio_venta}</td>
              <td>{m.stock_actual}</td>
              <td>{m.requiere_receta ? 'Sí' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
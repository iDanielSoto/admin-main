// Dept.jsx con funcionalidades para ver detalles, eliminar y gestionar dispositivos
import React, { useState, useEffect } from 'react';
import ObtenerCoordenadas from './Map';
import { renderMiniMap } from './Map';

const DepartmentsPage = ({ departments, setDepartments, addLogEntry }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Render mini mapa al cambiar el departamento seleccionado
  useEffect(() => {
    if (selectedDepartment?.coordinates) {
      renderMiniMap(
        'mini-map',
        selectedDepartment.coordinates,
        selectedDepartment.color,
        selectedDepartment.fillColor
      );
    }
  }, [selectedDepartment]);

  const handleAddDepartmentFromMap = (newDept) => {
    const newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
    const departmentToAdd = { id: newId, ...newDept };
    setDepartments([...departments, departmentToAdd]);
    addLogEntry('Registro', 'Departamento', newDept.name, `Departamento creado desde mapa con ID ${newId}`);
    setIsDrawingMode(false);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm('¿Seguro que deseas eliminar este departamento?');
    if (!confirm) return;
    const updated = departments.filter(d => d.id !== id);
    const name = departments.find(d => d.id === id)?.name || 'Desconocido';
    setDepartments(updated);
    addLogEntry('Eliminación', 'Departamento', name, `Departamento eliminado`);
    setSelectedDepartment(null);
    setShowDetails(false);
  };

  const handleDeviceChange = (deptId, newDevices) => {
    const updated = departments.map(d =>
      d.id === deptId ? { ...d, devices: newDevices } : d
    );
    setDepartments(updated);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-700">Departamentos</h1>
        <button
          onClick={() => setIsDrawingMode(!isDrawingMode)}
          className={`px-4 py-2 rounded-lg text-white ${isDrawingMode ? 'bg-red-500' : 'bg-blue-500'} hover:opacity-90`}
        >
          {isDrawingMode ? 'Cancelar Dibujo' : 'Agregar por Mapa'}
        </button>
      </div>

      {isDrawingMode && (
        <ObtenerCoordenadas
          areasDefinidas={departments.map(d => ({
            id: d.id,
            nombre: d.name,
            descripcion: d.description,
            coordenadas: d.coordinates,
            color: d.color,
            fillColor: d.fillColor
          }))}
          onUpdateDepartmentFromMap={handleAddDepartmentFromMap}
        />
      )}

      <div className="grid grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg text-gray-800">{d.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{d.description}</p>
            <p className="text-xs text-gray-400">
              {d.coordinates?.length || 0} coordenadas | {d.devices?.length || 0} dispositivos
            </p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => {
                  setSelectedDepartment(d);
                  setShowDetails(true);
                }}
                className="text-blue-500 hover:underline text-sm"
              >
                Ver Detalles
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDetails && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[550px] max-h-[90vh] overflow-y-auto shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedDepartment.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{selectedDepartment.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Área en el mapa:</h4>
              <div className="h-60 w-full rounded border overflow-hidden" id="mini-map"></div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Dispositivos:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {(selectedDepartment.devices || []).map((d, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{d}</span>
                    <button
                      onClick={() => {
                        const updated = selectedDepartment.devices.filter(dev => dev !== d);
                        handleDeviceChange(selectedDepartment.id, updated);
                      }}
                      className="text-red-500 text-xs"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Nuevo dispositivo"
                  className="border rounded p-1 text-sm w-full"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.target.value.trim();
                      if (val) {
                        const updated = [...(selectedDepartment.devices || []), val];
                        handleDeviceChange(selectedDepartment.id, updated);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;

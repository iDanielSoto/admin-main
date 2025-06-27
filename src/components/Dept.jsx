import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Building2, Camera, HardDrive, Wifi, Plus, Edit2, ChevronUp, ChevronDown } from 'lucide-react';

// Componente GeneralInfo: Definido aquí para que sea accesible
const GeneralInfo = ({ activeSection, data }) => {
  if (activeSection === 'departments') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Resumen de Departamentos</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-gray-600">Total de Departamentos:</span>
            <span className="font-bold">{data.departmentsCount}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Empleados por Depto. (promedio):</span>
            <span className="font-bold">{data.averageEmployeesPerDepartment.toFixed(1)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Total de Dispositivos:</span>
            <span className="font-bold">{data.totalDevices}</span>
          </li>
        </ul>
      </div>
    );
  }
  return null;
};

export const DepartmentList = ({ departments, onEdit, onDelete, onAdd, selectedDepartment }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">Gestión de Departamentos</h2>
        <button
          onClick={onAdd}
          className="text-blue-500 hover:text-blue-600"
        >
          <PlusCircle />
        </button>
      </div>
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
        {departments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No hay departamentos registrados. Presiona el botón "+" para agregar uno nuevo.</p>
            <button
              onClick={onAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Agregar Departamento
            </button>
          </div>
        ) : (
          departments.map((department) => (
            <div
              key={department.id}
              className={`
                flex items-center justify-between py-3 px-2 border-b
                ${selectedDepartment?.id === department.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                cursor-pointer transition-colors
              `}
              onClick={() => onEdit(department)}
            >
              <div>
                <h3 className="font-semibold text-gray-700">{department.name}</h3>
                <p className="text-sm text-gray-500">{department.description}</p>
                <p className="text-xs text-gray-400">
                  {department.devices ? department.devices.length : 0} dispositivos
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(department.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DeviceModal = ({ device, onSave, onClose, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: device?.name || '',
    type: device?.type || 'Webcam',
    status: device?.status || 'available',
    description: device?.description || ''
  });

  const deviceTypes = [
    { value: 'Webcam', label: 'Cámara Web', icon: Camera },
    { value: 'Sensor', label: 'Sensor', icon: HardDrive },
    { value: 'Server', label: 'Servidor', icon: Wifi }
  ];

  const statusOptions = [
    { value: 'available', label: 'Disponible', color: 'text-green-500' },
    { value: 'online', label: 'En Línea', color: 'text-blue-500' },
    { value: 'offline', label: 'Apagado', color: 'text-red-500' },
    { value: 'unavailable', label: 'No Disponible', color: 'text-yellow-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave({
        ...device,
        ...formData,
        id: device?.id || Date.now()
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isEditing ? 'Editar Dispositivo' : 'Agregar Dispositivo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre del Dispositivo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Cámara Principal Oficina"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Tipo de Dispositivo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {deviceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Estado</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Descripción (Opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del dispositivo"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {isEditing ? 'Actualizar' : 'Agregar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeviceList = ({ devices, onEdit, onDelete, onAdd, onMovePriority }) => {
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Webcam': return Camera;
      case 'Sensor': return HardDrive;
      case 'Server': return Wifi;
      default: return HardDrive;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'online': return 'text-blue-500';
      case 'offline': return 'text-red-500';
      case 'unavailable': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'online': return 'En Línea';
      case 'offline': return 'Apagado';
      case 'unavailable': return 'No Disponible';
      default: return status;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-700">
          Dispositivos del Departamento
          {devices && devices.length > 0 && (
            <span className="text-xs text-gray-500 ml-2">(ordenados por prioridad)</span>
          )}
        </h4>
        <button
          onClick={onAdd}
          className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
        >
          <Plus size={16} />
          <span className="text-sm">Agregar</span>
        </button>
      </div>

      {devices && devices.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {devices.map((device, index) => {
            const IconComponent = getDeviceIcon(device.type);
            return (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors relative"
              >
                {/* Indicador de prioridad */}
                <div className="absolute left-1 top-1 bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded font-medium">
                  #{index + 1}
                </div>

                <div className="flex items-center space-x-3 ml-8">
                  <IconComponent size={18} className="text-gray-500" />
                  <div>
                    <h5 className="font-medium text-gray-700">{device.name}</h5>
                    <p className="text-sm text-gray-500">{device.type}</p>
                    {device.description && (
                      <p className="text-xs text-gray-400">{device.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <span className={`text-xs ${getStatusColor(device.status)} mr-2`}>
                    {getStatusLabel(device.status)}
                  </span>

                  {/* Controles de prioridad */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => onMovePriority(device.id, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      } transition-colors`}
                      title="Subir prioridad"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => onMovePriority(device.id, 'down')}
                      disabled={index === devices.length - 1}
                      className={`p-1 rounded ${
                        index === devices.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      } transition-colors`}
                      title="Bajar prioridad"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>

                  {/* Controles de edición */}
                  <button
                    onClick={() => onEdit(device)}
                    className="text-blue-500 hover:text-blue-600 p-1"
                    title="Editar dispositivo"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(device.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                    title="Eliminar dispositivo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <HardDrive className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No hay dispositivos agregados</p>
          <p className="text-xs">Haz clic en "Agregar" para añadir dispositivos</p>
        </div>
      )}
    </div>
  );
};

export const DepartmentDetails = ({ selectedDepartment, onUpdate, onSave, onCancel, addLogEntry }) => {
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  const handleAddDevice = (device) => {
    const currentDevices = selectedDepartment.devices || [];
    const updatedDevices = [...currentDevices, device];
    onUpdate('devices', updatedDevices);
    addLogEntry('Registro', 'Dispositivo', device.name, `Dispositivo '${device.name}' agregado al departamento '${selectedDepartment.name}'`);
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setShowDeviceModal(true);
  };

  const handleUpdateDevice = (updatedDevice) => {
    const currentDevices = selectedDepartment.devices || [];
    const updatedDevices = currentDevices.map(device =>
      device.id === updatedDevice.id ? updatedDevice : device
    );
    onUpdate('devices', updatedDevices);
    addLogEntry('Modificación', 'Dispositivo', updatedDevice.name, `Dispositivo '${updatedDevice.name}' modificado en el departamento '${selectedDepartment.name}'`);
    setEditingDevice(null);
  };

  const handleDeleteDevice = (deviceId) => {
    const currentDevices = selectedDepartment.devices || [];
    const deviceName = currentDevices.find(d => d.id === deviceId)?.name || 'Desconocido';
    const updatedDevices = currentDevices.filter(device => device.id !== deviceId);
    onUpdate('devices', updatedDevices);
    addLogEntry('Eliminación', 'Dispositivo', deviceName, `Dispositivo '${deviceName}' eliminado del departamento '${selectedDepartment.name}'`);
  };

  const handleMovePriority = (deviceId, direction) => {
    const currentDevices = selectedDepartment.devices || [];
    const deviceIndex = currentDevices.findIndex(device => device.id === deviceId);

    if (deviceIndex === -1) return;

    const newDevices = [...currentDevices];

    if (direction === 'up' && deviceIndex > 0) {
      [newDevices[deviceIndex], newDevices[deviceIndex - 1]] =
      [newDevices[deviceIndex - 1], newDevices[deviceIndex]];
    } else if (direction === 'down' && deviceIndex < newDevices.length - 1) {
      [newDevices[deviceIndex], newDevices[deviceIndex + 1]] =
      [newDevices[deviceIndex + 1], newDevices[deviceIndex]];
    }

    onUpdate('devices', newDevices);
  };

  const handleDeviceModalSave = (device) => {
    if (editingDevice) {
      handleUpdateDevice(device);
    } else {
      handleAddDevice(device);
    }
    setShowDeviceModal(false);
    setEditingDevice(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Detalles del Departamento</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Nombre del Departamento</label>
          <input
            type="text"
            value={selectedDepartment.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Descripción</label>
          <textarea
            value={selectedDepartment.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            className="w-full p-2 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Campo para Coordenadas */}
        <div>
          <label className="block text-gray-700 mb-2">Coordenadas (JSON Array)</label>
          <textarea
            value={JSON.stringify(selectedDepartment.coordinates)}
            onChange={(e) => {
              try {
                const coords = JSON.parse(e.target.value);
                if (Array.isArray(coords) && coords.every(arr => Array.isArray(arr) && arr.length === 2)) {
                  onUpdate('coordinates', coords);
                } else {
                  console.error('Formato de coordenadas inválido. Debe ser un array de arrays [lat, lng].');
                }
              } catch (error) {
                console.error('Error parseando JSON de coordenadas:', error);
              }
            }}
            className="w-full p-2 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: [[lat1, lng1], [lat2, lng2]]"
          />
          <p className="text-sm text-gray-500 mt-1">
            Las coordenadas deben ser un array de arrays, por ejemplo: [[lat1, lng1], [lat2, lng2], ...].
            Puedes obtenerlas haciendo clic en el mapa en la sección "Mapa".
          </p>
        </div>

        {/* Selectores de Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Color del Borde</label>
            <input
              type="color"
              value={selectedDepartment.color || '#0000FF'}
              onChange={(e) => onUpdate('color', e.target.value)}
              className="w-full h-10 p-1 border rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Color de Relleno</label>
            <input
              type="color"
              value={selectedDepartment.fillColor || '#AAAAFF'}
              onChange={(e) => onUpdate('fillColor', e.target.value)}
              className="w-full h-10 p-1 border rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Sección de Dispositivos */}
        <div className="border-t pt-6">
          <DeviceList
            devices={selectedDepartment.devices || []}
            onEdit={handleEditDevice}
            onDelete={handleDeleteDevice}
            onAdd={() => setShowDeviceModal(true)}
            onMovePriority={handleMovePriority}
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Guardar Cambios
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal de Dispositivo */}
      {showDeviceModal && (
        <DeviceModal
          device={editingDevice}
          onSave={handleDeviceModalSave}
          onClose={() => {
            setShowDeviceModal(false);
            setEditingDevice(null);
          }}
          isEditing={!!editingDevice}
        />
      )}
    </div>
  );
};

export const AddDepartmentModal = ({ newDepartment, onChange, onAdd, onClose, addLogEntry }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Agregar Nuevo Departamento</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre del Departamento</label>
            <input
              type="text"
              value={newDepartment.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Ventas"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Descripción</label>
            <textarea
              value={newDepartment.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full p-2 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del departamento"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Agregar Departamento
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// DepartmentsPage wrapper
const DepartmentsPage = ({ departments, setDepartments, addLogEntry, currentUser, roles, permissions }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '', devices: [], coordinates: [], color: '#0000FF', fillColor: '#AAAAFF' });

  const handleAddDepartment = () => {
    const newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
    const departmentToAdd = { id: newId, ...newDepartment };
    setDepartments([...departments, departmentToAdd]);
    setIsAddingDepartment(false);
    setNewDepartment({ name: '', description: '', devices: [], coordinates: [], color: '#0000FF', fillColor: '#AAAAFF' });
    addLogEntry('Registro', 'Departamento', departmentToAdd.name, `Nuevo departamento: ${departmentToAdd.name}`);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
  };

  const handleUpdateDepartment = (field, value) => {
    setSelectedDepartment(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDepartment = () => {
    setDepartments(departments.map(dept => dept.id === selectedDepartment.id ? selectedDepartment : dept));
    addLogEntry('Modificación', 'Departamento', selectedDepartment.name, `Departamento modificado: ${selectedDepartment.name}`);
    setSelectedDepartment(null);
  };

  const handleDeleteDepartment = (id) => {
    const departmentName = departments.find(dept => dept.id === id)?.name || 'Desconocido';
    setDepartments(departments.filter(dept => dept.id !== id));
    addLogEntry('Eliminación', 'Departamento', departmentName, `Departamento eliminado: ${departmentName}`);
    setSelectedDepartment(null);
  };

  // Calculate totalEmployees based on departments data (assuming each department has an 'employees' array)
  const totalEmployees = departments.reduce((acc, dept) => acc + (dept.employees ? dept.employees.length : 0), 0);

  return (
    <div className="grid grid-cols-4 gap-4 h-full p-4">
      <div className="col-span-1 space-y-4 overflow-y-auto">
        <DepartmentList
          departments={departments}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
          onAdd={() => setIsAddingDepartment(true)}
          selectedDepartment={selectedDepartment}
        />
      </div>

      <div className="col-span-2 space-y-4 overflow-y-auto">
        {selectedDepartment ? (
          <DepartmentDetails
            selectedDepartment={selectedDepartment}
            onUpdate={handleUpdateDepartment}
            onSave={handleSaveDepartment}
            onCancel={() => setSelectedDepartment(null)}
            addLogEntry={addLogEntry}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 h-full flex flex-col items-center justify-center text-center">
            <Building2 className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecciona o Agrega un Departamento</h3>
            <p className="text-gray-500 mb-4">Haz clic en un departamento existente para editar o presiona el botón "+" para agregar uno nuevo.</p>
            <button
              onClick={() => setIsAddingDepartment(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Agregar Departamento
            </button>
          </div>
        )}
      </div>

      <div className="col-span-1">
        <GeneralInfo
          activeSection="departments"
          data={{
            departmentsCount: departments.length,
            averageEmployeesPerDepartment: departments.length > 0 ? totalEmployees / departments.length : 0,
            activeDepartmentsCount: departments.length,
            totalDevices: departments.reduce((acc, dept) => acc + (dept.devices ? dept.devices.length : 0), 0)
          }}
        />
      </div>

      {isAddingDepartment && (
        <AddDepartmentModal
          newDepartment={newDepartment}
          onChange={(field, value) => setNewDepartment(prev => ({ ...prev, [field]: value }))}
          onAdd={handleAddDepartment}
          onClose={() => setIsAddingDepartment(false)}
          addLogEntry={addLogEntry}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;
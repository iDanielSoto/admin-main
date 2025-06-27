import React, { useState } from 'react';
import { ShieldCheck, PlusCircle, Trash2, Edit3, Shield } from 'lucide-react';

const AddPermissionModal = ({ newPermission, onChange, onAdd, onClose, canManagePermissions }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Agregar Nuevo Permiso</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={newPermission.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Ej. Crear Usuarios"
              disabled={!canManagePermissions}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Descripción</label>
            <textarea
              value={newPermission.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full p-2 border rounded-lg h-24"
              placeholder="Descripción del permiso"
              disabled={!canManagePermissions}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Categoría</label>
            <select
              value={newPermission.category}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canManagePermissions}
            >
              <option value="">Seleccionar categoría</option>
              <option value="Vista">Vista</option>
              <option value="Departamentos">Departamentos</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (canManagePermissions) onAdd();
                else alert('No tienes permiso para agregar permisos.');
              }}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${!canManagePermissions ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canManagePermissions}
            >
              Agregar Permiso
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

const GeneralPermissionInfo = ({ permissionsCount, categoriesCount }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="font-semibold text-gray-700 mb-4">Resumen de Permisos</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span className="text-gray-600">Total de Permisos:</span>
          <span className="font-bold">{permissionsCount}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-600">Categorías:</span>
          <span className="font-bold">{categoriesCount}</span>
        </li>
      </ul>
    </div>
  );
};

const GestionarPermisos = ({ permissions, setPermissions, addLogEntry, hasPermission }) => {
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  const [newPermission, setNewPermission] = useState({ name: '', description: '', category: '' });
  const [filterCategory, setFilterCategory] = useState('');
  const canManagePermissions = () => {
    const hasWriteOrAdmin = hasPermission('Escritura') || hasPermission('Administrador');
    const adminPermissionExists = permissions.some(permission => permission.name.toLowerCase() === 'administrador');
    
    return hasWriteOrAdmin || !adminPermissionExists;
  };
  const isProtectedPermission = (permissionName) => {
    const protectedPermissions = ['administrador', 'escritura'];
    return protectedPermissions.includes(permissionName.toLowerCase());
  };
  const categories = [...new Set(permissions.map(p => p.category))].filter(Boolean);
  const filteredPermissions = filterCategory 
    ? permissions.filter(p => p.category === filterCategory)
    : permissions;
  const handleAddPermission = () => {
    if (!canManagePermissions()) {
      alert('No tienes permiso para agregar permisos.');
      return;
    }
    if (!newPermission.name.trim() || !newPermission.description.trim() || !newPermission.category) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    if (isProtectedPermission(newPermission.name)) {
      alert('No se puede crear un permiso con este nombre. Los permisos críticos del sistema están protegidos.');
      return;
    }

    const newId = permissions.length > 0 ? Math.max(...permissions.map(p => p.id)) + 1 : 1;
    const permissionToAdd = { id: newId, ...newPermission };
    setPermissions([...permissions, permissionToAdd]);
    setIsAddingPermission(false);
    setNewPermission({ name: '', description: '', category: '' });
    addLogEntry('Registro', 'Permiso', permissionToAdd.name, `Nuevo permiso: ${permissionToAdd.name}`);
  };

  const handleEditPermission = (permission) => {
    setSelectedPermission(permission);
  };

  const handleUpdatePermission = (field, value) => {
    if (field === 'name' && isProtectedPermission(selectedPermission.name)) {
      alert('No se puede modificar el nombre de este permiso crítico.');
      return;
    }
    if (field === 'name' && isProtectedPermission(value)) {
      alert('No se puede usar este nombre. Los permisos críticos del sistema están protegidos.');
      return;
    }

    setSelectedPermission(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePermission = () => {
    if (!canManagePermissions()) {
      alert('No tienes permiso para guardar cambios en permisos.');
      return;
    }
    
    setPermissions(permissions.map(p => p.id === selectedPermission.id ? selectedPermission : p));
    addLogEntry('Modificación', 'Permiso', selectedPermission.name, `Permiso modificado: ${selectedPermission.name}`);
    setSelectedPermission(null);
  };

  const handleDeletePermission = (id) => {
    if (!canManagePermissions()) {
      alert('No tienes permiso para eliminar permisos.');
      return;
    }

    const permissionToDelete = permissions.find(p => p.id === id);
    if (!permissionToDelete) return;

    if (isProtectedPermission(permissionToDelete.name)) {
      alert(`No se puede eliminar el permiso "${permissionToDelete.name}". Este permiso es crítico para el sistema.`);
      return;
    }

    const permissionName = permissionToDelete.name;
    setPermissions(permissions.filter(p => p.id !== id));
    addLogEntry('Eliminación', 'Permiso', permissionName, `Permiso eliminado: ${permissionName}`);
    setSelectedPermission(null);
  };

  const handleNewPermissionChange = (field, value) => {
    setNewPermission(prev => ({ ...prev, [field]: value }));
  };
  const currentCanManage = canManagePermissions();

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {/* Lista de Permisos */}
      <div className="col-span-1 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Gestión de Permisos</h2>
          <button
            onClick={() => currentCanManage ? setIsAddingPermission(true) : alert('No tienes permiso para agregar permisos.')}
            className={`text-blue-500 hover:text-blue-600 ${!currentCanManage ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!currentCanManage}
          >
            <PlusCircle />
          </button>
        </div>
        
        {/* Filtro por categoría */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <label className="block text-gray-700 mb-2">Filtrar por Categoría</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 max-h-96 overflow-y-auto">
          {filteredPermissions.map((permission) => (
            <div
              key={permission.id}
              className={`
                flex items-center justify-between py-3 px-2 border-b
                ${selectedPermission?.id === permission.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                cursor-pointer transition-colors
              `}
              onClick={() => handleEditPermission(permission)}
            >
              <div className="flex items-center space-x-2">
                {isProtectedPermission(permission.name) && (
                  <Shield size={16} className="text-yellow-500" title="Permiso protegido" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-700">{permission.name}</h3>
                  <p className="text-sm text-gray-500">{permission.category}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePermission(permission.id);
                  }}
                  className={`text-red-500 hover:text-red-600 ${
                    !currentCanManage || isProtectedPermission(permission.name)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={!currentCanManage || isProtectedPermission(permission.name)}
                  title={isProtectedPermission(permission.name) ? 'Este permiso está protegido y no se puede eliminar' : ''}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de Edición */}
      <div className="col-span-2 space-y-4 overflow-y-auto">
        {selectedPermission ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Detalles del Permiso</h2>
              {isProtectedPermission(selectedPermission.name) && (
                <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                  <Shield size={14} className="text-yellow-600" />
                  <span className="text-xs text-yellow-600 font-medium">Protegido</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre del Permiso</label>
                <input
                  type="text"
                  value={selectedPermission.name}
                  onChange={(e) => currentCanManage && handleUpdatePermission('name', e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    isProtectedPermission(selectedPermission.name) ? 'bg-gray-100' : ''
                  }`}
                  disabled={!currentCanManage || isProtectedPermission(selectedPermission.name)}
                  title={isProtectedPermission(selectedPermission.name) ? 'El nombre de este permiso no se puede modificar' : ''}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={selectedPermission.description}
                  onChange={(e) => currentCanManage && handleUpdatePermission('description', e.target.value)}
                  className="w-full p-2 border rounded-lg h-24"
                  disabled={!currentCanManage}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Categoría</label>
                <select
                  value={selectedPermission.category}
                  onChange={(e) => currentCanManage && handleUpdatePermission('category', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  disabled={!currentCanManage}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Vista">Vista</option>
                  <option value="Departamentos">Departamentos</option>
                  <option value="General">General</option>
                </select>
              </div>
              {isProtectedPermission(selectedPermission.name) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Este es un permiso crítico del sistema. El nombre no se puede modificar para mantener la seguridad del sistema.
                  </p>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={() => currentCanManage ? handleSavePermission() : alert('No tienes permiso para guardar cambios en permisos.')}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${!currentCanManage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!currentCanManage}
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setSelectedPermission(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 h-full flex flex-col items-center justify-center text-center">
            <ShieldCheck className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecciona o Agrega un Permiso</h3>
            <p className="text-gray-500 mb-4">Haz clic en un permiso existente para editarlo o presiona el botón "+" para agregar uno nuevo.</p>
            <button 
              onClick={() => currentCanManage ? setIsAddingPermission(true) : alert('No tienes permiso para agregar permisos.')} 
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${!currentCanManage ? 'opacity-50 cursor-not-allowed' : ''}`} 
              disabled={!currentCanManage}
            >
              Agregar Permiso
            </button>
          </div>
        )}
      </div>

      {/* Panel de Información General */}
      <div className="col-span-1">
        <GeneralPermissionInfo 
          permissionsCount={permissions.length} 
          categoriesCount={categories.length} 
        />
      </div>

      {/* Modal para Agregar Permiso */}
      {isAddingPermission && (
        <AddPermissionModal
          newPermission={newPermission}
          onChange={handleNewPermissionChange}
          onAdd={handleAddPermission}
          onClose={() => setIsAddingPermission(false)}
          canManagePermissions={currentCanManage}
        />
      )}
    </div>
  );
};

export default GestionarPermisos;
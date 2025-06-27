import React, { useState } from 'react';
import { SquareUser, PlusCircle, Trash2, Shield } from 'lucide-react';

const AddRoleModal = ({ newRole, onChange, onAdd, onClose, canManageRoles }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Agregar Nuevo Rol</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={newRole.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Ej. Lectura"
              disabled={!canManageRoles}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Descripción</label>
            <textarea
              value={newRole.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full p-2 border rounded-lg h-24"
              placeholder="Descripción del rol"
              disabled={!canManageRoles}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (canManageRoles) onAdd();
                else alert('No tienes permiso para agregar roles.');
              }}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${!canManageRoles ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canManageRoles}
            >
              Agregar Rol
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

const GeneralRoleInfo = ({ rolesCount }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="font-semibold text-gray-700 mb-4">Resumen de Roles</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span className="text-gray-600">Total de Roles:</span>
          <span className="font-bold">{rolesCount}</span>
        </li>
      </ul>
    </div>
  );
};

const GestionarRoles = ({ roles, setRoles, addLogEntry, hasPermission }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] });

  // Función mejorada para verificar permisos de gestión de roles
  const canManageRoles = () => {
    const hasWriteOrAdmin = hasPermission('Escritura') || hasPermission('Administrador');
    const adminRoleExists = roles.some(role => role.name.toLowerCase() === 'administrador');
    
    return hasWriteOrAdmin || !adminRoleExists;
  };

  const isProtectedRole = (roleName) => {
    const protectedRoles = ['administrador'];
    return protectedRoles.includes(roleName.toLowerCase());
  };

  const handleAddRole = () => {
    if (!canManageRoles()) {
      alert('No tienes permiso para agregar roles.');
      return;
    }

    if (!newRole.name.trim() || !newRole.description.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (isProtectedRole(newRole.name)) {
      alert('No se puede crear un rol con este nombre. Los roles críticos del sistema están protegidos.');
      return;
    }

    const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    const roleToAdd = { id: newId, ...newRole };
    setRoles([...roles, roleToAdd]);
    setIsAddingRole(false);
    setNewRole({ name: '', description: '', permissions: [] });
    addLogEntry('Registro', 'Rol', roleToAdd.name, `Nuevo rol: ${roleToAdd.name}`);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
  };

  const handleUpdateRole = (field, value) => {
    if (field === 'name' && isProtectedRole(selectedRole.name)) {
      alert('No se puede modificar el nombre de este rol crítico.');
      return;
    }
    
    if (field === 'name' && isProtectedRole(value)) {
      alert('No se puede usar este nombre. Los roles críticos del sistema están protegidos.');
      return;
    }

    setSelectedRole(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveRole = () => {
    if (!canManageRoles()) {
      alert('No tienes permiso para guardar cambios en roles.');
      return;
    }
    setRoles(roles.map(r => r.id === selectedRole.id ? selectedRole : r));
    addLogEntry('Modificación', 'Rol', selectedRole.name, `Rol modificado: ${selectedRole.name}`);
    setSelectedRole(null);
  };

  const handleDeleteRole = (id) => {
    if (!canManageRoles()) {
      alert('No tienes permiso para eliminar roles.');
      return;
    }

    const roleToDelete = roles.find(r => r.id === id);
    if (!roleToDelete) return;

    if (isProtectedRole(roleToDelete.name)) {
      alert(`No se puede eliminar el rol "${roleToDelete.name}". Este rol es crítico para el sistema.`);
      return;
    }

    const roleName = roleToDelete.name;
    setRoles(roles.filter(r => r.id !== id));
    addLogEntry('Eliminación', 'Rol', roleName, `Rol eliminado: ${roleName}`);
    setSelectedRole(null);
  };

  const handleNewRoleChange = (field, value) => {
    setNewRole(prev => ({ ...prev, [field]: value }));
  };

  const currentCanManage = canManageRoles();

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {/* Lista de Roles */}
      <div className="col-span-1 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Gestión de Roles</h2>
          <button
            onClick={() => currentCanManage ? setIsAddingRole(true) : alert('No tienes permiso para agregar roles.')}
            className={`text-blue-500 hover:text-blue-600 ${!currentCanManage ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!currentCanManage}
          >
            <PlusCircle />
          </button>
        </div>
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`
                flex items-center justify-between py-3 px-2 border-b
                ${selectedRole?.id === role.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                cursor-pointer transition-colors
              `}
              onClick={() => handleEditRole(role)}
            >
              <div className="flex items-center space-x-2">
                {isProtectedRole(role.name) && (
                  <Shield size={16} className="text-yellow-500" title="Rol protegido" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-700">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRole(role.id);
                  }}
                  className={`text-red-500 hover:text-red-600 ${
                    !currentCanManage || isProtectedRole(role.name) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                  disabled={!currentCanManage || isProtectedRole(role.name)}
                  title={isProtectedRole(role.name) ? 'Este rol está protegido y no se puede eliminar' : ''}
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
        {selectedRole ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Detalles del Rol</h2>
              {isProtectedRole(selectedRole.name) && (
                <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                  <Shield size={14} className="text-yellow-600" />
                  <span className="text-xs text-yellow-600 font-medium">Protegido</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre del Rol</label>
                <input
                  type="text"
                  value={selectedRole.name}
                  onChange={(e) => currentCanManage && handleUpdateRole('name', e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    isProtectedRole(selectedRole.name) ? 'bg-gray-100' : ''
                  }`}
                  disabled={!currentCanManage || isProtectedRole(selectedRole.name)}
                  title={isProtectedRole(selectedRole.name) ? 'El nombre de este rol no se puede modificar' : ''}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={selectedRole.description}
                  onChange={(e) => currentCanManage && handleUpdateRole('description', e.target.value)}
                  className="w-full p-2 border rounded-lg h-24"
                  disabled={!currentCanManage}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Permisos Asignados</label>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Los permisos son manejados internamente por el rol.</p>
                </div>
              </div>
              {isProtectedRole(selectedRole.name) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Este es un rol crítico del sistema. El nombre no se puede modificar para mantener la seguridad del sistema.
                  </p>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={() => currentCanManage ? handleSaveRole() : alert('No tienes permiso para guardar cambios en roles.')}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${!currentCanManage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!currentCanManage}
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 h-full flex flex-col items-center justify-center text-center">
            <SquareUser className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecciona o Agrega un Rol</h3>
            <p className="text-gray-500 mb-4">Haz clic en un rol existente para editar o presiona el botón "+" para agregar uno nuevo.</p>
            <button 
              onClick={() => currentCanManage ? setIsAddingRole(true) : alert('No tienes permiso para agregar roles.')} 
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${!currentCanManage ? 'opacity-50 cursor-not-allowed' : ''}`} 
              disabled={!currentCanManage}
            >
              Agregar Rol
            </button>
          </div>
        )}
      </div>

      {/* Panel de Información General */}
      <div className="col-span-1">
        <GeneralRoleInfo rolesCount={roles.length} />
      </div>

      {/* Modal para Agregar Rol */}
      {isAddingRole && (
        <AddRoleModal
          newRole={newRole}
          onChange={handleNewRoleChange}
          onAdd={handleAddRole}
          onClose={() => setIsAddingRole(false)}
          canManageRoles={currentCanManage}
        />
      )}
    </div>
  );
};

export default GestionarRoles;
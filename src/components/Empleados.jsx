import React, { useState } from 'react';
import { PlusCircle, Trash2, UserPlus, User as UserIcon } from 'lucide-react';
const EmployeeList = ({ employees, onEdit, onDelete, onAdd, canDeleteUsers }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">Gestión de Empleados</h2>
        <button onClick={onAdd} className="text-blue-500 hover:text-blue-600">
          <PlusCircle />
        </button>
      </div>
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between py-3 px-2 border-b hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onEdit(employee)}
          >
            <div>
              <h3 className="font-semibold text-gray-700">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canDeleteUsers) {
                    onDelete(employee.id);
                  } else {
                    alert('No tienes permiso para eliminar usuarios.');
                  }
                }}
                className={`text-red-500 hover:text-red-600 ${!canDeleteUsers ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canDeleteUsers}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const EmployeeDetails = ({ employee, onUpdate, onSave, onCancel, departments, roles, canEdit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Detalles del Empleado</h2>
      <div className="space-y-4 flex-grow overflow-y-auto pr-4 -mr-4">
        <div>
          <label className="block text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={employee.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={!canEdit}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={employee.email}
            onChange={(e) => onUpdate('email', e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={!canEdit}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Rol</label>
          <select
            value={employee.role}
            onChange={(e) => onUpdate('role', e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={!canEdit}
          >
            <option value="">Selecciona un rol</option>
            {roles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Departamento</label>
          <select
            value={employee.department}
            onChange={(e) => onUpdate('department', e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={!canEdit}
          >
            <option value="">Selecciona un departamento</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-4 mt-6 pt-4 border-t">
        <button
          onClick={() => {
            if (canEdit) {
              onSave();
            } else {
              alert('No tienes permiso para guardar cambios.');
            }
          }}
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!canEdit}
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
  );
};
const AddEmployeeModal = ({ newEmployee, onChange, onAdd, onClose, departments, roles, canEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Agregar Nuevo Empleado</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Nombre completo"
              required
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={newEmployee.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="ejemplo@empresa.com"
              required
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Rol</label>
            <select
              value={newEmployee.role}
              onChange={(e) => onChange('role', e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canEdit}
            >
              <option value="">Selecciona un rol</option>
              {roles.map(role => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Departamento</label>
            <select
              value={newEmployee.department}
              onChange={(e) => onChange('department', e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canEdit}
            >
              <option value="">Selecciona un departamento</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (canEdit) {
                  onAdd();
                } else {
                  alert('No tienes permiso para agregar empleados.');
                }
              }}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canEdit}
            >
              Agregar Empleado
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
const GeneralInfoEmployees = ({ employeeCount }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="font-semibold text-gray-700 mb-4">Resumen General</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span className="text-gray-600">Total de Empleados:</span>
          <span className="font-bold">{employeeCount}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-600">Activos:</span>
          <span className="font-bold">{employeeCount}</span>
        </li>
      </ul>
    </div>
  );
};

const EmpleadosPage = ({ 
  employees, 
  setEmployees, 
  departments, 
  roles, 
  addLogEntry, 
  hasPermission 
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: '', department: '' });

  const canEditEmployees = hasPermission('Escritura') || hasPermission('Administrador');
  const canDeleteUsers = hasPermission('Eliminar Usuarios');

  const handleAddEmployee = () => {
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const employeeToAdd = { id: newId, ...newEmployee };
    setEmployees([...employees, employeeToAdd]);
    setIsAddingEmployee(false);
    setNewEmployee({ name: '', email: '', role: '', department: '' });
    addLogEntry('Registro', 'Empleado', employeeToAdd.name, `Nuevo empleado: ${employeeToAdd.name}`);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleUpdateEmployee = (field, value) => {
    setSelectedEmployee(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEmployee = () => {
    setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? selectedEmployee : emp));
    addLogEntry('Modificación', 'Empleado', selectedEmployee.name, `Empleado modificado: ${selectedEmployee.name}`);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    if (!hasPermission('Eliminar Usuarios')) {
      alert('No tienes permiso para eliminar usuarios.');
      return;
    }
    const employeeName = employees.find(emp => emp.id === id)?.name || 'Desconocido';
    setEmployees(employees.filter(emp => emp.id !== id));
    addLogEntry('Eliminación', 'Empleado', employeeName, `Empleado eliminado: ${employeeName}`);
    setSelectedEmployee(null);
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      <div className="col-span-1 space-y-4 overflow-y-auto">
        <EmployeeList
          employees={employees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          onAdd={() => canEditEmployees ? setIsAddingEmployee(true) : alert('No tienes permiso para agregar empleados.')}
          canDeleteUsers={canDeleteUsers}
        />
      </div>
      <div className="col-span-2 space-y-4 overflow-y-auto">
        {selectedEmployee ? (
          <EmployeeDetails
            employee={selectedEmployee}
            onUpdate={handleUpdateEmployee}
            onSave={handleSaveEmployee}
            onCancel={() => setSelectedEmployee(null)}
            departments={departments}
            roles={roles}
            canEdit={canEditEmployees}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 h-full flex flex-col items-center justify-center text-center">
            <UserPlus className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecciona o Agrega un Empleado</h3>
            <p className="text-gray-500 mb-4">Haz clic en un empleado existente para editar o presiona el botón "+" para agregar uno nuevo.</p>
            <button 
              onClick={() => canEditEmployees ? setIsAddingEmployee(true) : alert('No tienes permiso para agregar empleados.')} 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Agregar Empleado
            </button>
          </div>
        )}
      </div>

      <div className="col-span-1">
        <GeneralInfoEmployees employeeCount={employees.length} />
      </div>

      {isAddingEmployee && (
        <AddEmployeeModal
          newEmployee={newEmployee}
          onChange={(field, value) => setNewEmployee(prev => ({ ...prev, [field]: value }))}
          onAdd={handleAddEmployee}
          onClose={() => setIsAddingEmployee(false)}
          departments={departments}
          roles={roles}
          canEdit={canEditEmployees}
        />
      )}
    </div>
  );
};

export default EmpleadosPage;
import React, { useState } from "react";
import {
  PlusCircle,
  Trash2,
  UserPlus,
  Save,
  X,
  Users,
  Edit,
  UserCheck,
  Plus,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  History,
} from "lucide-react";

// Componente para mostrar el estado del empleado
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Activo: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    "No activo": { color: "bg-red-100 text-red-800", icon: XCircle },
    Inactivo: { color: "bg-gray-100 text-gray-800", icon: AlertCircle },
  };

  const config = statusConfig[status] || statusConfig["Inactivo"];
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      <IconComponent className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

// Componente para el historial del empleado
const EmployeeHistory = ({ employee, onClose }) => {
  if (!employee.historial || employee.historial.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-2/3 max-h-96">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Historial de {employee.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-500 text-center">
            No hay registros en el historial para este empleado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-2/3 max-h-96">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-700">
            Historial de {employee.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-64 space-y-3">
          {employee.historial.map((entry, index) => (
            <div
              key={index}
              className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{entry.tipo}</span>
                <span className="text-sm text-gray-500">{entry.fecha}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{entry.descripcion}</p>
              {entry.motivo && (
                <p className="text-gray-500 text-xs mt-1">
                  <strong>Motivo:</strong> {entry.motivo}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Modal para cambio de estado
const StatusChangeModal = ({ employee, onStatusChange, onClose }) => {
  const [newStatus, setNewStatus] = useState(employee.estado);
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = () => {
    if (newStatus !== employee.estado) {
      onStatusChange(employee.id, newStatus, motivo, descripcion);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          Cambiar Estado - {employee.name}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nuevo Estado</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Activo">Activo</option>
              <option value="No activo">No activo</option>
            </select>
          </div>

          {newStatus !== employee.estado && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">Motivo</label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Motivo del cambio de estado"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full p-2 border rounded-lg h-20"
                  placeholder="Descripción detallada del cambio"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Confirmar
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
  );
};

const EmployeeList = ({
  employees,
  onEdit,
  onDelete,
  onAdd,
  onStatusChange,
  canDeleteUsers,
  onViewHistory,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="w-6 h-6 text-blue-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Empleados</h2>
        </div>
        <button
          onClick={onAdd}
          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{employee.name}</span>
                  <StatusBadge status={employee.estado} />
                </div>
                <p className="text-sm text-gray-500">{employee.email}</p>
                <p className="text-xs text-gray-400">
                  Creado: {employee.fechaCreacion}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => onEdit(employee)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onStatusChange(employee)}
                className="text-orange-500 hover:text-orange-600 text-sm"
              >
                <UserCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewHistory(employee)}
                className="text-purple-500 hover:text-purple-600 text-sm"
              >
                <History className="w-4 h-4" />
              </button>
              {canDeleteUsers && (
                <button
                  onClick={() => onDelete(employee.id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmployeeDetails = ({
  employee,
  onUpdate,
  onSave,
  onCancel,
  departments,
  roles,
  canEdit,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Detalles del Empleado
        </h2>
        <div className="flex items-center space-x-2">
          <StatusBadge status={employee.estado} />
        </div>
      </div>

      <div className="space-y-4 flex-grow overflow-y-auto pr-4 -mr-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={employee.name}
              onChange={(e) => onUpdate("name", e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={employee.email}
              onChange={(e) => onUpdate("email", e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canEdit}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Rol</label>
            <select
              value={employee.role}
              onChange={(e) => onUpdate("role", e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canEdit}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Departamento</label>
            <select
              value={employee.department}
              onChange={(e) => onUpdate("department", e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canEdit}
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de fechas */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            Información de Fechas
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">
                Fecha de Creación
              </label>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                {employee.fechaCreacion}
              </div>
            </div>
            {employee.fechaActivacion && (
              <div>
                <label className="block text-gray-600 mb-1">
                  Última Activación
                </label>
                <div className="flex items-center text-green-700">
                  <Clock className="w-4 h-4 mr-2" />
                  {employee.fechaActivacion}
                </div>
              </div>
            )}
            {employee.fechaDesactivacion && (
              <div>
                <label className="block text-gray-600 mb-1">
                  Última Desactivación
                </label>
                <div className="flex items-center text-red-700">
                  <Clock className="w-4 h-4 mr-2" />
                  {employee.fechaDesactivacion}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-6 pt-4 border-t">
        <button
          onClick={() => {
            if (canEdit) {
              onSave();
            } else {
              alert("No tienes permiso para guardar cambios.");
            }
          }}
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center ${
            !canEdit ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!canEdit}
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center"
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </button>
      </div>
    </div>
  );
};

const AddEmployeeModal = ({
  newEmployee,
  onChange,
  onAdd,
  onClose,
  departments,
  roles,
  canEdit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Agregar Nuevo Empleado
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) => onChange("name", e.target.value)}
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
              onChange={(e) => onChange("email", e.target.value)}
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
              onChange={(e) => onChange("role", e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canEdit}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Departamento</label>
            <select
              value={newEmployee.department}
              onChange={(e) => onChange("department", e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={!canEdit}
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (canEdit) {
                  onAdd();
                } else {
                  alert("No tienes permiso para agregar empleados.");
                }
              }}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
                !canEdit ? "opacity-50 cursor-not-allowed" : ""
              }`}
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

const GeneralInfoEmployees = ({ employees }) => {
  const activeEmployees = employees.filter(
    (emp) => emp.estado === "Activo"
  ).length;
  const inactiveEmployees = employees.filter(
    (emp) => emp.estado === "No activo"
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="font-semibold text-gray-700 mb-4">Resumen General</h3>
      <ul className="space-y-3">
        <li className="flex justify-between items-center">
          <span className="text-gray-600">Total de Empleados:</span>
          <span className="font-bold text-lg">{employees.length}</span>
        </li>
        <li className="flex justify-between items-center">
          <span className="text-gray-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            Activos:
          </span>
          <span className="font-bold text-green-600">{activeEmployees}</span>
        </li>
        <li className="flex justify-between items-center">
          <span className="text-gray-600 flex items-center">
            <XCircle className="w-4 h-4 mr-1 text-red-500" />
            Inactivos:
          </span>
          <span className="font-bold text-red-600">{inactiveEmployees}</span>
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
  hasPermission,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);

  const canEditEmployees =
    hasPermission("Escritura") || hasPermission("Administrador");
  const canDeleteUsers = hasPermission("Eliminar Usuarios");

  // Función para obtener fecha actual formateada
  const getCurrentDate = () => {
    return new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para agregar entrada al historial del empleado
  const addEmployeeHistoryEntry = (
    employeeId,
    tipo,
    descripcion,
    motivo = null
  ) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        if (emp.id === employeeId) {
          const newHistoryEntry = {
            fecha: getCurrentDate(),
            tipo,
            descripcion,
            motivo,
          };
          return {
            ...emp,
            historial: [...(emp.historial || []), newHistoryEntry],
          };
        }
        return emp;
      })
    );
  };

  const handleAddEmployee = () => {
    const newId =
      employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const currentDate = getCurrentDate();

    const employeeToAdd = {
      id: newId,
      ...newEmployee,
      estado: "Activo",
      fechaCreacion: currentDate,
      fechaActivacion: currentDate,
      fechaDesactivacion: null,
      historial: [
        {
          fecha: currentDate,
          tipo: "Creación",
          descripcion: `Empleado creado en el sistema`,
          motivo: "Nuevo empleado",
        },
      ],
    };

    setEmployees([...employees, employeeToAdd]);
    setIsAddingEmployee(false);
    setNewEmployee({ name: "", email: "", role: "", department: "" });
    addLogEntry(
      "Registro",
      "Empleado",
      employeeToAdd.name,
      `Nuevo empleado: ${employeeToAdd.name}`
    );
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleUpdateEmployee = (field, value) => {
    setSelectedEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEmployee = () => {
    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id ? selectedEmployee : emp
      )
    );
    addLogEntry(
      "Modificación",
      "Empleado",
      selectedEmployee.name,
      `Empleado modificado: ${selectedEmployee.name}`
    );
    addEmployeeHistoryEntry(
      selectedEmployee.id,
      "Modificación",
      `Datos del empleado actualizados`
    );
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    if (!hasPermission("Eliminar Usuarios")) {
      alert("No tienes permiso para eliminar usuarios.");
      return;
    }
    const employeeName =
      employees.find((emp) => emp.id === id)?.name || "Desconocido";
    setEmployees(employees.filter((emp) => emp.id !== id));
    addLogEntry(
      "Eliminación",
      "Empleado",
      employeeName,
      `Empleado eliminado: ${employeeName}`
    );
    setSelectedEmployee(null);
  };

  const handleStatusChange = (employeeId, newStatus, motivo, descripcion) => {
    const currentDate = getCurrentDate();

    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        if (emp.id === employeeId) {
          const updatedEmployee = { ...emp, estado: newStatus };

          if (newStatus === "Activo") {
            updatedEmployee.fechaActivacion = currentDate;
          } else if (newStatus === "No activo") {
            updatedEmployee.fechaDesactivacion = currentDate;
          }

          return updatedEmployee;
        }
        return emp;
      })
    );

    // Agregar al historial del empleado
    const employee = employees.find((emp) => emp.id === employeeId);
    const actionDescription = descripcion || `Estado cambiado a ${newStatus}`;
    addEmployeeHistoryEntry(
      employeeId,
      "Cambio de Estado",
      actionDescription,
      motivo
    );

    // Agregar al log general
    addLogEntry(
      "Modificación",
      "Empleado",
      employee?.name,
      `Estado cambiado a ${newStatus}: ${motivo}`
    );
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      <div className="col-span-1 space-y-4 overflow-y-auto">
        <EmployeeList
          employees={employees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          onAdd={() =>
            canEditEmployees
              ? setIsAddingEmployee(true)
              : alert("No tienes permiso para agregar empleados.")
          }
          onStatusChange={(employee) => setShowStatusModal(employee)}
          onViewHistory={(employee) => setShowHistoryModal(employee)}
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Selecciona o Agrega un Empleado
            </h3>
            <p className="text-gray-500 mb-4">
              Haz clic en un empleado existente para editar o presiona el botón
              "+" para agregar uno nuevo.
            </p>
            <button
              onClick={() =>
                canEditEmployees
                  ? setIsAddingEmployee(true)
                  : alert("No tienes permiso para agregar empleados.")
              }
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Agregar Empleado
            </button>
          </div>
        )}
      </div>

      <div className="col-span-1">
        <GeneralInfoEmployees employees={employees} />
      </div>

      {isAddingEmployee && (
        <AddEmployeeModal
          newEmployee={newEmployee}
          onChange={(field, value) =>
            setNewEmployee((prev) => ({ ...prev, [field]: value }))
          }
          onAdd={handleAddEmployee}
          onClose={() => setIsAddingEmployee(false)}
          departments={departments}
          roles={roles}
          canEdit={canEditEmployees}
        />
      )}

      {showStatusModal && (
        <StatusChangeModal
          employee={showStatusModal}
          onStatusChange={handleStatusChange}
          onClose={() => setShowStatusModal(null)}
        />
      )}

      {showHistoryModal && (
        <EmployeeHistory
          employee={showHistoryModal}
          onClose={() => setShowHistoryModal(null)}
        />
      )}
    </div>
  );
};

export default EmpleadosPage;

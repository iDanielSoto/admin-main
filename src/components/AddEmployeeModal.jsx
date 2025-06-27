const AddEmployeeModal = ({ newEmployee, onChange, onAdd, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-semibold mb-6">Agregar Nuevo Empleado</h2>
        <div className="space-y-4">
          {['Nombre', 'Email', 'Rol', 'Departamento'].map((field) => (
            <input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newEmployee[field]}
              onChange={(e) => onChange(field, e.target.value)}
              className="w-full p-3 border rounded"
            />
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar</button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancelar</button>
        </div>
      </div>
    </div>
  );
  
  export default AddEmployeeModal;
  
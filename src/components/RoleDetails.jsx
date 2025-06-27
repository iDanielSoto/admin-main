import { Save, X } from 'lucide-react';

const RoleDetails = ({ role, onUpdate, onSave, onCancel }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Detalles del Rol</h2>
      <div className="flex space-x-2">
        <button onClick={onSave} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
          <Save className="w-5 h-5 mr-2 inline" /> Guardar
        </button>
        <button onClick={onCancel} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
          <X className="w-5 h-5 mr-2 inline" /> Cancelar
        </button>
      </div>
    </div>
    <div className="space-y-4">
      {['Nombre', 'Descripción'].map((field) => (
        <div key={field}>
          <label className="block text-gray-700 mb-2 capitalize">{field}</label>
          <input
            value={role[field]}
            onChange={(e) => onUpdate(field, e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
    </div>
  </div>
);

export default RoleDetails;
import { Users, Edit, Trash2, Plus } from 'lucide-react';

const RoleList = ({ roles, onEdit, onDelete, onAdd }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Users className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
      </div>
      <button onClick={onAdd} className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition">
        <Plus className="w-5 h-5" />
      </button>
    </div>

    <div className="space-y-2">
      {roles.map((role) => (
        <div key={role.id} className="flex items-center justify-between bg-gray-50 p-2 rounded hover:bg-gray-100 transition">
          <div className="flex items-center">
            <span>{role.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => onEdit(role)} className="text-blue-500 hover:text-blue-600">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(role.id)} className="text-red-500 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RoleList;
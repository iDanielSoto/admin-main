import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Filter, Clock, User, Building, Wrench, PlusCircle, Trash2, Edit2, Search } from 'lucide-react';

const LogEntry = ({ log }) => {
  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'Registro': return <PlusCircle size={16} className="text-green-500" />;
      case 'Modificación': return <Edit2 size={16} className="text-blue-500" />;
      case 'Eliminación': return <Trash2 size={16} className="text-red-500" />;
      default: return <Wrench size={16} className="text-gray-500" />;
    }
  };

  const getTargetIcon = (targetType) => {
    switch (targetType) {
      case 'Empleado': return <User size={16} className="text-purple-500" />;
      case 'Departamento': return <Building size={16} className="text-orange-500" />;
      case 'Rol': return <Wrench size={16} className="text-cyan-500" />;
      case 'Permiso': return <Filter size={16} className="text-yellow-500" />;
      case 'Dispositivo': return <Clock size={16} className="text-indigo-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        {getActionIcon(log.actionType)}
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-800 font-medium">
          <span className="flex items-center space-x-1">
            {getTargetIcon(log.targetType)}
            <span>{log.targetType}: <span className="font-semibold">{log.targetName}</span></span>
          </span>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          <span className="font-semibold">{log.actionType}</span> por <span className="italic">{log.user || 'Sistema'}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{log.description}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-gray-400">{moment(log.timestamp).format('DD/MM/YYYY HH:mm:ss')}</p>
      </div>
    </div>
  );
};

const LogsPage = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActionType, setFilterActionType] = useState('Todos');
  const [filterTargetType, setFilterTargetType] = useState('Todos');

  const actionTypes = ['Todos', 'Registro', 'Modificación', 'Eliminación'];
  const targetTypes = ['Todos', 'Empleado', 'Departamento', 'Rol', 'Permiso', 'Dispositivo'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm.toLowerCase() === '' ||
                          log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActionType = filterActionType === 'Todos' || log.actionType === filterActionType;
    const matchesTargetType = filterTargetType === 'Todos' || log.targetType === filterTargetType;

    return matchesSearch && matchesActionType && matchesTargetType;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Filter className="mr-3 text-blue-600" size={28} /> Registros de Actividad
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o usuario..."
            className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div>
          <select
            value={filterActionType}
            onChange={(e) => setFilterActionType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {actionTypes.map(type => (
              <option key={type} value={type}>{type === 'Todos' ? 'Todas las Acciones' : type}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterTargetType}
            onChange={(e) => setFilterTargetType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {targetTypes.map(type => (
              <option key={type} value={type}>{type === 'Todos' ? 'Todos los Objetivos' : type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto border rounded-lg bg-gray-50 p-2">
        {filteredLogs.length > 0 ? (
          filteredLogs
            .sort((a, b) => b.timestamp - a.timestamp) // Ordenar por fecha, más reciente primero
            .map((log, index) => <LogEntry key={index} log={log} />)
        ) : (
          <div className="text-center py-10 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-lg font-medium">No hay registros de actividad que coincidan.</p>
            <p className="text-sm">Intenta ajustar los filtros o la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;
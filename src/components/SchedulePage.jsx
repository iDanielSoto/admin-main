import React, { useState } from 'react';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const nameBlock = 'NA';
const generarHoras = () => {
  const horas = [];
  for (let i = 7; i < 24 + 7; i++) {
    const hora = i % 24;
    const formato = hora < 12 ? 'AM' : 'PM';
    const hora12 = hora % 12 === 0 ? 12 : hora % 12;
    horas.push(`${hora12}:00 ${formato}`);
  }
  return horas;
};

const SchedulePage = ({ employees, addLogEntry, hasPermission, currentUser }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [horarios, setHorarios] = useState({}); // { userId: { Lunes: [{inicio, fin}], Martes: [...], ... } }

  const [nuevoHorario, setNuevoHorario] = useState({ dia: 'Lunes', inicio: '07:00', fin: '08:00' });

  const agregarHorario = () => {
    const { dia, inicio, fin } = nuevoHorario;

    if (!selectedUser) return alert('Selecciona un usuario primero');
    if (inicio >= fin) return alert('La hora de inicio debe ser menor a la hora de fin');

    // Verificar permisos
    if (!hasPermission('Escritura') && !hasPermission('Administrador')) {
      alert('No tienes permiso para gestionar horarios');
      return;
    }

    const horariosUsuario = horarios[selectedUser.id] || {};
    const diaActual = horariosUsuario[dia] || [];

    // Validar cruces - convertir formato 24 horas para comparación
    const inicioMin = timeToMinutes(inicio);
    const finMin = timeToMinutes(fin);
    
    const cruce = diaActual.some(h => {
      const hInicioMin = timeToMinutes(h.inicio);
      const hFinMin = timeToMinutes(h.fin);
      return !(finMin <= hInicioMin || inicioMin >= hFinMin);
    });
    
    if (cruce) return alert('Horario se cruza con uno existente');

    const nuevo = {
      ...horarios,
      [selectedUser.id]: {
        ...horariosUsuario,
        [dia]: [...diaActual, { inicio, fin }]
      }
    };

    setHorarios(nuevo);
    
    // Agregar log de la acción
    if (addLogEntry) {
      addLogEntry('Horario', 'Empleado', selectedUser.name, 
        `Horario agregado: ${dia} de ${inicio} a ${fin}`);
    }
  };

  // Función para convertir tiempo en formato HH:MM a minutos
  const timeToMinutes = (time) => {
    if (!time || typeof time !== 'string') return 0;
    const [hours, minutes] = time.split(':').map(num => parseInt(num) || 0);
    return hours * 60 + minutes;
  };

  // Función para convertir formato 12 horas a minutos
  const horaToMin = (hora) => {
    if (!hora || typeof hora !== 'string') return 0;
    
    const match = hora.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    
    const [, h, min, meridiano] = match;
    let total = parseInt(h) % 12;
    if (meridiano.toUpperCase() === 'PM') total += 12;
    return total * 60 + parseInt(min);
  };

  // Función para convertir minutos a formato HH:MM
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const eliminarHorario = (dia, index) => {
    if (!selectedUser) return;
    
    if (!hasPermission('Escritura') && !hasPermission('Administrador')) {
      alert('No tienes permiso para eliminar horarios');
      return;
    }

    const horariosUsuario = horarios[selectedUser.id] || {};
    const diaActual = horariosUsuario[dia] || [];
    const horarioEliminado = diaActual[index];
    
    const nuevoDia = diaActual.filter((_, i) => i !== index);
    
    const nuevo = {
      ...horarios,
      [selectedUser.id]: {
        ...horariosUsuario,
        [dia]: nuevoDia
      }
    };

    setHorarios(nuevo);
    
    if (addLogEntry && horarioEliminado) {
      addLogEntry('Horario', 'Empleado', selectedUser.name, 
        `Horario eliminado: ${dia} de ${horarioEliminado.inicio} a ${horarioEliminado.fin}`);
    }
  };

  const renderHorarioTabla = () => {
    const horas = generarHoras();
    const data = horarios[selectedUser?.id] || {};

    return (
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border border-gray-300 text-sm mt-4">
          <thead>
            <tr>
              <th className="border p-2 w-20 bg-gray-100">Hora</th>
              {diasSemana.map(dia => (
                <th key={dia} className="border p-2 bg-gray-100">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map(hora => (
              <tr key={hora}>
                <td className="border p-1 text-center font-medium bg-gray-50">{hora}</td>
                {diasSemana.map(dia => {
                  const horaMinutos = horaToMin(hora);
                  const eventos = (data[dia] || []).filter(ev => {
                    const inicioMin = timeToMinutes(ev.inicio);
                    const finMin = timeToMinutes(ev.fin);
                    return horaMinutos >= inicioMin && horaMinutos < finMin;
                  });
                  return (
                    <td key={dia} className={`border text-center ${eventos.length ? 'bg-blue-200' : ''}`}>
                      {eventos.length ? document.getElementById('nameBlock').value : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderHorariosList = () => {
    if (!selectedUser) return null;
    const data = horarios[selectedUser.id] || {};
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Horarios de {selectedUser.name}</h3>
        {diasSemana.map(dia => (
          <div key={dia} className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">{dia}</h4>
            {(data[dia] || []).length === 0 ? (
              <p className="text-gray-500 text-sm ml-4">Sin horarios asignados</p>
            ) : (
              <div className="ml-4 space-y-2">
                {(data[dia] || []).map((horario, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{horario.inicio} - {horario.fin}</span>
                    {(hasPermission('Escritura') || hasPermission('Administrador')) && (
                      <button 
                        onClick={() => eliminarHorario(dia, index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Horarios</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-600">Seleccionar Usuario:</label>
        <select
          className="p-2 border rounded w-full max-w-xs"
          onChange={(e) => {
            const userId = parseInt(e.target.value);
            const user = employees.find(emp => emp.id === userId);
            setSelectedUser(user || null);
          }}
          value={selectedUser?.id || ''}
        >
          <option value="">-- Selecciona --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      {selectedUser && (hasPermission('Escritura') || hasPermission('Administrador')) && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Horario</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              {/* Nombre del bloque de horario */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del evento:</label>
              <input type="text" className='block text-sm font-medium mb-1 border p-2 rounded w-full' placeholder="Ej. Reunión, Descanso" id='nameBlock'></input>
              {/* Día del bloque de horario */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Día:</label>
              <select className="border p-2 rounded w-full" value={nuevoHorario.dia} onChange={e => setNuevoHorario({ ...nuevoHorario, dia: e.target.value })}>
                {diasSemana.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Hora de inicio y fin del bloque de horario */}
            <div className='flex flex-row gap-4'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio:</label>
              <input
                type="time"
                className="border p-2 rounded w-full"
                value={nuevoHorario.inicio}
                onChange={e => setNuevoHorario({ ...nuevoHorario, inicio: e.target.value })}
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin:</label>
              <input
                type="time"
                className="border p-2 rounded w-full"
                value={nuevoHorario.fin}
                onChange={e => setNuevoHorario({ ...nuevoHorario, fin: e.target.value })}
              />
            </div>
            <button 
              onClick={agregarHorario} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Añadir Horario
            </button>
          </div>
        </div>
      )}

      {selectedUser && (
        <>
          {renderHorarioTabla()}
          {renderHorariosList()}
        </>
      )}

      {!selectedUser && (
        <div className="text-center py-8">
          <p className="text-gray-500">Selecciona un usuario para ver y gestionar sus horarios</p>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
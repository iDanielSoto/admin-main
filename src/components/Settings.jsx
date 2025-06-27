import React from 'react';

const Settings = ({ settings, onUpdateSettings, hasPermission }) => {
  const canModifySettings = hasPermission('Administrador');

  const handleToggleModule = (moduleName) => {
    const currentModules = settings.disabledModules || [];
    const isDisabled = currentModules.includes(moduleName);
    
    if (isDisabled) {
      const updatedModules = currentModules.filter(module => module !== moduleName);
      onUpdateSettings('disabledModules', updatedModules);
    } else {
      const updatedModules = [...currentModules, moduleName];
      onUpdateSettings('disabledModules', updatedModules);
    }
  };

  const availableModules = [
    { key: 'employees', name: 'Empleados', description: 'Gestión de empleados' },
    { key: 'roles', name: 'Roles', description: 'Gestión de roles' },
    { key: 'permissions', name: 'Permisos', description: 'Gestión de permisos' },
    { key: 'departments', name: 'Departamentos', description: 'Gestión de departamentos' },
    { key: 'mapa', name: 'Mapa', description: 'Visualización de áreas' },
    { key: 'logs', name: 'Registros', description: 'Historial de actividad' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Configuración del Sistema</h2>
      
      <div className="space-y-6">
        {/* Configuración de la Empresa */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Información de la Empresa</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre de la Empresa</label>
              <input
                type="text"
                value={settings.companyName || ''}
                onChange={(e) => onUpdateSettings('companyName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!canModifySettings}
                placeholder="Nombre de tu empresa"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Logo de la Empresa (URL)</label>
              <input
                type="url"
                value={settings.companyLogo || ''}
                onChange={(e) => onUpdateSettings('companyLogo', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!canModifySettings}
                placeholder="https://ejemplo.com/logo.png"
              />
              {settings.companyLogo && (
                <div className="mt-2">
                  <img 
                    src={settings.companyLogo} 
                    alt="Logo de la empresa" 
                    className="w-20 h-20 object-contain border border-gray-200 rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Configuración del Sistema */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Configuración General</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Idioma</label>
              <select
                value={settings.language || 'es'}
                onChange={(e) => onUpdateSettings('language', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!canModifySettings}
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications || false}
                onChange={(e) => onUpdateSettings('notifications', e.target.checked)}
                className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                disabled={!canModifySettings}
              />
              <label htmlFor="notifications" className="text-gray-700">Recibir Notificaciones</label>
            </div>
          </div>
        </div>

        {/* Gestión de Módulos */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Gestión de Módulos</h3>
          <p className="text-gray-600 mb-4">Habilita o deshabilita módulos del sistema según sea necesario.</p>
          
          <div className="space-y-3">
            {availableModules.map((module) => {
              const isDisabled = settings.disabledModules?.includes(module.key) || false;
              return (
                <div key={module.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-700">{module.name}</h4>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm mr-3 ${isDisabled ? 'text-red-500' : 'text-green-500'}`}>
                      {isDisabled ? 'Deshabilitado' : 'Habilitado'}
                    </span>
                    <button
                      onClick={() => handleToggleModule(module.key)}
                      disabled={!canModifySettings}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !canModifySettings 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isDisabled
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {isDisabled ? 'Habilitar' : 'Deshabilitar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!canModifySettings && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">⚠️ No tienes permiso para modificar la configuración.</p>
          <p className="text-red-500 text-sm mt-1">Solo los administradores pueden realizar cambios en esta sección.</p>
        </div>
      )}
    </div>
  );
};

export default Settings;
import React, { useState, useEffect } from 'react';
import ObtenerCoordenadas from './Map';
import { Map as MapIcon, Home, Users, Settings as SettingsIcon, LogOut, UserPlus, SquareUser, LayoutGrid, ShieldCheck, PlusCircle, Trash2, Building2, Clock, User as UserIcon } from 'lucide-react';
import DepartmentsPage from './Dept';
import LogsPage from './Logs';
import Login from './Login';
import EmpleadosPage from './Empleados'; 
import GestionarRoles from './GestionarRoles';
import GestionarPermisos from './GestionarPermisos';
import Settings from './Settings';

const Sidebar = ({ activeTab, setActiveTab, onLogout, currentUser, disabledModules = [] }) => { 
  const sidebarItems = [
    { icon: <Home />, tab: 'dashboard', alwaysVisible: true },
    { icon: <Users />, tab: 'employees' },
    { icon: <SquareUser />, tab: 'roles' },
    { icon: <ShieldCheck />, tab: 'permissions' },
    { icon: <LayoutGrid />, tab: 'departments' },
    { icon: <MapIcon />, tab: 'mapa' },
    { icon: <Clock />, tab: 'logs' },
    { icon: <SettingsIcon />, tab: 'settings', alwaysVisible: true },
  ];
  const visibleItems = sidebarItems.filter(item => 
    item.alwaysVisible || !disabledModules.includes(item.tab)
  );
  
  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-[#1E293B] text-white flex flex-col items-center py-4 space-y-4">
      {/* User Profile Picture in Sidebar */}
      {currentUser && (
        <div className="mb-4">
          {currentUser.imageUrl ? (
            <img src={currentUser.imageUrl} alt="User Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white" />
          ) : (
            <UserIcon className="w-12 h-12 text-gray-300 bg-gray-600 rounded-full p-2" />
          )}
        </div>
      )}

      {visibleItems.map((item, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(item.tab)}
          className={`
            p-3 rounded transition-colors duration-200
            ${activeTab === item.tab
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-700 text-gray-300'
            }
          `}
        >
          {item.icon}
        </button>
      ))}

      <div className="mt-auto">
        <button onClick={onLogout} className="text-gray-300 hover:bg-gray-700 p-3 rounded">
          <LogOut />
        </button>
      </div>
    </div>
  );
};

const WelcomeDashboard = ({ currentUser, settings }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
      {/* Contenido principal */}
      <div className="relative z-10 text-center w-full max-w-4xl px-8">
        {/* Logo de la empresa con tamaño fijo */}
        {settings.companyLogo && (
          <div className="mb-8 flex justify-center">
            <div className="w-48 h-48 rounded-full overflow-hidden bg-white shadow-lg border-4 border-gray-200 flex items-center justify-center">
              <img 
                src={settings.companyLogo} 
                alt="Logo de la empresa" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
        
        {/* Nombre de la empresa */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 drop-shadow-sm">
          {settings.companyName || 'Mi Empresa'}
        </h1>
        
        {/* Mensaje de bienvenida */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 mb-4 font-light">
          Bienvenido al Dashboard Administrativo
        </h2>
        
        {/* Nombre del usuario */}
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-blue-600 mb-8">
          {currentUser?.name || 'Usuario'}
        </p>
        
        {/* Información adicional */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 max-w-2xl mx-auto border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center sm:text-left">
              <p className="text-gray-500 text-sm sm:text-base mb-1">Rol</p>
              <p className="font-semibold text-gray-800 text-lg sm:text-xl">
                {currentUser?.role || 'Sin asignar'}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-500 text-sm sm:text-base mb-1">Departamento</p>
              <p className="font-semibold text-gray-800 text-lg sm:text-xl">
                {currentUser?.department || 'Sin asignar'}
              </p>
            </div>
          </div>
          
          {/* Fecha y hora actual */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            {/* Reloj sin animación */}
            <div className="flex justify-center mb-4">
              <Clock className="w-12 h-12 text-blue-600" />
            </div>
            
            {/* Fecha */}
            <p className="text-gray-500 text-sm">
              {currentTime.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            
            {/* Hora */}
            <p className="text-gray-600 font-medium mt-1 text-xl">
              {currentTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Jesus Daniel Soto', email: 'soto@gmail.com', role: 'Supervisor', department: 'Operaciones', password: '12345', imageUrl: '' },
    { id: 2, name: 'Edgar Yahir SS', email: 'misterxxzx@gmail.com', role: 'Administrador', department: 'Tecnología', password: 'Yristan', imageUrl: 'https://cdn.discordapp.com/attachments/1365377054455103508/1384779752589492275/StellarPlace.jpg?ex=685f89a4&is=685e3824&hm=c72c7aecdf20fa1b1ea0d7cf96543e123dcff7037efe0f07188593491f084efe&' },
  ]);
  const [roles, setRoles] = useState([
    { id: 1, name: 'Lectura', description: 'Solo puede ver información', permissions: [1] },
    { id: 2, name: 'Escritura', description: 'Puede modificar información', permissions: [1, 2] },
    { id: 3, name: 'Administrador', description: 'Control total del sistema', permissions: [1, 2, 3] }
  ]);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Ventas', description: 'Departamento de ventas y marketing', coordinates: [[18.025767, -102.207978], [18.025864, -102.206755], [18.025007, -102.206336], [18.025404, -102.206905]], color: '#FF0000', fillColor: '#FFAAAA' },
    { id: 2, name: 'Tecnología', description: 'Desarrollo e infraestructura tecnológica', coordinates: [[18.024500, -102.207000], [18.024600, -102.206000], [18.023800, -102.205600], [18.023900, -102.206600]], color: '#0000FF', fillColor: '#AAAAFF' },
  ]);
  const [settings, setSettings] = useState({
    companyName: 'Mi Empresa',
    companyLogo: '',
    notifications: true,
    language: 'es',
    disabledModules: []
  });
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [permissions, setPermissions] = useState([
    { id: 1, name: 'Lectura', description: 'Permite la vista de todos los componentes, no tiene permiso a modificar nada.', category: 'Vista' },
    { id: 2, name: 'Jefe Area de Sistemas', description: 'Permite modificar y ver la información de tu departamento', category: 'Departamentos' },
    { id: 3, name: 'Administrador', description: 'Permite modificar configuraciones del sistema', category: 'General' }
  ]);
  useEffect(() => {
    if (currentUser && isLoggedIn) {
      const updatedUser = employees.find(emp => emp.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      } else {
        handleLogout();
        alert('Tu cuenta ha sido eliminada. Has sido desconectado automáticamente.');
      }
    }
  }, [employees]);

  const handleLoginSuccess = (userCredentials) => {
    const user = employees.find(
      (emp) => emp.email === userCredentials.email && emp.password === userCredentials.password
    );
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      addLogEntry('Inicio de Sesión', 'Usuario', user.name, 'Usuario ha iniciado sesión.');
    } else {
      console.error('Login failed: Invalid credentials or user not found.');
    }
  };

  const handleRegisterSuccess = (newUserData) => {
    if (employees.some(emp => emp.email === newUserData.email)) {
      alert('El email ya está registrado. Por favor, usa otro.');
      return;
    }

    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const newUserWithId = { id: newId, department: '', ...newUserData };
    setEmployees(prevEmployees => [...prevEmployees, newUserWithId]);
    setCurrentUser(newUserWithId);
    setIsLoggedIn(true);
    addLogEntry('Registro', 'Usuario', newUserWithId.name, `Nuevo usuario registrado: ${newUserWithId.name}`);
  };

  const handleLogout = () => {
    if (currentUser) {
      addLogEntry('Cierre de Sesión', 'Usuario', currentUser.name, 'Usuario ha cerrado sesión.');
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('dashboard'); 
  };

  const addLogEntry = (actionType, targetType, targetName, description, user = currentUser?.name || 'Invitado') => {
    const newLog = {
      timestamp: Date.now(),
      actionType,
      targetType,
      targetName,
      description,
      user,
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const hasPermission = (permissionName) => {
    if (!currentUser) return false;
    const userRole = roles.find(r => r.name === currentUser.role);
    if (!userRole) return false;
    if (permissionName === 'Eliminar Usuarios' && userRole.name === 'Administrador') {
        return true;
    }
    if ((permissionName === 'Escritura' || permissionName === 'Administrador') &&
        (userRole.name === 'Escritura' || userRole.name === 'Administrador')) {
        return true;
    }
    if (userRole.name === 'Administrador') {
      return true;
    }
    return false;
  };

  const handleUpdateDepartmentFromMap = (updatedDept) => {
    if (!hasPermission('Escritura') && !hasPermission('Administrador')) {
      alert('No tienes permiso para actualizar departamentos desde el mapa.');
      return;
    }
    setDepartments(prevDepartments =>
      prevDepartments.map(dept =>
        dept.id === updatedDept.id ? { ...dept, ...updatedDept } : dept
      )
    );
    addLogEntry('Modificación', 'Departamento', updatedDept.name, `Coordenadas del departamento actualizadas desde el mapa: ${updatedDept.name}`);
  };

  const handleUpdateSettings = (field, value) => {
    if (!hasPermission('Administrador')) {
      alert('No tienes permiso para modificar la configuración.');
      return;
    }
    setSettings(prev => ({ ...prev, [field]: value }));
    addLogEntry('Configuración', 'Sistema', field, `Configuración actualizada: ${field}`);
  };
  const isModuleEnabled = (moduleName) => {
    return !settings.disabledModules.includes(moduleName);
  };
  useEffect(() => {
    if (activeTab !== 'dashboard' && activeTab !== 'settings' && !isModuleEnabled(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [settings.disabledModules, activeTab]);
  const handleEmployeeDelete = (employeeId) => {
    const employeeToDelete = employees.find(emp => emp.id === employeeId);
    if (!employeeToDelete) return;
    const isSelfDelete = currentUser && currentUser.id === employeeId;
    
    if (isSelfDelete) {
      const confirmSelfDelete = window.confirm(
        '¿Estás seguro de que quieres eliminar tu propia cuenta? Esto te desconectará inmediatamente del sistema.'
      );
      if (!confirmSelfDelete) return;
    }
    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeId));
    addLogEntry('Eliminación', 'Empleado', employeeToDelete.name, 
      `Empleado eliminado: ${employeeToDelete.name}${isSelfDelete ? ' (Auto-eliminación)' : ''}`);
    if (isSelfDelete) {
      setTimeout(() => {
        alert('Has eliminado tu propia cuenta. Serás desconectado automáticamente.');
      }, 100);
    }
  };

  const renderContent = () => {
    if (activeTab !== 'dashboard' && activeTab !== 'settings' && !isModuleEnabled(activeTab)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Módulo No Disponible</h2>
            <p className="text-gray-600">Este módulo ha sido deshabilitado por el administrador.</p>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case 'mapa':
        return (
          <div className="h-full overflow-y-auto">
            <ObtenerCoordenadas
              areasDefinidas={departments.map(dept => ({
                id: dept.id,
                nombre: dept.name,
                descripcion: dept.description,
                coordenadas: dept.coordinates,
                color: dept.color || '#0000FF',
                fillColor: dept.fillColor || '#AAAAFF'
              }))}
              onUpdateDepartmentFromMap={handleUpdateDepartmentFromMap}
            />
          </div>
        );

      case 'employees':
        return (
          <EmpleadosPage
            employees={employees}
            setEmployees={setEmployees}
            departments={departments}
            roles={roles}
            addLogEntry={addLogEntry}
            hasPermission={hasPermission}
            currentUser={currentUser}
            onEmployeeDelete={handleEmployeeDelete}
          />
        );

      case 'roles':
        return (
          <GestionarRoles
            roles={roles}
            setRoles={setRoles}
            addLogEntry={addLogEntry}
            hasPermission={hasPermission}
          />
        );

      case 'permissions':
        return (
          <GestionarPermisos
            permissions={permissions}
            setPermissions={setPermissions}
            addLogEntry={addLogEntry}
            hasPermission={hasPermission}
          />
        );

      case 'departments':
        const canModifyDepartments = hasPermission('Escritura') || hasPermission('Administrador');
        return (
          <DepartmentsPage
            departments={departments}
            setDepartments={setDepartments}
            addLogEntry={addLogEntry}
            totalEmployees={employees.length}
            canModify={canModifyDepartments}
          />
        );

      case 'logs':
        return (
          <LogsPage logs={logs} />
        );

      case 'settings':
        return (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            hasPermission={hasPermission}
          />
        );

      case 'dashboard':
      default:
        return (
          <WelcomeDashboard 
            currentUser={currentUser} 
            settings={settings}
          />
        );
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} onRegisterSuccess={handleRegisterSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        currentUser={currentUser}
        disabledModules={settings.disabledModules}
      />
      <div className="flex-grow p-6 ml-20 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
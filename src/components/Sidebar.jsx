import { Home, Users, Settings, LogOut, LogIn } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-gray-800 text-white shadow-xl">
      <div className="flex flex-col items-center justify-between h-full py-4">
        {/* Iconos de navegación */}
        <button className="flex items-center justify-center space-x-3 w-full py-3 hover:bg-gray-700 rounded-md transition-all duration-200">
          <Home className="w-6 h-6" />
        </button>
        <button className="flex items-center justify-center space-x-3 w-full py-3 hover:bg-gray-700 rounded-md transition-all duration-200">
          <Users className="w-6 h-6" />
        </button>
        <button className="flex items-center justify-center space-x-3 w-full py-3 hover:bg-gray-700 rounded-md transition-all duration-200">
          <Settings className="w-6 h-6" />
        </button>
        <button className="flex items-center justify-center space-x-3 w-full py-3 hover:bg-gray-700 rounded-md transition-all duration-200">
          <LogOut className="w-6 h-6" />
        </button>
        
        {/* Botón de Iniciar sesión */}
        <button className="flex items-center justify-center space-x-3 w-full py-3 hover:bg-gray-700 rounded-md transition-all duration-200">
          <LogIn className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

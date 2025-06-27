import { BarChart2, AlertTriangle, Info } from 'lucide-react';

const GeneralInfo = ({ employeeCount }) => (
  <div className="flex flex-col h-full space-y-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <BarChart2 className="w-8 h-8 text-indigo-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Resumen</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Empleados</span>
          <span className="font-bold text-indigo-600">{employeeCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Faltas</span>
          <span className="font-bold text-indigo-600">0</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Alertas</h2>
      </div>
      <div className="bg-yellow-50 p-2 rounded flex items-center">
        <span className="mr-2 text-yellow-600">•</span>
        Sin alertas importantes
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex-1 flex flex-col">
      <div className="flex items-center mb-4">
        <Info className="w-8 h-8 text-gray-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Registros</h2>
      </div>
      <div className="bg-gray-200 p-2 rounded flex items-center">
          <span className="mr-2 text-gray-600">•</span>
        Sin actividad
      </div>
    </div>
  </div>
);

export default GeneralInfo;

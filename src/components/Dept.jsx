import React, { useState, useEffect } from 'react';
import ObtenerCoordenadas from './Map';
import { renderMiniMap } from './Map';
import { 
  Plus, 
  Camera, 
  Wifi, 
  Fingerprint, 
  Monitor, 
  Speaker, 
  Mic, 
  Server,
  Edit3, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Eye
} from 'lucide-react';

const DepartmentsPage = ({ departments, setDepartments, addLogEntry }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);

  const deviceTypes = [
    { type: 'webcam', icon: Camera, label: 'Cámara Web' },
    { type: 'microphone', icon: Mic, label: 'Micrófono' },
    { type: 'speaker', icon: Speaker, label: 'Altavoz' },
    { type: 'fingerprint', icon: Fingerprint, label: 'Lector de Huella' },
    { type: 'server', icon: Server, label: 'Servidor' },
    { type: 'monitor', icon: Monitor, label: 'Monitor' },
    { type: 'network', icon: Wifi, label: 'Dispositivo de Red' }
  ];

  const getDeviceIcon = (type) => {
    const deviceType = deviceTypes.find(dt => dt.type === type);
    return deviceType ? deviceType.icon : Monitor;
  };

  // Render mini mapa al cambiar el departamento seleccionado
  useEffect(() => {
    if (selectedDepartment?.coordinates) {
      renderMiniMap(
        'mini-map',
        selectedDepartment.coordinates,
        selectedDepartment.color,
        selectedDepartment.fillColor
      );
    }
  }, [selectedDepartment]);

  // Verificar disponibilidad de dispositivos
  useEffect(() => {
    if (!selectedDepartment?.devices) return;

    const checkDeviceAvailability = async () => {
      const updatedDevices = [...selectedDepartment.devices];
      let hasChanges = false;

      for (let device of updatedDevices) {
        let isAvailable = false;
        
        try {
          if (device.type === 'webcam' || device.type === 'microphone' || device.type === 'speaker') {
            const devices = await navigator.mediaDevices.enumerateDevices();
            isAvailable = devices.some(d => d.deviceId === device.deviceId);
          } else {
            isAvailable = Math.random() > 0.2; // 80% probabilidad de estar conectado
          }
        } catch (error) {
          isAvailable = false;
        }

        const newStatus = isAvailable ? 'connected' : 'disconnected';
        if (device.status !== newStatus) {
          device.status = newStatus;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        const updatedDepartments = departments.map(d =>
          d.id === selectedDepartment.id ? { ...d, devices: updatedDevices } : d
        );
        setDepartments(updatedDepartments);
        setSelectedDepartment(prev => ({ ...prev, devices: updatedDevices }));
      }
    };

    const interval = setInterval(checkDeviceAvailability, 3000);
    return () => clearInterval(interval);
  }, [selectedDepartment, departments, setDepartments]);

  // Escanear dispositivos cuando se abre el gestor
  useEffect(() => {
    if (showDeviceManager && !isScanning) {
      scanForDevices();
    }
  }, [showDeviceManager]);

  // Configurar stream de webcam
  useEffect(() => {
    if (webcamStream && showWebcamModal) {
      const video = document.getElementById('webcam-preview');
      if (video) {
        video.srcObject = webcamStream;
      }
    }
  }, [webcamStream, showWebcamModal]);

  const handleAddDepartmentFromMap = (newDept) => {
    const newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
    const departmentToAdd = { id: newId, ...newDept };
    setDepartments([...departments, departmentToAdd]);
    addLogEntry('Registro', 'Departamento', newDept.name, `Departamento creado desde mapa con ID ${newId}`);
    setIsDrawingMode(false);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm('¿Seguro que deseas eliminar este departamento?');
    if (!confirm) return;
    const updated = departments.filter(d => d.id !== id);
    const name = departments.find(d => d.id === id)?.name || 'Desconocido';
    setDepartments(updated);
    addLogEntry('Eliminación', 'Departamento', name, `Departamento eliminado`);
    setSelectedDepartment(null);
    setShowDetails(false);
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    setAvailableDevices([]);
    
    try {
      // Detectar cámaras web
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        cameras.forEach((camera, index) => {
          setAvailableDevices(prev => [...prev, {
            type: 'webcam',
            name: camera.label || `Webcam ${index + 1}`,
            deviceId: camera.deviceId,
            status: 'detected'
          }]);
        });
      } catch (error) {
        console.log('No se pudieron detectar cámaras web:', error);
      }

      // Detectar micrófonos
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter(device => device.kind === 'audioinput');
        mics.forEach((mic, index) => {
          setAvailableDevices(prev => [...prev, {
            type: 'microphone',
            name: mic.label || `Micrófono ${index + 1}`,
            deviceId: mic.deviceId,
            status: 'detected'
          }]);
        });
      } catch (error) {
        console.log('No se pudieron detectar micrófonos:', error);
      }

      // Detectar altavoces
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const speakers = devices.filter(device => device.kind === 'audiooutput');
        speakers.forEach((speaker, index) => {
          setAvailableDevices(prev => [...prev, {
            type: 'speaker',
            name: speaker.label || `Altavoz ${index + 1}`,
            deviceId: speaker.deviceId,
            status: 'detected'
          }]);
        });
      } catch (error) {
        console.log('No se pudieron detectar altavoces:', error);
      }

      // Simular otros dispositivos
      setTimeout(() => {
        const otherDevices = [
          { type: 'server', name: 'Servidor Local (192.168.1.100)' },
          { type: 'fingerprint', name: 'Lector de Huella Digital' },
          { type: 'network', name: 'Router Principal' },
          { type: 'monitor', name: 'Monitor Principal' }
        ];
        
        otherDevices.forEach(device => {
          if (Math.random() > 0.3) {
            setAvailableDevices(prev => [...prev, {
              ...device,
              status: 'detected'
            }]);
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Error durante el escaneo:', error);
    }
    
    setIsScanning(false);
  };

  const addDevice = (device) => {
    const deviceName = prompt('Nombre para el dispositivo:', device.name);
    if (deviceName && deviceName.trim()) {
      const newDevice = {
        id: Date.now() + Math.random(), // ID más único para evitar conflictos
        type: device.type,
        name: deviceName.trim(),
        status: 'connected',
        priority: (selectedDepartment.devices?.length || 0) + 1,
        deviceId: device.deviceId || `device_${Date.now()}`
      };

      // Actualizar estado de forma más controlada
      setSelectedDepartment(prev => {
        const updatedDevices = [...(prev.devices || []), newDevice];
        const updatedDept = { ...prev, devices: updatedDevices };
        
        // Actualizar departments también
        setDepartments(prevDepts => 
          prevDepts.map(d => d.id === prev.id ? updatedDept : d)
        );
        
        return updatedDept;
      });
      
      // Remover de dispositivos disponibles
      setAvailableDevices(prev => prev.filter(d => d !== device));
      
      // Agregar log
      if (addLogEntry) {
        addLogEntry('Registro', 'Dispositivo', deviceName.trim(), `Dispositivo añadido al departamento ${selectedDepartment.name}`);
      }
    }
  };

  const removeDevice = (deviceId) => {
    const deviceName = selectedDepartment.devices.find(d => d.id === deviceId)?.name;
    
    setSelectedDepartment(prev => {
      const updatedDevices = prev.devices.filter(d => d.id !== deviceId);
      const updatedDept = { ...prev, devices: updatedDevices };
      
      // Actualizar departments también
      setDepartments(prevDepts => 
        prevDepts.map(d => d.id === prev.id ? updatedDept : d)
      );
      
      return updatedDept;
    });
    
    if (addLogEntry && deviceName) {
      addLogEntry('Eliminación', 'Dispositivo', deviceName, `Dispositivo eliminado del departamento ${selectedDepartment.name}`);
    }
  };

  const updateDevicePriority = (deviceId, direction) => {
    setSelectedDepartment(prev => {
      const devices = [...prev.devices];
      const deviceIndex = devices.findIndex(d => d.id === deviceId);
      
      if (deviceIndex === -1) return prev;

      const newIndex = direction === 'up' ? deviceIndex - 1 : deviceIndex + 1;
      
      if (newIndex >= 0 && newIndex < devices.length) {
        [devices[deviceIndex], devices[newIndex]] = [devices[newIndex], devices[deviceIndex]];
        
        devices.forEach((device, index) => {
          device.priority = index + 1;
        });

        const updatedDept = { ...prev, devices };
        
        // Actualizar departments también
        setDepartments(prevDepts => 
          prevDepts.map(d => d.id === prev.id ? updatedDept : d)
        );
        
        return updatedDept;
      }
      
      return prev;
    });
  };

  const updateDevice = (deviceId, field, value) => {
    setSelectedDepartment(prev => {
      const updatedDevices = prev.devices.map(d =>
        d.id === deviceId ? { ...d, [field]: value } : d
      );
      const updatedDept = { ...prev, devices: updatedDevices };
      
      // Actualizar departments también
      setDepartments(prevDepts => 
        prevDepts.map(d => d.id === prev.id ? updatedDept : d)
      );
      
      return updatedDept;
    });
    
    if (addLogEntry) {
      addLogEntry('Modificación', 'Dispositivo', value, `Dispositivo modificado en ${selectedDepartment.name}`);
    }
  };

  const openWebcam = async (device) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: device.deviceId }
      });
      setWebcamStream(stream);
      setShowWebcamModal(true);
    } catch (error) {
      alert('No se pudo acceder a la cámara web. Verifique los permisos.');
    }
  };

  const closeWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setShowWebcamModal(false);
  };

  const handleDeviceChange = (deptId, newDevices) => {
    const updated = departments.map(d =>
      d.id === deptId ? { ...d, devices: newDevices } : d
    );
    setDepartments(updated);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-700">Departamentos</h1>
        <button
          onClick={() => setIsDrawingMode(!isDrawingMode)}
          className={`px-4 py-2 rounded-lg text-white ${isDrawingMode ? 'bg-red-500' : 'bg-blue-500'} hover:opacity-90`}
        >
          {isDrawingMode ? 'Cancelar Dibujo' : 'Agregar por Mapa'}
        </button>
      </div>

      {isDrawingMode && (
        <ObtenerCoordenadas
          areasDefinidas={departments.map(d => ({
            id: d.id,
            nombre: d.name,
            descripcion: d.description,
            coordenadas: d.coordinates,
            color: d.color,
            fillColor: d.fillColor
          }))}
          onUpdateDepartmentFromMap={handleAddDepartmentFromMap}
        />
      )}

      <div className="grid grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg text-gray-800">{d.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{d.description}</p>
            <p className="text-xs text-gray-400">
              {d.coordinates?.length || 0} coordenadas | {d.devices?.length || 0} dispositivos
            </p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => {
                  setSelectedDepartment(d);
                  setShowDetails(true);
                }}
                className="text-blue-500 hover:underline text-sm"
              >
                Ver Detalles
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDetails && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedDepartment.name}</h3>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setShowDeviceManager(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mb-4">{selectedDepartment.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Área en el mapa:</h4>
              <div className="h-60 w-full rounded border overflow-hidden" id="mini-map"></div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-600">Dispositivos:</h4>
                <button
                  onClick={() => {
                    setShowDeviceManager(!showDeviceManager);
                    if (!showDeviceManager && !isScanning) {
                      scanForDevices();
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                    showDeviceManager 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {showDeviceManager ? <X size={16} /> : <Plus size={16} />}
                  {showDeviceManager ? 'Cerrar' : 'Añadir'}
                </button>
              </div>

              {showDeviceManager && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-semibold text-gray-700">Dispositivos disponibles:</h5>
                    <button
                      onClick={scanForDevices}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                      disabled={isScanning}
                    >
                      {isScanning ? 'Escaneando...' : 'Escanear'}
                    </button>
                  </div>

                  {isScanning ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Buscando dispositivos...</p>
                    </div>
                  ) : availableDevices.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      No se detectaron dispositivos.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableDevices.map((device, index) => {
                        const DeviceIcon = getDeviceIcon(device.type);
                        return (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                            <div className="flex items-center gap-2">
                              <DeviceIcon size={16} className="text-green-500" />
                              <span className="text-sm">{device.name}</span>
                            </div>
                            <button
                              onClick={() => addDevice(device)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              Añadir
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {!selectedDepartment.devices || selectedDepartment.devices.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Monitor size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No hay dispositivos registrados</p>
                  </div>
                ) : (
                  selectedDepartment.devices
                    .sort((a, b) => a.priority - b.priority)
                    .map((device) => {
                      const DeviceIcon = getDeviceIcon(device.type);
                      return (
                        <div key={device.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                          <div className="flex items-center gap-3">
                            <DeviceIcon size={20} className="text-blue-500" />
                            <div>
                              {editingDevice === device.id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    defaultValue={device.name}
                                    className="border rounded px-2 py-1 text-sm w-32"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        updateDevice(device.id, 'name', e.target.value);
                                        setEditingDevice(null);
                                      } else if (e.key === 'Escape') {
                                        setEditingDevice(null);
                                      }
                                    }}
                                    onBlur={(e) => {
                                      updateDevice(device.id, 'name', e.target.value);
                                      setEditingDevice(null);
                                    }}
                                    autoFocus
                                  />
                                  <select
                                    defaultValue={device.type}
                                    className="border rounded px-1 py-1 text-sm"
                                    onChange={(e) => updateDevice(device.id, 'type', e.target.value)}
                                  >
                                    {deviceTypes.map(type => (
                                      <option key={type.type} value={type.type}>{type.label}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <>
                                  <h5 className="font-medium text-gray-800 text-sm">{device.name}</h5>
                                  <p className="text-xs text-gray-500">
                                    <span className={device.status === 'connected' ? 'text-green-600' : 'text-red-600'}>
                                      {device.status === 'connected' ? '🟢 Conectado' : '🔴 Desconectado'}
                                    </span>
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {device.type === 'webcam' && (
                              <button
                                onClick={() => openWebcam(device)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                title="Ver cámara"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => setEditingDevice(editingDevice === device.id ? null : device.id)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Modificar"
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              onClick={() => removeDevice(device.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Eliminar"
                            >
                              <X size={16} />
                            </button>

                            <div className="flex flex-col">
                              <button
                                onClick={() => updateDevicePriority(device.id, 'up')}
                                className="p-0.5 text-gray-600 hover:bg-gray-200 rounded"
                                title="Subir"
                                disabled={device.priority === 1}
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                onClick={() => updateDevicePriority(device.id, 'down')}
                                className="p-0.5 text-gray-600 hover:bg-gray-200 rounded"
                                title="Bajar"
                                disabled={device.priority === selectedDepartment.devices.length}
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Webcam */}
      {showWebcamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Vista de Cámara Web</h3>
              <button
                onClick={closeWebcam}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                id="webcam-preview"
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Vista en tiempo real de la cámara web seleccionada
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
import { useState, useEffect, useRef } from 'react';
import { Map, UserPlus, MapPin, Navigation, Users } from 'lucide-react';

const ObtenerCoordenadas = ({ areasDefinidas, onUpdateDepartmentFromMap }) => { 
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isInAllowedZone, setIsInAllowedZone] = useState(false);
  const [showRegistroForm, setShowRegistroForm] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [formData, setFormData] = useState({ nombre: ''});
  const [watchId, setWatchId] = useState(null);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const polygonLayersRef = useRef({}); 
  const isPointInPolygon = (point, polygon) => {
    const x = point[0]; // lat
    const y = point[1]; // lng
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  };

  const findAreaForPoint = (point) => {
    for (let area of areasDefinidas) {
      if (area.coordenadas && area.coordenadas.length > 0 && isPointInPolygon(point, area.coordenadas)) {
        return area;
      }
    }
    return null;
  };
  const handleMapClick = (e) => {
    const coords = [e.latlng.lat, e.latlng.lng];
    setClickedCoordinates(coords);

    if (mapInstanceRef.current && window.L) {
      if (clickMarkerRef.current) {
        mapInstanceRef.current.removeLayer(clickMarkerRef.current);
      }
      const area = findAreaForPoint(coords);
      let popupContent = '';
      let markerColor = 'purple';

      if (area) {
        markerColor = area.color || 'blue'; 
        popupContent = `
          <div style="text-align: left; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; color: ${markerColor}; font-size: 16px;">${area.nombre}</h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.4;">${area.descripcion}</p>
            <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
            <small style="color: #666;">
              📍 Coordenadas: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}
            </small>
          </div>
        `;
      } else {
        popupContent = `
          <div style="text-align: center;">
            <b>📍 Punto seleccionado</b><br>
            <span style="color: purple; font-weight: bold;">Fuera de áreas definidas</span><br>
            <small>Lat: ${coords[0].toFixed(6)}</small><br>
            <small>Lng: ${coords[1].toFixed(6)}</small>
          </div>
        `;
      }
      clickMarkerRef.current = window.L.marker(coords, {
        icon: window.L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px ${markerColor};"></div>`,
          iconSize: [18, 18],
          className: 'click-marker'
        })
      }).addTo(mapInstanceRef.current);

      clickMarkerRef.current.bindPopup(popupContent, {
        maxWidth: 350,
        className: 'custom-popup'
      }).openPopup();
    }
  };

  // Función para obtener ubicación actual
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no está soportada en este navegador');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setCurrentLocation(coords);
        setLocationError(null);
        const area = findAreaForPoint(coords);
        setIsInAllowedZone(!!area);

        updateLocationOnMap(coords, area);
      },
      (error) => {
        let errorMessage = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado para obtener ubicación.';
            break;
          default:
            errorMessage = 'Error desconocido al obtener ubicación.';
            break;
        }
        setLocationError(errorMessage);
      },
      options
    );
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setCurrentLocation(coords);

        const area = findAreaForPoint(coords);
        setIsInAllowedZone(!!area);

        updateLocationOnMap(coords, area);
      },
      (error) => {
        console.log('Error en watchPosition:', error);
      },
      options
    );

    setWatchId(id);
  };

  const updateLocationOnMap = (coords, area) => {
    if (mapInstanceRef.current && window.L) {
      if (currentLocationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(currentLocationMarkerRef.current);
      }
      const markerColor = area ? 'green' : 'red';
      const statusText = area ? `Dentro de: ${area.nombre}` : 'Fuera de áreas definidas';
      currentLocationMarkerRef.current = window.L.marker(coords, {
        icon: window.L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px ${markerColor};"></div>`,
          iconSize: [16, 16],
          className: 'current-location-marker'
        })
      }).addTo(mapInstanceRef.current);

      let popupContent = `
        <div style="text-align: center;">
          <b>📱 Tu ubicación actual</b><br>
          <span style="color: ${markerColor}; font-weight: bold;">${statusText}</span><br>
          <small>[${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}]</small>
      `;
      if (area) {
        popupContent += `<br><small style="color: #666;">${area.descripcion}</small>`;
      }
      popupContent += `</div>`;
      currentLocationMarkerRef.current.bindPopup(popupContent);
      if (!mapInstanceRef.current._centered) {
        mapInstanceRef.current.setView(coords, 17);
        mapInstanceRef.current._centered = true;
      }
    }
  };
  useEffect(() => {
    const checkLeaflet = () => {
      if (typeof window !== 'undefined' && window.L) {
        setLeafletLoaded(true);
        return true;
      }
      return false;
    };

    const loadLeaflet = () => {
      if (!checkLeaflet()) {
        const linkElem = document.createElement('link');
        linkElem.rel = 'stylesheet';
        linkElem.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.css';
        document.head.appendChild(linkElem);

        const scriptElem = document.createElement('script');
        scriptElem.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.js';
        scriptElem.onload = () => {
          setLeafletLoaded(true);
          initializeMap();
        };
        document.body.appendChild(scriptElem);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapInstanceRef.current && mapRef.current && typeof window !== 'undefined' && window.L) {
        mapInstanceRef.current = window.L.map(mapRef.current).setView([18.0254, -102.2070], 16);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);
        mapInstanceRef.current.on('click', handleMapClick);
        getCurrentLocation();
      }
    };
    
    // Solo agregar el estilo una vez
    let existingStyle = document.querySelector('#custom-popup-styles');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'custom-popup-styles';
      style.textContent = `
        .custom-popup .leaflet-popup-content {
          margin: 8px 12px;
          line-height: 1.4;
        }
        .custom-popup .leaflet-popup-content h3 {
          margin-top: 0;
        }
      `;
      document.head.appendChild(style);
    }

    loadLeaflet();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', handleMapClick); 
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); 
  const isValidCoordinate = (coord) => {
    return Array.isArray(coord) && 
           coord.length === 2 && 
           typeof coord[0] === 'number' && 
           typeof coord[1] === 'number' &&
           !isNaN(coord[0]) && 
           !isNaN(coord[1]) &&
           isFinite(coord[0]) && 
           isFinite(coord[1]);
  };
  const isValidCoordinatesArray = (coords) => {
    return Array.isArray(coords) && 
           coords.length > 0 && 
           coords.every(coord => isValidCoordinate(coord));
  };
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !window.L) return;
    Object.values(polygonLayersRef.current).forEach(layer => {
      if (mapInstanceRef.current.hasLayer(layer)) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
    polygonLayersRef.current = {}; 
    if (!Array.isArray(areasDefinidas) || areasDefinidas.length === 0) {
      return;
    }
    const validAreas = [];
    areasDefinidas.forEach(area => {
      if (!area || typeof area !== 'object') return;
      if (area.coordenadas && isValidCoordinatesArray(area.coordenadas)) {
        try {
          const polygon = window.L.polygon(area.coordenadas, {
            color: area.color || 'blue',
            fillColor: area.fillColor || 'lightblue',
            fillOpacity: 0.4,
            weight: 3
          }).addTo(mapInstanceRef.current);

          polygon.bindPopup(`
            <div style="text-align: left;">
              <h3 style="margin: 0 0 8px 0; color: ${area.color || 'blue'};">${area.nombre || 'Área sin nombre'}</h3>
              <p style="margin: 0; font-size: 14px;">${area.descripcion || 'Sin descripción'}</p>
            </div>
          `);
          
          polygonLayersRef.current[area.id || Math.random()] = polygon;
          validAreas.push(area);
        } catch (error) {
          console.warn('Error al crear polígono para área:', area.nombre, error);
        }
      }
    });
    if (validAreas.length > 0) {
      try {
        const allCoords = [];
        validAreas.forEach(area => {
          if (area.coordenadas && isValidCoordinatesArray(area.coordenadas)) {
            allCoords.push(...area.coordenadas);
          }
        });
        if (allCoords.length > 0) {
          const bounds = new window.L.LatLngBounds(allCoords);
          if (bounds.isValid()) {
            mapInstanceRef.current.fitBounds(bounds, { 
              padding: [50, 50],
              maxZoom: 18 
            });
          }
        }
      } catch (error) {
        console.warn('Error al ajustar vista del mapa:', error);
        // Fallback: mantener vista por defecto
        mapInstanceRef.current.setView([18.0254, -102.2070], 16);
      }
    }

  }, [areasDefinidas, leafletLoaded]); 

  const handleRegistro = () => {
    if (!currentLocation) {
      alert('No se pudo obtener tu ubicación actual. Por favor activa la geolocalización.');
      return;
    }

    if (!isInAllowedZone) {
      alert('⚠️ No puedes registrarte desde tu ubicación actual. Debes estar físicamente dentro de alguna de las áreas definidas.');
      return;
    }

    setShowRegistroForm(true);
  };

  const submitRegistro = () => {
    if (!formData.nombre) {
      alert('Por favor completa todos los campos');
      return;
    }

    const area = findAreaForPoint(currentLocation);

    const userData = {
      nombre: formData.nombre,
      coordenadas: currentLocation,
      area: area ? area.nombre : 'Área no definida',
      timestamp: new Date().toISOString()
    };
    setRegisteredUsers(prev => [...prev, userData]);
    if (mapInstanceRef.current && window.L) {
      const marker = window.L.marker(currentLocation, {
        icon: window.L.divIcon({
          html: '<div style="background-color: darkblue; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [20, 20],
          className: 'user-registered-marker'
        })
      }).addTo(mapInstanceRef.current);

      marker.bindPopup(`
        <div style="text-align: center;">
          <b>👤 ${userData.nombre}</b><br>
          <span style="color: #666;">Área: ${userData.area}</span><br>
          <small>Registrado: ${new Date(userData.timestamp).toLocaleString()} |
          <button onclick="navigator.clipboard.writeText('[${userData.coordenadas[0].toFixed(6)}, ${userData.coordenadas[1].toFixed(6)}]'); alert('Coordenadas copiadas!');"
                  style="background: none; border: none; color: #007bff; text-decoration: underline; cursor: pointer; padding: 0;">
            Copiar Coords
          </button>
          </span>
        </div>
      `);
    }
    setShowRegistroForm(false);
    setFormData({ nombre: ''});

    alert(`¡Registro exitoso! Bienvenido ${userData.nombre} desde ${area ? area.nombre : 'área no definida'}`);
  };

  const copyToClipboard = (coords) => {
    const coordsText = `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
    navigator.clipboard.writeText(coordsText).then(() => {
      alert('Coordenadas copiadas al portapapeles: ' + coordsText);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Map className="w-5 h-5 mr-2" />
        Definición de Áreas de Departamentos
      </h2>

      {typeof window !== 'undefined' && !window.L && !leafletLoaded && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Cargando la biblioteca. Por favor espere...</p>
        </div>
      )}

      {/* Estado de ubicación */}
      <div className="mb-4 p-4 border rounded-lg">
        <h3 className="font-semibold flex items-center mb-2">
          <Navigation className="w-4 h-4 mr-2" />
          Estado de Ubicación
        </h3>

        {locationError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-2">
            <p>{locationError}</p>
            <button
              onClick={getCurrentLocation}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {currentLocation && (
          <div className={`p-3 rounded ${isInAllowedZone ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold">
              {isInAllowedZone ?
                `✓ Estás dentro de: ${findAreaForPoint(currentLocation)?.nombre || 'Área definida'}` :
                '✗ Estás fuera de las áreas definidas'}
            </p>
            <p className="text-sm mt-1">
              Ubicación actual: [{currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}]
              <button
                onClick={() => copyToClipboard(currentLocation)}
                className="ml-2 text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Copiar
              </button>
            </p>
          </div>
        )}

        {clickedCoordinates && (
          <div className="mt-2 p-3 bg-purple-100 text-purple-800 rounded">
            <p className="font-semibold">📍 Información del punto seleccionado</p>
            {findAreaForPoint(clickedCoordinates) ? (
              <div className="mt-1">
                <p className="font-medium">{findAreaForPoint(clickedCoordinates).nombre}</p>
                <p className="text-sm">{findAreaForPoint(clickedCoordinates).descripcion}</p>
              </div>
            ) : (
              <p className="text-sm mt-1">Punto fuera de áreas definidas</p>
            )}
            <p className="text-sm mt-1">
              Coordenadas: [{clickedCoordinates[0].toFixed(6)}, {clickedCoordinates[1].toFixed(6)}]
              <button
                onClick={() => copyToClipboard(clickedCoordinates)}
                className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
              >
                Copiar
              </button>
            </p>
          </div>
        )}

        {!currentLocation && !locationError && (
          <div className="bg-blue-100 text-blue-800 p-3 rounded">
            <p>Obteniendo tu ubicación actual...</p>
          </div>
        )}
      </div>

      <div className="relative w-full h-96 rounded-lg border border-gray-200 mb-4">
        {!leafletLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full rounded-lg"></div>
      </div>

      {/* Botón de registro */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleRegistro}
          disabled={!currentLocation || !isInAllowedZone}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
            currentLocation && isInAllowedZone
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          {!currentLocation ? 'Obteniendo ubicación...' :
           !isInAllowedZone ? 'Debes estar en un área definida' :
           'Registrarme Aquí'}
        </button>
      </div>

      {/* Modal de registro */}
      {showRegistroForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 z-[10000] relative">
            <h3 className="text-lg font-bold mb-4">Registro de Usuario</h3>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nombre:</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({...prev, nombre: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              <div className="mb-4 p-2 bg-green-100 rounded text-sm">
                <strong>✓ Registrándote en: {findAreaForPoint(currentLocation)?.nombre}</strong><br />
                <span className="text-gray-600">
                  [{currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}]
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={submitRegistro}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  Confirmar Registro
                </button>
                <button
                  onClick={() => setShowRegistroForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de usuarios registrados */}
      {registeredUsers.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Usuarios Registrados ({registeredUsers.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {registeredUsers.map((user, index) => (
              <div key={index} className="bg-white p-2 rounded border text-sm">
                <strong>{user.nombre}</strong>
                <br />
                <span className="text-blue-600 font-medium">{user.area}</span>
                <br />
                <span className="text-gray-600 text-xs">
                  {new Date(user.timestamp).toLocaleString()} |
                  [{user.coordenadas[0].toFixed(6)}, {user.coordenadas[1].toFixed(6)}]
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObtenerCoordenadas;
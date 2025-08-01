// Map.jsx actualizado para agregar mini-mapa en detalles
import { useEffect, useRef, useState } from 'react';
import { Map } from 'lucide-react';

export const renderMiniMap = (containerId, coordinates, color = '#0000FF', fillColor = '#AAAADD') => {
  if (!window.L || !coordinates || coordinates.length === 0) return;

  const map = window.L.map(containerId, {
    zoomControl: true,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
  });

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  const polygon = window.L.polygon(coordinates, {
    color,
    fillColor,
    fillOpacity: 0.5,
    weight: 2
  }).addTo(map);

  map.fitBounds(polygon.getBounds());
};

const ObtenerCoordenadas = ({ areasDefinidas = [], onUpdateDepartmentFromMap }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const drawControlRef = useRef(null);
  const [polygonCoords, setPolygonCoords] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    const initLeafletDraw = async () => {
      if (!window.L || !window.L.Draw) {
        await loadLeaflet();
        await loadLeafletDraw();
      }
      initializeMap();
    };

    initLeafletDraw();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const loadLeaflet = () => new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });

  const loadLeafletDraw = () => new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current || !window.L) return;

    const map = window.L.map(mapRef.current).setView([18.0254, -102.2070], 16);
    mapInstanceRef.current = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const drawnItems = new window.L.FeatureGroup();
    map.addLayer(drawnItems);

    drawControlRef.current = new window.L.Control.Draw({
      draw: {
        polygon: true,
        marker: false,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false
      },
      edit: { featureGroup: drawnItems }
    });
    map.addControl(drawControlRef.current);

    map.on('draw:created', (e) => {
      const layer = e.layer;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      const coords = layer.getLatLngs()[0].map(p => [p.lat, p.lng]);
      setPolygonCoords(coords);
      setShowModal(true);
    });

    areasDefinidas.forEach(area => {
      if (Array.isArray(area.coordenadas)) {
        window.L.polygon(area.coordenadas, {
          color: area.color || 'blue',
          fillColor: area.fillColor || 'lightblue',
          fillOpacity: 0.4,
          weight: 2
        }).addTo(map);
      }
    });
  };

  const handleGuardar = () => {
    if (!formData.nombre.trim()) return alert('El nombre es obligatorio');

    const newDept = {
      name: formData.nombre,
      description: formData.descripcion,
      devices: [],
      coordinates: polygonCoords,
      color: '#0000FF',
      fillColor: '#AAAADD'
    };

    if (onUpdateDepartmentFromMap) onUpdateDepartmentFromMap(newDept);
    setFormData({ nombre: '', descripcion: '' });
    setPolygonCoords(null);
    setShowModal(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow">
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Map className="w-5 h-5 text-gray-700" /> Dibuja un Departamento
        </h2>
        <p className="text-sm text-gray-500 mt-1">Traza un polígono en el mapa para definir un nuevo departamento.</p>
      </div>
      <div ref={mapRef} className="w-full h-[500px]" />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] z-[10000]">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Información del Departamento</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold">Nombre:</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Descripción:</label>
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObtenerCoordenadas;

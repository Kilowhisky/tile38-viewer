import { useMapStore } from './Map.store';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Map as LeafletMap } from 'leaflet';
import { MapItemLayer } from './MapItemLayer';
import { useTheme } from '@mui/material';
import './Map.css';

export function Map() {
  const center = useMapStore(x => x.center);
  const zoom = useMapStore(x => x.zoom);
  const set = useMapStore(x => x.setKey);
  const [map, setMap] = useState<LeafletMap | null>();
  const isDarkTheme = useTheme().palette.mode === 'dark';

  useEffect(() => {
    map?.on('zoomend', e => set('zoom', e.target.getZoom()));
    map?.on('dragend', e => set('center', e.target.getCenter()));
  }, [map, set]);

  return <MapContainer
    ref={r => setMap(r)}
    className={isDarkTheme ? 'map map-dark' : 'map'}
    style={{ width: '100%', height: '100%' }}
    center={center || [37.0902, -95.7129]}
    zoom={zoom || 4} >
    <MapItemLayer />
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  </MapContainer>
}


import { FormControlLabel, Checkbox, IconButton } from '@mui/material';
import { useMapStore } from './Map.store';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Map as LeafletMap } from 'leaflet';
import Control from 'react-leaflet-custom-control';
import SettingsIcon from '@mui/icons-material/Settings';
import { MapItemLayer } from './MapItemLayer';

export function Map() {
  const center = useMapStore(x => x.center);
  const zoom = useMapStore(x => x.zoom);
  const set = useMapStore(x => x.setKey);
  const [map, setMap] = useState<LeafletMap | null>();

  useEffect(() => {
    map?.on('zoomend', e => set('zoom', e.target.getZoom()));
    map?.on('dragend', e => set('center', e.target.getCenter()));
  }, [map, set]);

  return <>
    <MapContainer
      ref={r => setMap(r)}
      style={{ width: '100%', height: '100%' }}
      center={center || [37.0902, -95.7129]}
      zoom={zoom || 4} >
      <MapItemLayer />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Control prepend position='topright'>
        <IconButton color='inherit' sx={{ backgroundColor: 'white'}} ><SettingsIcon /> </IconButton>
      </Control>
    </MapContainer>
  </>
}

function MapSettings() {
  const zoomOnSelect = useMapStore(x => x.zoomOnSelect);
  const setKey = useMapStore(x => x.setKey);

  return (
    <div>
      <FormControlLabel
        label="Zoom on Select"
        control={
          <Checkbox checked={zoomOnSelect} onChange={(_, v) => setKey('zoomOnSelect', v)} />
        } />
    </div>
  )
}
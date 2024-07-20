import { useMapStore } from './Map.store';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { circleMarker, tooltip } from 'leaflet';
import { useTheme } from '@mui/material';
import './Map.css';
import { GeoJsonObject } from 'geojson';
import { MapPopup } from './MapPopup';

export function Map() {
  const center = useMapStore(x => x.center);
  const zoom = useMapStore(x => x.zoom);
  const set = useMapStore(x => x.setKey);
  const theme = useTheme();
  const items = useMapStore(x => x.items);
  const showLabel = useMapStore(x => x.showStaticLabel);
  const map = useMapStore(x => x.map);

  useEffect(() => {
    const classList = map?.getContainer().classList;
    if (theme.palette.mode == 'dark') {
      classList?.add('map-dark')
    } else {
      classList?.remove('map-dark')
    }
  }, [map, theme.palette.mode])

  useEffect(() => {
    map?.on('zoomend', e => set('zoom', e.target.getZoom()));
    map?.on('dragend', e => set('center', e.target.getCenter()));
  }, [map, set]);



  return <MapContainer
    ref={r => set('map', r)}
    className={'map'}
    style={{ width: '100%', height: '100%' }}
    center={center || [37.0902, -95.7129]}
    zoom={zoom || 4} >
    {items.map(data => (
      <GeoJSON
        key={`${data.key}_${data.id}`}
        pointToLayer={(_feature, latlng) => {
          return circleMarker(latlng, {
            radius: 4,
            weight: 3,
          });
        }}
        style={{ weight: 2 }}
        data={data.object as GeoJsonObject}
        onEachFeature={(_, layer) => {
          if (showLabel) {
            layer.bindTooltip(tooltip({
              permanent: true,
              direction: 'bottom',
              className: 'text',
              opacity: 0.5
            }).setContent(data.id));
          }
        }}
      >
        <MapPopup data={data} />
      </GeoJSON>
    ))}
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  </MapContainer>
}



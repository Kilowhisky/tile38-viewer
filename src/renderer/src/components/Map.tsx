import { useMapStore } from './Map.store';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { circleMarker, LatLngBounds, Map as LeafletMap, tooltip } from 'leaflet';
import { useTheme } from '@mui/material';
import './Map.css';
import { GeoJsonObject } from 'geojson';
import bbox from "@turf/bbox";
import { GetFeatureCollection } from "./KeyItemList.store";

export function Map() {
  const center = useMapStore(x => x.center);
  const zoom = useMapStore(x => x.zoom);
  const set = useMapStore(x => x.setKey);
  const [map, setMap] = useState<LeafletMap | null>();
  const theme = useTheme();
  const items = useMapStore(x => x.items);
  const zoomOnSelect = useMapStore(x => x.zoomOnSelect);
  const showLabel = useMapStore(x => x.showStaticLabel);

  useEffect(() => {
    const classList = map?.getContainer().classList;
    if (theme.palette.mode == 'dark') {
      classList?.add('map-dark')
    } else {
      classList?.remove('map-dark')
    }
  }, [map, theme.palette.mode])

  useEffect(() => {
    if (zoomOnSelect && map && items.length) {
      const [west, south, east, north] = bbox(
        GetFeatureCollection(...items.map(x => x.object))
      );
      const bounds = new LatLngBounds(
        { lat: south, lng: west },
        { lat: north, lng: east }
      )
      map.fitBounds(bounds, {
        maxZoom: 15
      });
    }
  }, [items, map, zoomOnSelect]);

  useEffect(() => {
    map?.on('zoomend', e => set('zoom', e.target.getZoom()));
    map?.on('dragend', e => set('center', e.target.getCenter()));
  }, [map, set]);

  return <MapContainer
    ref={r => setMap(r)}
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
        <Popup>
          <dl className='map-popup'>
            <div><strong>Key</strong>{data.key}</div>
            <div><strong>Id</strong>{data.id}</div>
          </dl>
        </Popup>
      </GeoJSON>
    ))}
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  </MapContainer>
}


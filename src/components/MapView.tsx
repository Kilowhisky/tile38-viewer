import { APIProvider, ControlPosition, Map, MapControl, MapProps } from "@vis.gl/react-google-maps";
import { MapItemOverlay } from "./MapItemOverlay";
import { useMapViewStore } from "./MapView.store";
import { FormControlLabel, Checkbox, Paper, CircularProgress } from "@mui/material";
import { useTile38 } from "../lib/tile38Connection.store";
import { useEffect, useState } from "react";

export function MapView() {
  const [loadingMap, setLoadingMap] = useState(false);
  const center = useMapViewStore(x => x.center);
  const zoom = useMapViewStore(x => x.zoom);
  const zoomOnSelect = useMapViewStore(x => x.zoomOnSelect);
  const apiKey = useMapViewStore(x => x.apiKey);
  const setCenter = useMapViewStore(x => x.setCenter);
  const setZoom = useMapViewStore(x => x.setZoom);
  const setKey = useMapViewStore(x => x.setKey);
  const tile38 = useTile38();

  const MAP_OPTIONS: MapProps = {
    reuseMaps: true,
    mapId: '58a3b288bc8b0e08',
    streetViewControl: false,
    defaultZoom: zoom || 3,
    defaultCenter: center || {
      lat: 39.833,
      lng: -98.583
    },
    onCenterChanged: e => setCenter(e.detail.center),
    onZoomChanged: e => setZoom(e.detail.zoom),
  }

  useEffect(() => {
    const loadApiKey = async () => {
      setLoadingMap(true);
      const response = await tile38.connection!.get('tile38_viewer_settings', 'map_key', 'OBJECT');
      if (response.ok) {
        setKey('apiKey', response.object as string);
      }
      setLoadingMap(false)
    }
    if (apiKey == '') {
      loadApiKey();
    }
  }, [apiKey, setKey, tile38.connection])

  const map = <APIProvider apiKey={apiKey}>
    <Map {...MAP_OPTIONS} >
      <MapItemOverlay />
      <MapControl position={ControlPosition.LEFT_TOP}>
        <Paper
          elevation={1}
          sx={{
            m: '10px',
            pv: '5px',
            paddingLeft: '10px',
            borderRadius: '3px'
          }} >
          <FormControlLabel
            label="Zoom on Select"
            control={
              <Checkbox checked={zoomOnSelect} onChange={(_, v) => setKey('zoomOnSelect', v)} />
            } />
        </Paper>
      </MapControl>
    </Map>
  </APIProvider>;

  return loadingMap ? <CircularProgress /> : map;
}
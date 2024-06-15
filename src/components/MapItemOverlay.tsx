import { useMap } from "@vis.gl/react-google-maps";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { useMemo, useEffect } from "react";
import { useMapViewStore } from "./MapView.store";
import { GeoJsonLayer } from "@deck.gl/layers";
import bbox from "@turf/bbox";
import { GetFeatureCollection } from "./KeyItemList.store";
import uniqolor from 'uniqolor';

export function MapItemOverlay() {
  const map = useMap();
  const deck = useMemo(() => new GoogleMapsOverlay({ interleaved: true }), []);
  const items = useMapViewStore(x => x.items);
  const zoomOnSelect = useMapViewStore(x => x.zoomOnSelect);
  const layers = useMemo(() => {
    return items.map(key => {
      return new GeoJsonLayer({
        id: `${key.key}_${key.id}`,
        pointType: 'circle+text',
        data: key.object,
        pickable: true,
        getFillColor: [...getFillColor(key.key), 255] as never,
        getLineColor: [0, 0, 0, 255],
        opacity: 0.3,
        getText: () => key.id,
        getTextSize: 16,
        getPointRadius: 20,
        getLineWidth: 1,
      })
    })
  }, [items]);

  useEffect(() => {
    if (zoomOnSelect && map && items.length) {
      const [west, south, east, north] = bbox(
        GetFeatureCollection(...items.map(x => x.object))
      );
      map.fitBounds({ west, south, east, north }, 20);

      // panToBounds likes to zoom in way too far, force it to normal zoom
      if (map.getZoom()! > 15) {
        map.setZoom(15)
      }
    }
  }, [items, map, zoomOnSelect]);

  useEffect(() => {
    deck.setMap(map);
    return () => deck.setMap(null);
  }, [map, deck]);

  useEffect(() => {
    deck.setProps({ layers })
  }, [layers, deck]);

  // no dom rendered by this component
  return null;
}

function getFillColor(key: string): number[] {
  const color = uniqolor(key, { format: 'rgb' }).color;
  const trimmed = color.slice(4, -1);
  return trimmed.split(',').map(parseInt);
}

import { useMemo, useEffect } from "react";
import { useMapStore } from "./Map.store";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { LeafletLayer } from 'deck.gl-leaflet';
import bbox from "@turf/bbox";
import { GetFeatureCollection } from "./KeyItemList.store";
import uniqolor from 'uniqolor';
import { LatLngBounds } from "leaflet";
import { MapView } from "@deck.gl/core/typed";
import { useMap } from "react-leaflet";

export function MapItemLayer() {
  const map = useMap();
  const items = useMapStore(x => x.items);
  const zoomOnSelect = useMapStore(x => x.zoomOnSelect);
  const deck = useMemo(() => new LeafletLayer({
    views: [new MapView({ repeat: true })]
  }), []);


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
    map.addLayer(deck);
    return () => {
      map.removeLayer(deck);
    }
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

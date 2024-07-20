import { create } from "zustand";
import { removeItem } from "../lib/arrayHelpers";
import { KeyData } from "./KeyItemList.store";
import { LatLngBounds, LatLngExpression, Map } from "leaflet";
import bbox from "@turf/bbox";
import { GetFeatureCollection } from "./KeyItemList.store";

export interface MapState {
  map: Map | undefined;
  center?: LatLngExpression | undefined;
  zoom?: number;
  zoomOnSelect: boolean;
  showStaticLabel: boolean;
  items: KeyData[];
  addItem: (item: KeyData) => unknown;
  removeItem: (item: KeyData) => unknown;
  setKey: <T = MapState>(key: keyof T, value: T[keyof T]) => unknown;
  zoomMapToItems: () => unknown;
}

export const useMapStore = create<MapState>((set, get) => ({
  map: undefined,
  items: [],
  zoomOnSelect: true,
  showStaticLabel: true,
  addItem(item) {
    const { items } = get();
    if (!items.includes(item)) {
      set({
        items: [...items, item],
      });
    }
  },
  removeItem(item) {
    const { items } = get();
    set({
      items: [...removeItem(items, item)],
    });
  },
  setKey(key, value) {
    set({ [key]: value });
  },
  zoomMapToItems() {
    const { zoomOnSelect, items, map } = get();
    if (zoomOnSelect && map && items.length) {
      const [west, south, east, north] = bbox(GetFeatureCollection(...items.map((x) => x.object)));
      const bounds = new LatLngBounds({ lat: south, lng: west }, { lat: north, lng: east });
      map.fitBounds(bounds, {
        maxZoom: 15,
      });
    }
  },
}));

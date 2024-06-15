import { create } from "zustand";
import { removeItem } from "../lib/arrayHelpers";
import { KeyData } from "./KeyItemList.store";

export interface MapViewState {
  center?: google.maps.LatLngLiteral
  zoom?: number
  zoomOnSelect: boolean
  items: KeyData[]
  addItem: (item: KeyData) => unknown;
  removeItem: (item: KeyData) => unknown;
  setCenter: (latlng: google.maps.LatLngLiteral) => unknown;
  setZoom: (zoom: number) => unknown
  setKey: <T = MapViewState>(key: keyof T, value: T[keyof T]) => unknown;
}

export const useMapViewStore = create<MapViewState>((set, get) => ({
  items: [],
  zoomOnSelect: true,
  addItem(item) {
    const { items } = get();
    if (!items.includes(item)) {
      set({
        items: [...items, item]
      })
    }
  },
  removeItem(item) {
    const { items } = get();
    set({
      items: [...removeItem(items, item)],
    })
  },
  setCenter(center) {
    set({ center })
  },
  setZoom(zoom) {
    set({ zoom })
  },
  setKey(key, value) {
    set({ [key]: value });
  }
}));
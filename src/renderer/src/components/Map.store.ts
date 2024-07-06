import { create } from "zustand";
import { removeItem } from "../lib/arrayHelpers";
import { KeyData } from "./KeyItemList.store";
import { LatLngExpression } from "leaflet";

export interface MapState {
  center?: LatLngExpression | undefined
  zoom?: number
  zoomOnSelect: boolean
  items: KeyData[]
  apiKey: string
  addItem: (item: KeyData) => unknown;
  removeItem: (item: KeyData) => unknown;
  setKey: <T = MapState>(key: keyof T, value: T[keyof T]) => unknown;
}

export const useMapStore = create<MapState>((set, get) => ({
  items: [],
  zoomOnSelect: true,
  apiKey: '',
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
  setKey(key, value) {
    set({ [key]: value });
  }
}));
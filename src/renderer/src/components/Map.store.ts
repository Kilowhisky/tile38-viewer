import { create } from "zustand"
import { LatLngBounds, LatLngExpression, Map as LeafletMap } from "leaflet"
import bbox from "@turf/bbox"
import { GetFeatureCollection } from "./KeyItemList.store"
import { ColorHex } from "./ColorPicker"
import { CmdResponse, GetFieldsFromScanObject, IsObjectResponse, IsScanObjectResponse, Tile38Object } from "@renderer/lib/tile38Connection.models"

export interface MapData {
  key?: string
  id: string
  object: Tile38Object
  fields?: Record<string, string | number>
}

export interface ItemCollection {
  readonly id: string
  readonly name: string
  readonly color: ColorHex
  readonly items: ReadonlyMap<string, MapData>
}

export interface MapState {
  map: LeafletMap | undefined
  center?: LatLngExpression | undefined
  zoom?: number
  zoomOnSelect: boolean
  showStaticLabel: boolean
  readonly items: ReadonlyMap<string, ItemCollection>
  addItemCollection: (collection: ItemCollection) => unknown
  removeItemCollection: (collectionId: string) => boolean
  addItems: (collectionId: string, ...items: MapData[]) => boolean
  removeItem: (collectionId: string, itemId: string) => boolean
  setKey: <T = MapState>(key: keyof T, value: T[keyof T]) => unknown
  zoomMapToItems: () => unknown
}

export const useMapStore = create<MapState>((set, get) => ({
  map: undefined,
  items: new Map<string, ItemCollection>(),
  zoomOnSelect: true,
  showStaticLabel: false,

  addItemCollection(collection) {
    set({
      items: new Map([...get().items, [collection.id, collection]]),
    })
  },
  removeItemCollection(collectionId) {
    const items = get().items
    const collection = items.get(collectionId)
    if (collection) {
      set({
        items: new Map([...items].filter(x => x[0] != collectionId)),
      })
    }
    return !!collection
  },
  addItems(collectionId, ...newItems) {
    const items = get().items
    const collection = items.get(collectionId)
    if (collection) {
      set({
        items: new Map([
          ...items,
          [
            collection.id,
            {
              ...collection,
              items: new Map([...collection.items, ...(newItems.map(y => [y.id, y]) as Iterable<readonly [string, MapData]>)]),
            },
          ],
        ]),
      })
    }
    return !!collection
  },
  removeItem(collectionId, itemId) {
    const items = get().items
    const collection = items.get(collectionId)

    if (collection) {
      // Remove the item from the collection
      const newCollectionItems = [...collection.items].filter(x => x[0] != itemId)
      // If the collection is empty, remove the collection
      if (newCollectionItems.length == 0) {
        set({
          items: new Map([...items].filter(x => x[0] != collectionId)),
        })
      } else {
        // Construct a whole new Map without the item
        const newCollection: ItemCollection = {
          ...collection,
          items: new Map(newCollectionItems),
        }
        // Use the set function to overwrite the existing collection
        set({
          items: new Map([...items, [collectionId, newCollection]]),
        })
      }
    }

    return !!collection
  },

  setKey(key, value) {
    set({ [key]: value })
  },
  zoomMapToItems() {
    const { zoomOnSelect, items, map } = get()
    if (zoomOnSelect && map && items.size) {
      const geojsons = [...items.values()].flatMap(x => [...x.items.values()]).map(x => x.object)
      const [west, south, east, north] = bbox(GetFeatureCollection(...geojsons))
      const bounds = new LatLngBounds({ lat: south, lng: west }, { lat: north, lng: east })
      map.fitBounds(bounds, {
        maxZoom: 15,
      })
    }
  },
}))

export function getMapDataFromResult(response: CmdResponse): MapData[] {
  if (IsObjectResponse(response)) {
    return [
      {
        id: window.crypto.randomUUID(),
        object: response.object,
        fields: response.fields,
      },
    ]
  } else if (IsScanObjectResponse(response)) {
    return response.objects
      .filter(x => typeof x.object == "object")
      .map(x => ({
        id: x.id,
        object: x.object,
        fields: GetFieldsFromScanObject(x),
      }))
  }
  return []
}

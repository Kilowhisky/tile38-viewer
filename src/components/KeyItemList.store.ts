import { Geometry } from "geojson";
import { StoreApi, UseBoundStore, create, useStore } from "zustand";
import { useTile38 } from "../lib/tile38Connection.store";
import { isString } from "../lib/stringHelpers";
import { CountResponse, ScanObjectResponse } from "../lib/tile38Connection.models";
import { unique } from "../lib/arrayHelpers";

export interface KeyData {
  id: string
  type: string
  object: string | Geometry
  fields: Array<string | number>
}

export interface KeyItemState {
  key: string;
  cursor?: number;
  total?: number;
  data: KeyData[],
  fields: string[]
  reset: () => unknown;
  load: (limit: number) => Promise<unknown>
}

const stores: { [key: string]: UseBoundStore<StoreApi<KeyItemState>> } = {};


export function useKeyItemStore(key: string): KeyItemState
export function useKeyItemStore<T>(key: string, selector: (state: KeyItemState) => T): T
export function useKeyItemStore<T>(key: string, selector?: (state: KeyItemState) => T) {
  if (!stores[key]) {
    stores[key] = create<KeyItemState>((set, get) => ({
      key,
      data: [],
      fields: [],
      reset() {
        set({
          data: [],
          fields: [],
          cursor: undefined,
          total: undefined
        })
      },
      async load(limit: number) {
        const { key, cursor, data, fields } = get();
        const tile38 = useTile38.getState().connection!;
        const result: Partial<KeyItemState> = {};
        // Get total for paging use
        const responseCount = await tile38.raw<CountResponse>(`SCAN ${key} COUNT`);
        if (responseCount.ok) {
          result.total = responseCount.count;
        }

        // Get the paging data
        const response = await tile38.raw<ScanObjectResponse>(`SCAN ${key} CURSOR ${cursor || 0} limit ${limit}`);
        if (response.ok) {
          result.cursor = response.cursor;
          result.fields = unique([...fields, ...(response.fields || [])]);
          result.data = [
            ...data,
            ...response.objects.map(x => ({
              id: x.id,
              type: isString(x.object) ? "String" : (x.object as Geometry).type,
              object: x.object,
              fields: x.fields || []
            }))
          ];
        }
        set(result)
      }
    }));
  }
  return useStore(stores[key], selector!);
}
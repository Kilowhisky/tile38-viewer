import { StoreApi, UseBoundStore, create, useStore } from "zustand";
import { useTile38 } from "../lib/tile38Connection.store";
import { isString } from "../lib/stringHelpers";
import { CountResponse, GetFieldsFromScanObject, ScanObjectResponse, Tile38Object } from "../lib/tile38Connection.models";
import { unique, uniqueBy } from "../lib/arrayHelpers";
import { Feature, FeatureCollection, Geometry } from "geojson";
import { feature, featureCollection } from "@turf/helpers";

export interface KeyData {
  key: string;
  id: string;
  type: string;
  object: Tile38Object;
  fields?: Record<string, string | number>;
}

export interface KeyItemState {
  key: string;
  cursor?: number;
  total?: number;
  data: KeyData[];
  fields: string[];
  loading: boolean;
  match: string;
  sort: "ASC" | "DESC";
  where: string;
  whereIn: string;
  limit: number;
  reset: () => unknown;
  load: (append?: boolean) => Promise<unknown>;
  set: <T = KeyItemState>(field: keyof T, value: T[keyof T]) => unknown;
}

const stores: { [key: string]: UseBoundStore<StoreApi<KeyItemState>> } = {};

export function useKeyItemStore(key: string): KeyItemState;
export function useKeyItemStore<T>(key: string, selector: (state: KeyItemState) => T): T;
export function useKeyItemStore<T>(key: string, selector?: (state: KeyItemState) => T) {
  if (!stores[key]) {
    stores[key] = create<KeyItemState>((set, get) => ({
      key,
      data: [],
      fields: [],
      sort: "ASC",
      limit: 50,
      loading: false,
      match: "",
      where: "",
      whereIn: "",
      set(field, value) {
        set({ [field]: value });
      },
      reset() {
        set({
          data: [],
          fields: [],
          cursor: undefined,
          total: undefined,
          sort: "ASC",
          match: "",
          where: "",
          whereIn: "",
        });
      },
      async load(append = true) {
        const { key, cursor, data, fields, limit, sort, match, where, whereIn } = get();
        const tile38 = useTile38.getState().connection!;
        const result: Partial<KeyItemState> = {};
        set({ loading: true });
        // Get total for paging use
        const responseCount = await tile38.raw<CountResponse>(`SCAN ${key} COUNT`);
        if (responseCount.ok) {
          result.total = responseCount.count;
        }

        // Build the query
        const curse = (append ? cursor : 0) || 0;
        let query = `SCAN ${key} CURSOR ${curse} limit ${limit}`;
        if (match) {
          query += ` MATCH ${match}`;
        }
        query += ` ${sort}`;
        if (where) {
          query += ` WHERE ${where}`;
        }
        if (whereIn) {
          query += ` WHEREIN ${whereIn}`;
        }

        // Get the paging data
        const response = await tile38.raw<ScanObjectResponse>(query);

        if (response.ok) {
          result.cursor = response.cursor;
          result.fields = unique([...fields, ...(response.fields || [])]);
          result.data = uniqueBy(
            [
              ...(append ? data : []),
              ...response.objects.map((x) => ({
                key,
                id: x.id,
                type: isString(x.object) ? "String" : (x.object as Geometry).type,
                object: x.object,
                fields: GetFieldsFromScanObject(x)
              })),
            ],
            "id"
          );
        }

        set({ ...result, loading: false });
      },
    }));
  }
  return useStore(stores[key], selector!);
}

export function GetFeatureCollection(...items: Tile38Object[]): FeatureCollection {
  return featureCollection(
    items.reduce((out, item) => {
      if ((item as FeatureCollection).type == "FeatureCollection") {
        out.push(...(item as FeatureCollection).features);
      } else if ((item as Feature).type == "Feature") {
        out.push(item as Feature);
      } else if (typeof item !== "string" && item instanceof String == false) {
        out.push(feature(item as Geometry));
      }
      return out;
    }, [] as Feature[])
  );
}

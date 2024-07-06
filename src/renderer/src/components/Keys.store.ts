import { create } from "zustand";
import { KeyStats, KeysResponse } from "../lib/tile38Connection.models";
import { useTile38 } from "../lib/tile38Connection.store";
import { removeItem } from "../lib/arrayHelpers";


export interface KeySummary {
  key: string
  count: number
  stats: KeyStats
}

export interface KeysState {
  keys: KeySummary[]
  expanded: string[]
  load: () => Promise<void>
  expand: (key: string) => unknown
  collapse: (key: string) => unknown
}

export const useKeyStore = create<KeysState>((set, get) => ({
  keys: [],
  expanded: [],
  async load() {
    const tile38 = useTile38.getState().connection!;
    const response = await tile38.raw<KeysResponse>("KEYS *");
    const keysSorted = response.keys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const newKeys = [];

    for (let i = 0; i < keysSorted.length; i++) {
      const key = keysSorted[i];
      newKeys.push({
        key,
        count: (await tile38.keysCount(key)).count,
        stats: (await tile38.stats(key)).stats[0]!
      })
    }

    set({ keys: newKeys })
  },
  expand(key: string) {
    set({ expanded: [...get().expanded, key] });
  },
  collapse(key: string) {
    set({ expanded: [...removeItem(get().expanded, key)] })
  }
}));
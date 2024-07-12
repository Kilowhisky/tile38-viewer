import { create } from "zustand";
import { KeyStats, KeysResponse } from "../lib/tile38Connection.models";
import { useTile38 } from "../lib/tile38Connection.store";
import { removeItem } from "../lib/arrayHelpers";
import { Tile38Connection } from "@renderer/lib/tile38Connection";

export class KeySummary {
  constructor(
    public key: string,
    private tile38: Tile38Connection
  ) {}

  async count(): Promise<number> {
    return (await this.tile38.keysCount(this.key)).count;
  }
  async stats(): Promise<KeyStats> {
    return (await this.tile38.stats(this.key)).stats[0]!;
  }
}

export interface KeysState {
  keyCountShown: number;
  keys: KeySummary[];
  expanded: string[];
  loading: boolean;
  pattern: string;
  load: () => Promise<void>;
  expand: (key: string) => unknown;
  collapse: (key: string) => unknown;
  setKeyCountShown: (count: number) => void;
  setPattern: (pattern: string) => unknown;
}

export const useKeyStore = create<KeysState>((set, get) => ({
  pattern: "*",
  keyCountShown: 50,
  keys: [],
  expanded: [],
  loading: false,
  async load() {
    set({ loading: true });
    const tile38 = useTile38.getState().connection!;
    const pattern = get().pattern;
    const response = await tile38.raw<KeysResponse>(`KEYS ${pattern}`);
    const keysSorted = response.keys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const newKeys: KeySummary[] = [];

    for (let i = 0; i < keysSorted.length; i++) {
      const key = keysSorted[i];
      newKeys.push(new KeySummary(key, tile38));
    }

    set({ keys: newKeys, loading: false });
  },
  expand(key: string) {
    set({ expanded: [...get().expanded, key] });
  },
  collapse(key: string) {
    set({ expanded: [...removeItem(get().expanded, key)] });
  },
  setKeyCountShown(count) {
    set({ keyCountShown: count });
  },
  setPattern(pattern) {
    set({ pattern });
  },
}));

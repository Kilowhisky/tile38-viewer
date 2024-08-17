import { create } from "zustand"
import { Tile38Connection } from "./tile38Connection"

export interface Tile38State {
  connection?: Tile38Connection
  setConnection: (connection: Tile38Connection) => unknown
}

export const useTile38 = create<Tile38State>(set => ({
  setConnection(connection) {
    set({ connection })
  },
}))

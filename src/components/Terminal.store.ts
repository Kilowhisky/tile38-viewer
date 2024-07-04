import { create } from 'zustand'
import { CmdResponse } from '../lib/tile38Connection.models'
import { useTile38 } from '../lib/tile38Connection.store'

interface CommandEntry {
  id: string
  cmd: CmdResponse
}

interface TerminalState {
  cmd: string,
  history: CommandEntry[]
  execute: (cmd: string) => Promise<CommandEntry>
  setCmd: (cmd: string) => unknown
}

export const useTerminalStore = create<TerminalState>()((set, get) => {
  return {
    cmd: '',
    history: [],

    async execute(cmd: string) {
      const tile38 = useTile38.getState().connection!;
      const entry = {
        id: crypto.randomUUID(),
        cmd: await tile38.raw(cmd)
      }
      set(() => ({
        cmd: '',
        history: [
          ...get().history,
          entry
        ]
      }))
      return entry;
    },

    setCmd(cmd: string) {
      set({ cmd })
    }

  }
})
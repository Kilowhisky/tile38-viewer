import { IconButton, TextField } from "@mui/material"
import "./Terminal.css"
import { useTerminalStore } from "./Terminal.store"
import { JsonView } from "./JsonView"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { getMapDataFromResult, MapData, useMapStore } from "./Map.store"

export function Terminal() {
  const history = useTerminalStore(x => x.history)
  const clear = useTerminalStore(x => x.clear)
  const cmd = useTerminalStore(x => x.cmd)
  const setCmd = useTerminalStore(x => x.setCmd)
  const execute = useTerminalStore(x => x.execute)

  const addItemCollection = useMapStore(x => x.addItemCollection)
  const addItems = useMapStore(x => x.addItems)
  const zoomMap = useMapStore(x => x.zoomMapToItems)

  return (
    <div className="terminal-container">
      <div id="terminal-history" className="terminal">
        {[...history].reverse().map(e => {
          const objects = getMapDataFromResult(e.cmd)

          function showOnMap() {
            addItemCollection({
              id: e.id,
              color: "#3388ff",
              name: e.cmd.command.substring(0, 20),
              items: new Map<string, MapData>(),
            })
            addItems(e.id, ...objects)
            zoomMap()
          }

          return <JsonView key={e.id} data={e.cmd} showVisualize={!!objects.length} onShowVisualize={() => showOnMap()} />
        })}
      </div>
      <div className="cmd-container">
        <TextField
          fullWidth
          value={cmd}
          variant="filled"
          label="Command..."
          onChange={x => setCmd(x.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && cmd) {
              execute(cmd).then(() => {
                document.getElementById("terminal-history")!.scrollTo({ top: 0 })
              })
              e.preventDefault()
            }
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />
        <IconButton color="error" title="Clear Terminal" onClick={clear}>
          <DeleteForeverIcon />
        </IconButton>
      </div>
    </div>
  )
}

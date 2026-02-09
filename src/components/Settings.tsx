import { FormControlLabel, Checkbox, Container } from "@mui/material"
import { useMapStore } from "./Map.store"

export function Settings() {
  const showLabel = useMapStore(x => x.showStaticLabel)
  const zoomOnSelect = useMapStore(x => x.zoomOnSelect)
  const setKey = useMapStore(x => x.setKey)

  return (
    <Container maxWidth="md">
      <h1>Settings</h1>
      <h3>Map</h3>
      <div>
        <FormControlLabel label="Zoom Map on Select" control={<Checkbox checked={zoomOnSelect} onChange={(_, v) => setKey("zoomOnSelect", v)} />} />
      </div>
      <div>
        <FormControlLabel label="Show Item Label" control={<Checkbox checked={showLabel} onChange={(_, v) => setKey("showStaticLabel", v)} />} />
      </div>
    </Container>
  )
}

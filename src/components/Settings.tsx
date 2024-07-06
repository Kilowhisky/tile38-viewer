import { FormControlLabel, Checkbox, Container } from '@mui/material';
import { useMapStore } from './Map.store';

export function Settings() {
  const zoomOnSelect = useMapStore(x => x.zoomOnSelect);
  const setKey = useMapStore(x => x.setKey);

  return (
    <Container maxWidth="sm">
      <h1>Settings</h1>
      <h3>Map</h3>
      <FormControlLabel
        label="Zoom Map on Select"
        control={<Checkbox checked={zoomOnSelect} onChange={(_, v) => setKey('zoomOnSelect', v)} />} />
    </Container>
  );
}

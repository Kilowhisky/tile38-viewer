import { IconButton, Menu, MenuItem, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useKeyItemStore } from "./KeyItemList.store";
import { useDebouncedCallback } from "use-debounce";

export function KeyItemMenu({ itemKey }: { itemKey: string }) {
  const [anchor, setAnchor] = useState<HTMLButtonElement>();
  const match = useKeyItemStore(itemKey, x => x.match);
  const sort = useKeyItemStore(itemKey, x => x.sort);
  const where = useKeyItemStore(itemKey, x => x.where);
  const whereIn = useKeyItemStore(itemKey, x => x.whereIn);
  const setKeyItemStore = useKeyItemStore(itemKey, x => x.set);
  const load = useKeyItemStore(itemKey, x => x.load);
  const loadDebounced = useDebouncedCallback(load.bind(false), 1000);

  function onOpenMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchor(event.currentTarget)
    event.preventDefault();
    event.stopPropagation();
  }



  return (
    <>
      <IconButton onClick={onOpenMenu}>
        <FilterAltIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        variant="menu"
        anchorEl={anchor}
        open={anchor !== undefined}
        onClose={() => setAnchor(undefined)}
        onClick={e => e.stopPropagation()}
      >
        <MenuItem >
          <TextField
            label="MATCH"
            variant="standard"
            value={match}
            onChange={(v) => {
              setKeyItemStore('match', v.currentTarget.value);
              loadDebounced()
            }} />
        </MenuItem>
        <MenuItem >
          <TextField label="WHERE" variant="standard"
            value={where}
            onChange={(v) => {
              setKeyItemStore('where', v.currentTarget.value);
              loadDebounced()
            }} />
        </MenuItem>
        <MenuItem >
          <TextField label="WHEREIN" variant="standard"
            value={whereIn}
            onChange={(v) => {
              setKeyItemStore('wherein', v.currentTarget.value);
              loadDebounced()
            }} />
        </MenuItem>
        <MenuItem >
          <ToggleButtonGroup
            color="primary"
            value={sort}
            exclusive
            onChange={(_, v) => {
              setKeyItemStore('sort', v);
              load(false)
            }} >
            <ToggleButton value="ASC"><ArrowUpwardIcon />ASC</ToggleButton>
            <ToggleButton value="DESC"><ArrowDownwardIcon />DESC</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
      </Menu>
    </>
  )
}

import { useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Link, TableFooter, TableHead, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ItemTtl } from "./ItemTtl";
import { KeyData, useKeyItemStore } from "./KeyItemList.store";
import { LoadingButton } from "@mui/lab";
import { usePanelTopStore } from "./PanelTop.store";
import { KeyItem, KeyItemView } from "./KeyItemView";
import { useMapStore } from "./Map.store";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useDebouncedCallback } from "use-debounce";
import Grid from '@mui/material/Unstable_Grid2';

// Based on this: https://mui.com/material-ui/react-table/
// -------------------------------------------------------------------------
export interface KeyItemListProps {
  itemKey: string
}

export function KeyItemList({ itemKey }: KeyItemListProps) {
  const loading = useKeyItemStore(itemKey, x => x.loading);
  const load = useKeyItemStore(itemKey, x => x.load);
  const fields = useKeyItemStore(itemKey, x => x.fields);
  const data = useKeyItemStore(itemKey, x => x.data);
  const total = useKeyItemStore(itemKey, x => x.total);
  const addTopPanel = usePanelTopStore(x => x.addPanel);
  const mapItems = useMapStore(x => x.items);
  const mapItemAdd = useMapStore(x => x.addItem);
  const zoomMap = useMapStore(x => x.zoomMapToItems);
  const mapItemRemove = useMapStore(x => x.removeItem);
  const match = useKeyItemStore(itemKey, x => x.match);
  const sort = useKeyItemStore(itemKey, x => x.sort);
  const where = useKeyItemStore(itemKey, x => x.where);
  const whereIn = useKeyItemStore(itemKey, x => x.whereIn);
  const setKeyItemStore = useKeyItemStore(itemKey, x => x.set);
  const loadDebounced = useDebouncedCallback(() => load(false), 500);

  useEffect(() => {
    if (!data.length) {
      load();
    }
  }, [])

  function emptyCells(count: number) {
    if (count > 0) {
      return <TableCell colSpan={count} />
    }
    return undefined;
  }

  function onRowClick(row: KeyData) {
    const item: KeyItem = {
      key: itemKey,
      id: row.id,
      object: row.object,
      fields: fields.reduce((o, k, i) => {
        if (row.fields.length > i) {
          o[k] = row.fields[i];
        }
        return o;
      }, {} as Record<string, string | number>)
    }
    addTopPanel({
      id: row.id,
      label: row.id,
      closable: true,
      component: <KeyItemView item={item} />
    })
  }

  function onRowToggle(row: KeyData, checked: boolean) {
    if (checked) {
      mapItemAdd(row);
      zoomMap();

    } else {
      mapItemRemove(row)
    }
  }

  return (
    <>
      <Grid container spacing={2} sx={{ margin: '5px' }}>
        <Grid xs={2}>
          <TextField label="MATCH" variant="outlined"
            fullWidth
            value={match}
            size="small"
            onChange={(v) => {
              setKeyItemStore('match', v.currentTarget.value);
              loadDebounced()
            }} />
        </Grid>
        <Grid xs={4}>
          <TextField label="WHERE" variant="outlined"
            value={where}
            fullWidth
            size="small"
            onChange={(v) => {
              setKeyItemStore('where', v.currentTarget.value);
              loadDebounced()
            }} />
        </Grid>
        <Grid xs={4}>
          <TextField label="WHEREIN" variant="outlined"
            value={whereIn}
            fullWidth
            size="small"
            onChange={(v) => {
              setKeyItemStore('wherein', v.currentTarget.value);
              loadDebounced()
            }} />
        </Grid>
        <Grid xs={2}>
          <ToggleButtonGroup
            color="primary"
            value={sort}
            size="small"
            exclusive
            fullWidth
            onChange={(_, v) => {
              setKeyItemStore('sort', v);
              load(false)
            }} >
            <ToggleButton value="ASC"><ArrowUpwardIcon /></ToggleButton>
            <ToggleButton value="DESC"><ArrowDownwardIcon /></ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <TableContainer>
        <Table size="small" stickyHeader sx={{
          borderCollapse: 'separate',
          tableLayout: 'auto',
          '& .cell-text': {
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '10em',
            display: 'table-cell',
            overflow: 'hidden'
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                style={{
                  width: '35px',
                  padding: '0 10px'
                }}>
                <Checkbox
                  color="primary"
                  indeterminate={data.some(d => mapItems.includes(d))}
                  checked={data
                    .filter(x => x.type.toLowerCase() != "string")
                    .every(d => mapItems.includes(d))
                  }
                  onChange={(_, c) => {
                    data
                      .filter(x => x.type.toLowerCase() != "string")
                      .forEach(y => onRowToggle(y, c));
                    zoomMap();
                  }}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>TTL</TableCell>
              {fields.map(f => <TableCell key={f}>{f}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(r => (
              <TableRow key={r.id} hover>
                <TableCell
                  padding="checkbox"
                  style={{
                    width: '30px',
                    padding: '0 10px'
                  }}>
                  <Checkbox
                    color="primary"
                    disabled={r.type.toLowerCase() == "string"}
                    checked={mapItems.includes(r)}
                    onChange={(_, c) => onRowToggle(r, c)} />
                </TableCell>
                <TableCell>
                  <Link
                    component="button"
                    underline="hover"
                    onClick={() => onRowClick(r)}
                  ><span className="cell-text">{r.id}</span></Link>
                </TableCell>
                <TableCell><span className="cell-text">{r.type}</span></TableCell>
                <TableCell><span className="cell-text"><ItemTtl itemKey={itemKey} id={r.id} /></span></TableCell>
                {r.fields.map((f, i) => (
                  <TableCell key={`${itemKey}_field_${fields[i] || i}`}>
                    <span className="cell-text">{f}</span>
                  </TableCell>
                ))}
                {emptyCells(fields.length - r.fields.length)}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={fields?.length + 4}>
                <span style={{ paddingRight: 5 }}>Showing {data.length} out of {total}</span>
                {data.length !== total && <LoadingButton loading={loading} onClick={() => load()}>Load 50 More</LoadingButton>}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}

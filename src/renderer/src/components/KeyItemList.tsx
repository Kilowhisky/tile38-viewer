import { useEffect, useMemo } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import { Checkbox, Link, TableFooter, TableHead, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { ItemTtl } from "./ItemTtl"
import { KeyData, useKeyItemStore } from "./KeyItemList.store"
import { LoadingButton } from "@mui/lab"
import { usePanelTopStore } from "./PanelTop.store"
import { useMapStore } from "./Map.store"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import { useDebouncedCallback } from "use-debounce"
import Grid from "@mui/material/Unstable_Grid2"
import { JsonView } from "./JsonView"

// Based on this: https://mui.com/material-ui/react-table/
// -------------------------------------------------------------------------
export interface KeyItemListProps {
  itemKey: string
}

export function KeyItemList({ itemKey }: KeyItemListProps) {
  const loading = useKeyItemStore(itemKey, x => x.loading)
  const load = useKeyItemStore(itemKey, x => x.load)
  const fields = useKeyItemStore(itemKey, x => x.fields)
  const data = useKeyItemStore(itemKey, x => x.data)
  const total = useKeyItemStore(itemKey, x => x.total)
  const addTopPanel = usePanelTopStore(x => x.addPanel)
  const itemCollections = useMapStore(x => x.items)
  const addItemCollection = useMapStore(x => x.addItemCollection)
  const removeItemCollection = useMapStore(x => x.removeItemCollection)
  const addItems = useMapStore(x => x.addItems)
  const removeItem = useMapStore(x => x.removeItem)
  const zoomMap = useMapStore(x => x.zoomMapToItems)
  const match = useKeyItemStore(itemKey, x => x.match)
  const sort = useKeyItemStore(itemKey, x => x.sort)
  const where = useKeyItemStore(itemKey, x => x.where)
  const whereIn = useKeyItemStore(itemKey, x => x.whereIn)
  const setKeyItemStore = useKeyItemStore(itemKey, x => x.set)
  const loadDebounced = useDebouncedCallback(() => load(false), 500)
  const mapItems = useMemo(() => itemCollections.get(itemKey), [itemCollections, itemKey])

  useEffect(() => {
    if (!data.length) {
      load()
    }
  }, [])

  function onRowClick(row: KeyData) {
    addTopPanel({
      id: row.id,
      label: row.id,
      closable: true,
      component: <JsonView data={row} />,
    })
  }

  function onWholeKeyUncheck() {
    removeItemCollection(itemKey)
  }

  function onRowToggle(checked: boolean, ...rows: KeyData[]) {
    const collection = itemCollections.get(itemKey)
    if (checked) {
      if (!collection) {
        addItemCollection({
          id: itemKey,
          color: "#3388ff",
          name: `KEY '${itemKey}'`,
          items: new Map<string, KeyData>(),
        })
      }
      addItems(itemKey, ...rows)
      zoomMap()
    } else if (collection) {
      rows.forEach(x => removeItem(collection.id, x.id))
    }
  }

  return (
    <>
      <Grid container spacing={2} sx={{ margin: "5px" }}>
        <Grid xs={2}>
          <TextField
            label="MATCH"
            variant="outlined"
            fullWidth
            value={match}
            size="small"
            onChange={v => {
              setKeyItemStore("match", v.currentTarget.value)
              loadDebounced()
            }}
          />
        </Grid>
        <Grid xs={4}>
          <TextField
            label="WHERE"
            variant="outlined"
            value={where}
            fullWidth
            size="small"
            onChange={v => {
              setKeyItemStore("where", v.currentTarget.value)
              loadDebounced()
            }}
          />
        </Grid>
        <Grid xs={4}>
          <TextField
            label="WHEREIN"
            variant="outlined"
            value={whereIn}
            fullWidth
            size="small"
            onChange={v => {
              setKeyItemStore("wherein", v.currentTarget.value)
              loadDebounced()
            }}
          />
        </Grid>
        <Grid xs={2}>
          <ToggleButtonGroup
            color="primary"
            value={sort}
            size="small"
            exclusive
            fullWidth
            onChange={(_, v) => {
              setKeyItemStore("sort", v)
              load(false)
            }}
          >
            <ToggleButton value="ASC">
              <ArrowUpwardIcon />
            </ToggleButton>
            <ToggleButton value="DESC">
              <ArrowDownwardIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <TableContainer>
        <Table
          size="small"
          stickyHeader
          sx={{
            borderCollapse: "separate",
            tableLayout: "auto",
            "& .cell-text": {
              textWrap: "nowrap",
              textOverflow: "ellipsis",
              display: "table-cell",
              overflow: "hidden",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                style={{
                  width: "35px",
                  padding: "0 10px",
                }}
              >
                <Checkbox
                  color="primary"
                  indeterminate={data.some(d => mapItems?.items.has(d.id))}
                  checked={data.filter(x => x.type.toLowerCase() != "string").every(d => mapItems?.items.has(d.id))}
                  onChange={(_, c) => {
                    if (c) {
                      onRowToggle(c, ...data.filter(x => x.type.toLowerCase() != "string"))
                    } else {
                      onWholeKeyUncheck()
                    }
                    zoomMap()
                  }}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>TTL</TableCell>
              {fields.map(f => (
                <TableCell key={f}>{f}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(r => (
              <TableRow key={r.id} hover>
                <TableCell
                  padding="checkbox"
                  style={{
                    width: "30px",
                    padding: "0 10px",
                  }}
                >
                  <Checkbox color="primary" disabled={r.type.toLowerCase() == "string"} checked={!!mapItems?.items.has(r.id)} onChange={(_, c) => onRowToggle(c, r)} />
                </TableCell>
                <TableCell>
                  <Link component="button" underline="hover" onClick={() => onRowClick(r)}>
                    <span className="cell-text">{r.id}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="cell-text">{r.type}</span>
                </TableCell>
                <TableCell>
                  <span className="cell-text">
                    <ItemTtl itemKey={itemKey} id={r.id} />
                  </span>
                </TableCell>
                {fields.map(key => (
                  <TableCell key={`${itemKey}_field_${key}`}>
                    <span className="cell-text">{r.fields && r.fields[key]}</span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={fields?.length + 4}>
                <span style={{ paddingRight: 5 }}>
                  Showing {data.length} out of {total}
                </span>
                {data.length !== total && (
                  <LoadingButton loading={loading} onClick={() => load()}>
                    Load 50 More
                  </LoadingButton>
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}

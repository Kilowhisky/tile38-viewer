import { useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Link, TableFooter, TableHead } from "@mui/material";
import { ItemTtl } from "./ItemTtl";
import { KeyData, useKeyItemStore } from "./KeyItemList.store";
import { LoadingButton } from "@mui/lab";
import { usePanelTopStore } from "./PanelTop.store";
import { KeyItem, KeyItemView } from "./KeyItemView";
import { useMapStore } from "./Map.store";

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
  const mapItemRemove = useMapStore(x => x.removeItem);

  useEffect(() => {
    if (!data.length) {
      load();
    }
  }, [])

  function emptyCells(count: number) {
    if (count > 0) {
      return <TableCell colSpan={count} />
    }
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
    } else {
      mapItemRemove(row)
    }
  }

  return (
    <TableContainer>
      <Table size="small" stickyHeader sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}>
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
                onChange={(e, c) => data
                  .filter(x => x.type.toLowerCase() != "string")
                  .forEach(y => onRowToggle(y, c))
                }
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
                >{r.id}</Link>
              </TableCell>
              <TableCell>{r.type}</TableCell>
              <TableCell><ItemTtl itemKey={itemKey} id={r.id} /></TableCell>
              {r.fields.map((f, i) => (
                <TableCell key={`${itemKey}_field_${fields[i] || i}`}>{f}</TableCell>
              ))}
              {emptyCells(fields.length - r.fields.length)}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={fields?.length + 4}>
              <span style={{ paddingRight: 5 }}>Showing {data.length} out of {total}</span>
              {data.length !== total && <LoadingButton loading={loading} onClick={load}>Load 50 More</LoadingButton>}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
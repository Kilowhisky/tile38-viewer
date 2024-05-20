import { useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Button, TableFooter, TableHead } from "@mui/material";
import { ItemTtl } from "./ItemTtl";
import { useKeyItemStore } from "./KeyItemList.store";

// Based on this: https://mui.com/material-ui/react-table/
// -------------------------------------------------------------------------
export interface KeyItemListProps {
  itemKey: string
}

export function KeyItemList({ itemKey }: KeyItemListProps) {
  const load = useKeyItemStore(itemKey, x => x.load);
  const fields = useKeyItemStore(itemKey, x => x.fields);
  const data = useKeyItemStore(itemKey, x => x.data);
  const total = useKeyItemStore(itemKey, x => x.total);

  useEffect(() => {
    if (!data.length) {
      load(50);
    }
  }, [])


  return (
    <TableContainer>
      <Table size="small" stickyHeader sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>TTL</TableCell>
            {fields.map(f => <TableCell key={f}>{f}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.type}</TableCell>
              <TableCell><ItemTtl itemKey={itemKey} id={r.id} /></TableCell>
              {r.fields.map((f, i) => (
                <TableCell key={"field_" + fields[i]}>{f}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={fields?.length + 3}>
              <span style={{ paddingRight: 5 }}>Showing {data.length} out of {total}</span>
              {data.length !== total && <Button>Load 50 More</Button>}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
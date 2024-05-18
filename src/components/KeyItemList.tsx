import { useCallback, useContext, useEffect, useState } from "react"
import { Tile38Context } from "../lib/tile38Connection";
import { ScanObjectResponse } from "../lib/tile38Connection.models";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Geometry } from "geojson";
import { isString } from "../lib/stringHelpers";
import { TableHead } from "@mui/material";
import { ItemTtl } from "./ItemTtl";

// Based on this: https://mui.com/material-ui/react-table/#virtualized-table
// -------------------------------------------------------------------------
interface Data {
  id: string
  type: string
  object: string | Geometry
  fields: Array<string | number>
}

export interface KeyItemListProps {
  itemKey: string
}

export function KeyItemList({ itemKey }: KeyItemListProps) {
  // Query state
  const tile38 = useContext(Tile38Context);
  const [cursor, setCursor] = useState(0);

  // Table State
  const [fields, setFields] = useState<string[]>([]);
  const [rows, setRows] = useState<Data[]>([]);

  const load = useCallback(async () => {
    const response = await tile38.raw(`SCAN ${itemKey} CURSOR ${cursor} limit 50`) as ScanObjectResponse;
    if (response.ok) {
      setCursor(response.cursor);
      setFields(response.fields || []);
      rows.push(
        ...response.objects.map(x => ({
          id: x.id,
          type: isString(x.object) ? "STRING" : (x.object as Geometry).type,
          object: x.object,
          fields: x.fields || []
        }))
      );
    }
  }, [rows, tile38, cursor, itemKey]);

  useEffect(() => {
    load();
  }, [tile38])


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
          {rows.map(r => (
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
      </Table>
    </TableContainer>
  )
}
import { Dialog, DialogTitle, DialogContent, DialogContentText, Box, Divider } from "@mui/material";
import { useLocalStorage } from "../lib/useLocalStorage";
import { Connection, ConnectionInfo } from "./Connection";
import { useState } from "react";
import { Tile38Connection } from "../lib/tile38Connection";
import { toast } from 'react-toastify';

export interface ConnectionManagerProps {
  onConnect: (connection: Tile38Connection) => unknown
}

export default function ConnectionManager({ onConnect }: ConnectionManagerProps) {
  const [connections, setConnections] = useLocalStorage<ConnectionInfo[]>("connections", []);
  const [newConnection, setNewConnection] = useState<ConnectionInfo>({
    id: crypto.randomUUID(),
    address: "",
    password: ""
  });

  function connectionChange(connection: ConnectionInfo) {
    setConnections([...connections.filter(f => f.id != connection.id), connection]);
  }

  async function connect(connection: ConnectionInfo): Promise<boolean> {
    try {
      const tile38 = new Tile38Connection(connection);
      await tile38.connect();
      onConnect(tile38);
      return true;
    } catch (e) {
      console.error(e);
      toast.error("Connection Failed")
    }
    return false;
  }

  return (
    <Dialog open={true}>
      <DialogTitle>Connections</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          Connect to a Tile38 instance that has its HTTP interface (WebSockets) enabled.
          For more information on how to enable Tile38 WebSocket interface <a href="https://tile38.com/topics/network-protocols#websockets" target="__BLANK">see the docs.</a>
        </DialogContentText>
        <Divider sx={{ m: 2 }} />
        <Box>
          {connections.map(c => <Connection connection={c} onChange={connectionChange} onSubmit={connect} />)}
          <Connection connection={newConnection} onChange={setNewConnection} onSubmit={connect} />
        </Box>
      </DialogContent>
    </Dialog>
  )
}
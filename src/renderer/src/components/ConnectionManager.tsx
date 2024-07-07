import { Dialog, DialogTitle, DialogContent, DialogContentText, Box, Divider, Link } from "@mui/material";
import { useLocalStorage } from "../lib/useLocalStorage";
import { Connection, ConnectionInfo } from "./Connection";
import { useState } from "react";
import { Tile38Connection } from "../lib/tile38Connection";
import { toast } from 'react-toastify';
import GitHubIcon from '@mui/icons-material/GitHub';

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
    const tile38 = new Tile38Connection(connection);
    const ready = await tile38.connect();
    if (ready) {
      onConnect(tile38);
      toast.success("Connected!")
    } else {
      toast.error("Connection Failed")
    }
    return ready;
  }

  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        Connections
        <Link href="https://github.com/Kilowhisky/tile38-viewer" target="_BLANK"><GitHubIcon /></Link>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          Connect to a Tile38 instance that has its HTTP interface enabled.
          For more information on how to enable Tile38 interface <a href="https://tile38.com/topics/network-protocols#http" target="__BLANK">see the docs.</a>
        </DialogContentText>
        <Divider sx={{ m: 2 }} />
        <Box>
          {connections.map(c => <Connection key={c.id} connection={c} onChange={connectionChange} onSubmit={connect} />)}
          <Connection connection={newConnection} onChange={setNewConnection} onSubmit={connect} />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

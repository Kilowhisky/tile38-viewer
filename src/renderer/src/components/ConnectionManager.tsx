import { Dialog, DialogTitle, DialogContent, DialogContentText, Box, Divider, Link } from "@mui/material"
import { Connection, ConnectionInfo } from "./Connection"
import { useState } from "react"
import { Tile38Connection } from "../lib/tile38Connection"
import { toast } from "react-toastify"
import GitHubIcon from "@mui/icons-material/GitHub"
import "./ConnectionManager.css"

export interface ConnectionManagerProps {
  onConnect: (connection: Tile38Connection) => unknown
}

export default function ConnectionManager({ onConnect }: ConnectionManagerProps) {
  const [connections, setConnections] = useState<ConnectionInfo[]>(JSON.parse(window.localStorage.getItem("connections") || "[]"))
  const [newConnection, setNewConnection] = useState<ConnectionInfo>({
    id: crypto.randomUUID(),
    address: "",
    password: "",
  })

  function connectionChange(connection: ConnectionInfo) {
    const indexOf = connections.findIndex(x => x.id == connection.id)
    if (indexOf >= 0) {
      setConnections([...connections.slice(0, indexOf), connection, ...connections.slice(indexOf + 1)])
    } else {
      setConnections([...connections, connection])
    }
    localStorage.setItem("connections", JSON.stringify(connections))
  }

  function connectionRemove(connection: ConnectionInfo) {
    const indexOf = connections.findIndex(x => x.id == connection.id)
    if (indexOf >= 0) {
      setConnections([...connections.slice(0, indexOf), ...connections.slice(indexOf + 1)])
    } else {
      connection.address = ""
      connection.password = ""
    }
  }

  async function connect(connection: ConnectionInfo): Promise<boolean> {
    const tile38 = new Tile38Connection(connection)
    const ready = await tile38.connect()
    if (ready) {
      onConnect(tile38)
      connectionChange(connection)
      toast.success("Connected!")
    } else {
      toast.error("Connection Failed")
    }
    return ready
  }

  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Connections
        <Link href="https://github.com/Kilowhisky/tile38-viewer" target="_BLANK">
          <GitHubIcon />
        </Link>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          Connect to a Tile38 instance that has its HTTP interface enabled. For more information on how to enable Tile38 interface{" "}
          <a href="https://tile38.com/topics/network-protocols#http" target="__BLANK">
            see the docs.
          </a>
        </DialogContentText>
        <Box className="connection-container">
          {connections.map(c => (
            <div key={c.id} className="connection">
              <Divider sx={{ m: 2 }} />
              <Connection connection={c} onChange={connectionChange} onSubmit={connect} onDelete={connectionRemove} />
            </div>
          ))}
          <div className="connection">
            <Divider sx={{ m: 2 }} />
            <Connection connection={newConnection} onChange={setNewConnection} onSubmit={connect} onDelete={connectionRemove} />
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

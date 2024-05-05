import { Grid, TextField } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import LoginIcon from '@mui/icons-material/Login';
import { useState } from "react";

export interface ConnectionInfo {
  id: string,
  address: string
  password?: string
}

export interface ConnectionProps {
  connection: ConnectionInfo
  onChange: (value: ConnectionInfo) => unknown;
  onSubmit: (value: ConnectionInfo) => Promise<boolean>;
}

export function Connection({ connection, onChange, onSubmit }: ConnectionProps) {
  const [connecting, setConnecting] = useState(false)

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item>
        <TextField
          fullWidth
          label="Address:Port"
          placeholder="x.x.x.x:9851"
          value={connection.address}
          onChange={(e) => onChange({
            id: connection.id,
            address: e.target.value,
            password: connection.password
          })}
        />
      </Grid>
      <Grid item >
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={connection.password}
          onChange={(e) => onChange({
            id: connection.id,
            address: connection.address,
            password: e.target.value
          })}
        />
      </Grid>
      <Grid item>
        <LoadingButton
          color={"primary"}
          title="Connect"
          disabled={!connection.address}
          loading={connecting}
          endIcon={<LoginIcon />}
          onClick={() => {
            setConnecting(true)
            onSubmit(connection)
              .finally(() => {
                setConnecting(false)
              })
          }}>
          Connect
        </LoadingButton>
      </Grid>
    </Grid >
  )
}
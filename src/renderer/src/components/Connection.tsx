import { Grid, IconButton, TextField } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import LoginIcon from '@mui/icons-material/Login';
import DeleteIcon from '@mui/icons-material/Delete';
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
  onDelete: (value: ConnectionInfo) => unknown;
}

export function Connection({ connection, onChange, onSubmit, onDelete }: ConnectionProps) {
  const [connecting, setConnecting] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <form onSubmit={async e => {
      e.preventDefault();

      setConnecting(true);
      setHasError(false);

      const success = await onSubmit(connection);
      setHasError(!success);
      setConnecting(false);
    }}>
      <Grid container spacing={2} alignItems={'center'} >
        <Grid item xs={12} sm={12}>
          <TextField
            required
            fullWidth
            size="small"
            label="Address:Port"
            placeholder="x.x.x.x:9851"
            error={hasError}
            value={connection.address}
            onChange={(e) => onChange({
              id: connection.id,
              address: e.target.value,
              password: connection.password
            })}
          />
        </Grid>
        <Grid item xs={12} sm={9} >
          <TextField
            fullWidth
            size="small"
            label="Password"
            type="password"
            error={hasError}
            value={connection.password}
            onChange={(e) => onChange({
              id: connection.id,
              address: connection.address,
              password: e.target.value
            })}
          />
        </Grid>
        <Grid item display={"flex"} justifyContent={"space-between"}>
          <LoadingButton
            size="small"
            color={"primary"}
            title="Connect"
            disabled={!connection.address}
            loading={connecting}
            endIcon={<LoginIcon />}
            type="submit">
            Connect
          </LoadingButton>
          <IconButton
            size="small"
            color={"error"}
            title="Remove"
            onClick={() => onDelete(connection)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid >
    </form>
  )
}

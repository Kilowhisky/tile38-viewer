import { IconButton, TextField } from "@mui/material";
import './Terminal.css';
import { useTerminalStore } from "./Terminal.store";
import { JsonView } from "./JsonView";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export function Terminal() {
  const history = useTerminalStore(x => x.history);
  const clear = useTerminalStore(x => x.clear);
  const cmd = useTerminalStore(x => x.cmd);
  const setCmd = useTerminalStore(x => x.setCmd);
  const execute = useTerminalStore(x => x.execute);

  return (
    <div className="terminal-container">
      <div className="terminal">
        {history.map(e => <JsonView key={e.id} data={e.cmd} />)}
      </div>
      <div className="cmd-container">
        <TextField
          fullWidth
          value={cmd}
          variant="filled"
          label="Command..."
          onChange={x => setCmd(x.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              execute(cmd);
              e.preventDefault();
            }
          }}
        />
        <IconButton color="error" title="Clear Terminal" onClick={clear}>
          <DeleteForeverIcon />
        </IconButton>
      </div>
    </div>
  )
}
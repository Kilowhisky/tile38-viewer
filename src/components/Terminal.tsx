import { TextField } from "@mui/material";
import './Terminal.css';
import { useTerminalStore } from "./Terminal.store";
import { JsonView } from "./JsonView";

export function Terminal() {
  const store = useTerminalStore();

  return (
    <div className="terminal-container">
      <div className="terminal">
        {store.history.map(e => <JsonView key={e.id} data={e.cmd} />)}
      </div>
      <TextField
        fullWidth
        value={store.cmd}
        variant="filled"
        label="Command..."
        onChange={x => store.setCmd(x.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            store.execute(store.cmd);
            e.preventDefault();
          }
        }} />
    </div>
  )
}
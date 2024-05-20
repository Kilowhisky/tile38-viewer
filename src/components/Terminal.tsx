import { TextField } from "@mui/material";
import './Terminal.css';
import { JSONTree } from "react-json-tree";
import theme from 'react-base16-styling/src/themes/apathy';
import { useTerminalStore } from "./Terminal.store";

export function Terminal() {
  const store = useTerminalStore();

  return (
    <div className="terminal-container">
      <div className="terminal">
        {store.history.map(e => {
          if (typeof e.cmd === 'string' || e.cmd instanceof String) {
            return <pre
              key={e.id}
              style={{
                backgroundColor: theme.base00,
                color: theme.base0D
              }}>{e.cmd}</pre>
          } else {
            return <JSONTree key={e.id} data={e.cmd} hideRoot={true} theme={theme} />
          }
        })}
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
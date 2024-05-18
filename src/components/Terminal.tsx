import { TextField } from "@mui/material";
import './Terminal.css';
import { useCallback, useContext, useState } from "react";
import { Tile38Context } from "../lib/tile38Connection";
import { JSONTree } from "react-json-tree";
import theme from 'react-base16-styling/src/themes/apathy';
import { CmdResponse } from "../lib/tile38Connection.models";

interface CommandEntry {
  id: string
  cmd: string | CmdResponse
}

export function Terminal() {
  const tile38 = useContext(Tile38Context);

  const [command, setCommand] = useState("");
  const [history] = useState<Array<CommandEntry>>([]);

  const submit = useCallback(async () => {
    history.push({
      id: crypto.randomUUID(),
      cmd: command
    }, {
      id: crypto.randomUUID(),
      cmd: await tile38.raw(command)
    });
    setCommand('');
  }, [history, command, tile38])

  return (
    <div className="terminal-container">
      <div className="terminal">
        {history.map(e => {
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
        value={command}
        variant="filled"
        label="Command..."
        onChange={x => setCommand(x.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            submit();
            e.preventDefault();
          }
        }} />
    </div>
  )
}
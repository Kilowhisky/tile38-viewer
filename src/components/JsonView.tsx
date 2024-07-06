import { IconButton } from "@mui/material";
import { JSONTree } from "react-json-tree";
import theme from 'react-base16-styling/src/themes/summerfruit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { toast } from 'react-toastify';
import './JsonView.css';



export function JsonView({ data, ...props }: { data: unknown }) {
  function copy() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Copied to Clipboard');
  }
  return (
    <div className="json-view" {...props}>
      <IconButton onClick={() => copy()} title="Copy"><FileCopyIcon /></IconButton>
      <JSONTree
        data={data}
        hideRoot={true}
        theme={theme}
        invertTheme={true}
        shouldExpandNodeInitially={(_, __, l) => l < 3}
      />
    </div>
  )
}
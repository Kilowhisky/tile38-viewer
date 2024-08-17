import { IconButton, useTheme } from "@mui/material";
import { JSONTree } from "react-json-tree";
import theme from 'react-base16-styling/src/themes/summerfruit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { toast } from 'react-toastify';
import './JsonView.css';

export interface JsonViewProps {
  data: unknown;
  showVisualize?: boolean;
  onShowVisualize?: () => unknown;
}

export function JsonView({ data, showVisualize, onShowVisualize, ...props }: JsonViewProps) {
  const isDarkTheme = useTheme().palette.mode === 'dark';

  function copy() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Copied to Clipboard');
  }

  return (
    <div className="json-view" {...props}>
      <div className="button-container">
        <IconButton onClick={() => copy()} title="Copy"><FileCopyIcon /></IconButton>
        {showVisualize && <IconButton onClick={() => onShowVisualize?.apply(null)} title="View on Map"><AddLocationAltIcon /></IconButton>}
      </div>
      <JSONTree
        data={data}
        hideRoot={true}
        theme={theme}
        invertTheme={!isDarkTheme}
        shouldExpandNodeInitially={(_, __, l) => l < 3}
      />
    </div>
  )
}

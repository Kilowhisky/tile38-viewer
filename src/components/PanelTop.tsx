import { TabContext, TabList, TabPanel } from "@mui/lab";
import { IconButton, Tab } from "@mui/material";
import { Panel, usePanelTopStore } from "./PanelTop.store";
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import './PanelTop.css';
import { useCallback } from "react";
import { Settings } from "./Settings";


export function PanelTop() {
  const panels = usePanelTopStore(x => x.panels);
  const focusPanelId = usePanelTopStore(x => x.focusedPanelId);
  const focus = usePanelTopStore(x => x.focusPanel);
  const close = usePanelTopStore(x => x.removePanel);
  const addPanel = usePanelTopStore(x => x.addPanel);

  function handleTabClose(e: React.MouseEvent<HTMLDivElement, MouseEvent>, panel: Panel) {
    e.stopPropagation();
    close(panel);
  }

  const addSettingsPanel = useCallback(() => {
    addPanel({
      id: 'settings',
      label: 'Settings',
      closable: true,
      component: <Settings />
    });
  }, [addPanel]);

  return (
    <TabContext value={focusPanelId}>
      <div className="tablist-container">
        <div className="tablist-title" >
          <img src="/logo.svg" />
          <span>Tile38 Viewer</span>
        </div>
        <TabList onChange={(_, x) => focus(x)} >
          {panels.map((p) => (
            <Tab
              key={p.id}
              value={p.id}
              label={p.closable ? (
                <span>
                  {p.label}
                  <IconButton
                    sx={{
                      fontSize: '1rem',
                      padding: 0,
                      marginLeft: '5px'
                    }}
                    size="small"
                    component="div"
                    onClick={(e) => handleTabClose(e, p)}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </span>
              ) : p.label}
            />
          ))}
        </TabList>
        <div className="tablist-right">
          <IconButton
            color='inherit'
            sx={{ backgroundColor: 'white' }}
            title="Settings"
            onClick={() => addSettingsPanel()}
          ><SettingsIcon /> </IconButton>
        </div>
      </div>
      {panels.map(p => (
        <TabPanel key={p.id} value={p.id} className="tab-panel">
          {p.component}
        </TabPanel>
      ))}
    </TabContext>
  )
}
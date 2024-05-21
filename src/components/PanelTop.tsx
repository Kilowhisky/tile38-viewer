import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, IconButton, Tab } from "@mui/material";
import { Panel, usePanelTopStore } from "./PanelTop.store";
import CloseIcon from '@mui/icons-material/Close';


export function PanelTop() {
  const panels = usePanelTopStore(x => x.panels);
  const focusPanelId = usePanelTopStore(x => x.focusedPanelId);
  const focus = usePanelTopStore(x => x.focusPanel);
  const close = usePanelTopStore(x => x.removePanel);

  function handleTabClose(e: React.MouseEvent<HTMLDivElement, MouseEvent>, panel: Panel) {
    e.stopPropagation();
    close(panel);
  }

  return (
    <TabContext value={focusPanelId}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={(_, x) => focus(x)}>
          {panels.map((p) => (
            <Tab
              key={p.id}
              value={p.id}
              label={p.closable ? (
                <span>
                  {p.label}
                  <IconButton
                    component="div"
                    onClick={(e) => handleTabClose(e, p)}>
                    <CloseIcon />
                  </IconButton>
                </span>
              ) : p.label}
            />
          ))}
        </TabList>
      </Box>
      {panels.map(p => (
        <TabPanel
          key={p.id}
          value={p.id}
          sx={{ padding: 0, flex: 1, overflow: 'auto' }}>
          {p.component}
        </TabPanel>
      ))}
    </TabContext>
  )
}
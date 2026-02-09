import { TabContext, TabList, TabPanel } from "@mui/lab"
import { IconButton, Tab, useTheme } from "@mui/material"
import { Panel, usePanelTopStore } from "./PanelTop.store"
import CloseIcon from "@mui/icons-material/Close"
import SettingsIcon from "@mui/icons-material/Settings"
import PowerOffIcon from "@mui/icons-material/PowerOff"
import "./PanelTop.css"
import { useCallback, useContext } from "react"
import { Settings } from "./Settings"
import logo from "../assets/logo.svg"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { ThemeWrapperContext } from "./ThemeWrapper"

export function PanelTop() {
  const panels = usePanelTopStore(x => x.panels)
  const focusPanelId = usePanelTopStore(x => x.focusedPanelId)
  const focus = usePanelTopStore(x => x.focusPanel)
  const close = usePanelTopStore(x => x.removePanel)
  const addPanel = usePanelTopStore(x => x.addPanel)
  const theme = useTheme()
  const isDarkTheme = theme.palette.mode === "dark"
  const themeUtils = useContext(ThemeWrapperContext)

  function handleTabClose(e: React.MouseEvent<HTMLDivElement, MouseEvent>, panel: Panel) {
    e.stopPropagation()
    close(panel)
  }

  const addSettingsPanel = useCallback(() => {
    addPanel({
      id: "settings",
      label: "Settings",
      closable: true,
      component: <Settings />,
    })
  }, [addPanel])

  return (
    <TabContext value={focusPanelId}>
      <div className="tablist-container" style={{ borderBottomColor: theme.palette.divider }}>
        <div className="tablist-title">
          <img src={logo} />
          <span>Tile38 Viewer</span>
        </div>
        <TabList onChange={(_, x) => focus(x)}>
          {panels.map(p => (
            <Tab
              key={p.id}
              value={p.id}
              label={
                p.closable ? (
                  <span className="tablist-item">
                    <span className="tablist-item-name">{p.label}</span>
                    <IconButton
                      sx={{
                        fontSize: "1rem",
                        padding: 0,
                        marginLeft: "5px",
                      }}
                      size="small"
                      component="div"
                      onClick={e => handleTabClose(e, p)}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </span>
                ) : (
                  p.label
                )
              }
            />
          ))}
        </TabList>
        <div className="tablist-right">
          {isDarkTheme ? (
            <IconButton title="Light Mode" onClick={() => themeUtils.toggleColorMode()}>
              <LightModeIcon />
            </IconButton>
          ) : (
            <IconButton title="Dark Mode" onClick={() => themeUtils.toggleColorMode()}>
              <DarkModeIcon />
            </IconButton>
          )}
          <IconButton title="Disconnect" onClick={() => location.reload()}>
            <PowerOffIcon />{" "}
          </IconButton>
          <IconButton title="Settings" onClick={() => addSettingsPanel()}>
            <SettingsIcon />{" "}
          </IconButton>
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

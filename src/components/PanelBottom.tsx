import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, Tab } from "@mui/material"
import { useMemo, useState } from "react"
import { Terminal } from "./Terminal"
import Keys, { KeysMenu } from "./Keys"

export function PanelBottom() {
  const [value, setValue] = useState("1")

  const handleChange = (_: React.SyntheticEvent, newValue: string | undefined) => {
    if (newValue) {
      setValue(newValue)
    }
  }

  const tab = {
    padding: 0,
    flex: 1,
    overflow: "auto",
  }

  const menu = useMemo(() => {
    switch (value) {
      case "2":
        return <KeysMenu />
      default:
        return undefined
    }
  }, [value])

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderTop: 1, borderColor: "divider", display: "flex" }}>
        <TabList onChange={handleChange} sx={{ minHeight: 30 }}>
          <Tab label="Terminal" value="1" sx={{ padding: "10px 15px", minHeight: 30 }} />
          <Tab label="Keys" value="2" sx={{ padding: "10px 15px", minHeight: 30 }} />
          <Tab label="Hooks" value="3" sx={{ padding: "10px 15px", minHeight: 30 }} />
          <Tab label="Channels" value="4" sx={{ padding: "10px 15px", minHeight: 30 }} />
          <Tab label="Server" value="5" sx={{ padding: "10px 15px", minHeight: 30 }} />
        </TabList>
        <Box sx={{ flex: "1 0 auto", display: "flex", justifyContent: "flex-end" }}>{menu}</Box>
      </Box>
      <TabPanel value="1" sx={tab}>
        <Terminal />
      </TabPanel>
      <TabPanel value="2" sx={tab}>
        <Keys />
      </TabPanel>
      <TabPanel value="3" sx={tab}>
        <ComingSoonTab />
      </TabPanel>
      <TabPanel value="4" sx={tab}>
        <ComingSoonTab />
      </TabPanel>
      <TabPanel value="5" sx={tab}>
        <ComingSoonTab />
      </TabPanel>
    </TabContext>
  )
}

function ComingSoonTab() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <span>Coming Soon</span>
    </div>
  )
}

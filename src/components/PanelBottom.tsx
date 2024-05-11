import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import { Terminal } from "./Terminal";
import Keys from "./Keys";


export function PanelBottom() {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Terminal" value="1" />
          <Tab label="Keys" value="2" />
          <Tab label="Hooks" value="3" />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ padding: 0, flex: 1, overflow: 'hidden' }}><Terminal /></TabPanel>
      <TabPanel value="2" sx={{ padding: 0, flex: 1, overflow: 'hidden' }}><Keys /></TabPanel>
      <TabPanel value="3" sx={{ padding: 0, flex: 1, overflow: 'hidden' }}>Hooks</TabPanel>
    </TabContext>
  )
}
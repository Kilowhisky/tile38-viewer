import { useMemo, useState } from 'react';
import './App.css'
import ConnectionManager from './components/ConnectionManager'
import { ToastContainer } from 'react-toastify';
import { Tile38Connection, Tile38Context } from './lib/tile38Connection';
import Header from './components/Header';
import { ThemeProvider } from '@emotion/react';
import { createTheme, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { PanelBottom } from './components/PanelBottom';

export default function App() {
  // Tile38 setup
  const [tile38Client, setTile38Client] = useState<Tile38Connection>()
  // Theme setup
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode],);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <ToastContainer />
      {!tile38Client && <ConnectionManager onConnect={setTile38Client} />}
      {tile38Client && <Tile38Context.Provider value={tile38Client}>
        <Header />
        <PanelGroup direction="vertical" className='panel-container'>
          <Panel className='panel-top' minSize={10}>
            top
          </Panel>
          <PanelResizeHandle className='panel-handle' />
          <Panel className='panel-bottom' minSize={15}>
            <PanelBottom />
          </Panel>
        </PanelGroup>
      </Tile38Context.Provider>}     
    </ThemeProvider>
  )
}


import { useMemo } from 'react';
import './App.css'
import ConnectionManager from './components/ConnectionManager'
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import { ThemeProvider } from '@emotion/react';
import { createTheme, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { PanelBottom } from './components/PanelBottom';
import { useTile38 } from './lib/tile38Connection.store';
import { PanelTop } from './components/PanelTop';

export default function App() {
  // Tile38 setup
  const tile38 = useTile38();
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
      {!tile38.connection && <ConnectionManager onConnect={tile38.setConnection} />}
      {tile38.connection &&
        <>
          <Header />
          <PanelGroup direction="vertical" className='panel-container'>
            <Panel className='panel-top' minSize={10}>
              <PanelTop />
            </Panel>
            <PanelResizeHandle className='panel-handle' />
            <Panel className='panel-bottom' minSize={15}>
              <PanelBottom />
            </Panel>
          </PanelGroup>
        </>}
    </ThemeProvider>
  )
}


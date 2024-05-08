import { createContext, useMemo, useState } from 'react';
import './App.css'
import ConnectionManager from './components/ConnectionManager'
import { ToastContainer } from 'react-toastify';
import { Tile38Connection } from './lib/tile38Connection';
import Header from './components/Header';
import { ThemeProvider } from '@emotion/react';
import { createTheme, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

export default function App() {
  // Tile38 setup
  const Tile38Context = createContext<Tile38Connection | null>(null)
  const [tile38Client, setTile38Client] = useState<Tile38Connection | null>(null)
  // Theme setup
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode],);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme/>
      <ToastContainer />
      {!tile38Client && <ConnectionManager onConnect={setTile38Client} />}
      <Tile38Context.Provider value={tile38Client}>
        <Header />
      </Tile38Context.Provider>
    </ThemeProvider>
  )
}


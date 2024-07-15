import './App.css'
import ConnectionManager from './components/ConnectionManager'
import { ToastContainer } from 'react-toastify';
import CssBaseline from '@mui/material/CssBaseline';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { PanelBottom } from './components/PanelBottom';
import { useTile38 } from './lib/tile38Connection.store';
import { PanelTop } from './components/PanelTop';
import ThemeWrapper from './components/ThemeWrapper';

export default function App() {
  // Tile38 setup
  const tile38 = useTile38();

  return (
    <ThemeWrapper>
      <CssBaseline enableColorScheme />
      <ToastContainer />
      {!tile38.connection && <ConnectionManager onConnect={tile38.setConnection} />}
      {tile38.connection &&
        <PanelGroup direction="vertical" className='panel-container'>
          <Panel className='panel-top' minSize={10}>
            <PanelTop />
          </Panel>
          <PanelResizeHandle className='panel-handle' />
          <Panel className='panel-bottom' minSize={15}>
            <PanelBottom />
          </Panel>
        </PanelGroup>}
    </ThemeWrapper>
  )
}


import './App.css'
import ConnectionManager from './components/ConnectionManager'
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <ConnectionManager onConnect={() => {}}/>
      <ToastContainer />
    </>
  )
}

export default App

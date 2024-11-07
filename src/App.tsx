import './App.css';
import {Routes, Route} from "react-router-dom";
import Dashboard from './routes/Dashboard';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard></Dashboard>}>
        </Route>
      </Routes>
    </>
  )
}

export default App

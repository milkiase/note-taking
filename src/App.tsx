import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import Dashboard from './routes/Dashboard';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import { useSelector } from 'react-redux';
import { selectAccessToken } from './store/auth/auth.selectors';
import NavBar from './components/NavBar';

function App() {
  const accessToken = useSelector(selectAccessToken);
  return (
    <div className='w-screen h-screen'>
    {accessToken && <NavBar></NavBar>}
      <Routes>
        <Route path='/' element={accessToken ? <Dashboard></Dashboard> : <Navigate to="/sign-in"></Navigate>}>
        </Route>
        <Route path='/sign-in' element={<SignIn></SignIn>}>
        </Route>
        <Route path='/sign-up' element={<SignUp></SignUp>}>
        </Route>
      </Routes>
    </div>
  )
}

export default App

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import AuthLayout from './components/AuthLayout'
import Tickets from './pages/Ticket/Tickets'

function App() {

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route element={<AuthLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/tickets' element={<Tickets />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

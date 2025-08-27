import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import RequireAuth from './components/RequireAuth'
import Dashboard from './pages/Dashboard/Dashboard'
import AuthLayout from './components/AuthLayout'
import Tickets from './pages/Ticket/Tickets'
// import Ticket from './pages/Ticket/Ticket'
import Clients from './pages/Client/Clients'
import Client from './pages/Client/Client'
import Users from './pages/User/Users'
import User from './pages/User/User'
import Ticket from './pages/Ticket/Ticket'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route element={<AuthLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/tickets' element={<Tickets />} />
            <Route path='/tickets/:id' element={<Ticket />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/clients/:id' element={<Client />} />
            <Route path='/users' element={<Users />} />
            <Route path='/users/:id' element={<User />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/user/Home'
import Admin from './pages/admin/Admin'
import UserLayout from './shared/layouts/UserLayout'
import AdminLayout from './shared/layouts/AdminLayout'
import TicketManagement from './pages/admin/Ticket/TicketManagement'
import UserTicketList from './pages/user/UserTicketList'
import TicketDetail from './pages/user/TicketDetail'
import Login from './pages/Login'

function App() {

  return (
      <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route path='/login' element={<Login />} />
            
            {/* Customer */}
            <Route path='/' element={<UserLayout />}>
              <Route path='' element={<Home />} />
              <Route path='user/dashboard' element={<Home />} />
              <Route path='user/tickets' element={<UserTicketList />} />
              <Route path='user/tickets/:id' element={<TicketDetail />} />
              <Route path='user/tracking' element={<UserTicketList />} />
              <Route path='user/assigned' element={<UserTicketList />} />
              <Route path='user/settings' element={<div className="p-6 text-gray-100">Settings Page</div>} />
            </Route>
            
            {/* Admin */}
            <Route path='admin' element={<AdminLayout />}>
              <Route index={true} element={<Admin />} />
              <Route path='ticket' element={<TicketManagement />} />
            </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
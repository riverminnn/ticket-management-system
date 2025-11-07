import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './pages/user/Home'
import Admin from './pages/admin/Admin'
import UserLayout from './shared/layouts/UserLayout'
import AdminLayout from './shared/layouts/AdminLayout'
import Tickets from './pages/user/Tickets.tsx'
import AdminTickets from './pages/admin/Ticket/Tickets.tsx'
import AdminTicketDetail from './pages/admin/Ticket/Ticket.tsx'
import TicketDetail from './pages/user/Ticket.tsx'
import CreateTicket from "./pages/user/CreateTicket.tsx";
import Login from './pages/Login'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import GoogleCallback from './pages/GoogleCallback'
import DepartmentManagement from './pages/admin/Department/DepartmentManagement'
import ViewSwitcher from './shared/components/ViewSwitcher.tsx'

function App() {

  return (
      <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route path='/login' element={<Login />} />
            
            {/* Google Auth Callback - receives code from Google */}
            <Route path='/auth/google-callback' element={<GoogleCallback />} />
            
            {/* Google Auth Success - processes token */}
            <Route path='/google-auth-success' element={<GoogleAuthSuccess />} />
            
            {/* Customer */}
            <Route path='/' element={<UserLayout />}>
              <Route path='' element={<Home />} />
              <Route path='user' element={<Home />} />
              <Route path='user/dashboard' element={<Home />} />
              <Route path='user/tickets' element={<Tickets />} />
              <Route path='user/tickets/:id' element={<TicketDetail />} />
              <Route path="user/ticket/create" element={<CreateTicket />} />
              <Route path='user/tracking' element={<Tickets />} />
              <Route path='user/assigned' element={<Tickets />} />
              <Route path='user/settings' element={<div className="p-6 text-gray-100">Settings Page</div>} />
            </Route>
            
            {/* Admin */}
            <Route path='admin' element={<AdminLayout />}>
              <Route index={true} element={<Admin />} />
              <Route path='tickets' element={<AdminTickets />} />
              <Route path='tickets/:id' element={<AdminTicketDetail />} />
              <Route path='departments' element={<DepartmentManagement />} />
            </Route>
          </Routes>

          <ViewSwitcher />
      </BrowserRouter>
  )
}

export default App
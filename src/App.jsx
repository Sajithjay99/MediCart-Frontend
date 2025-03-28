import { BrowserRouter,Routes,Route } from 'react-router-dom'

import './App.css'
import AdminPage from './Pages/Admin/AdminPage'
import CustomerDashboard from './Pages/Customer/CustomerDashboard'
import Customerlogin from './Pages/Customer Login/customerlogin'
import toast, { Toaster } from 'react-hot-toast';
import Testing from './components/testing'

function App() {
  

  return (
    <BrowserRouter>
     <Toaster position='top-right' />
    <Routes>
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/customerlogin" element={<Customerlogin />} />
      <Route path="/testing" element={<Testing />} />
      <Route path="/*" element={<CustomerDashboard />} />
    </Routes>
  </BrowserRouter>
  
  )
}

export default App

import React from 'react'
 import Header from '../../components/header'
  import { Routes, Route } from 'react-router-dom'
import Customerlogin from '../Customer Login/customerlogin'
import CreateMedicine from './CreateMedicine'
import MyOrders from './MyOrders'
import UpdateOrders from './UpdateOrders'


function CustomerDashboard() {
  return (
    <div>
<div>

<Header/>
 
 

</div>

<Routes>
  <Route path="/" element={<h1>Home page</h1>} />
  <Route path="/shop" element={<h1>Shop page</h1>} />

  <Route path="/medicine" element={<CreateMedicine />} />
  <Route path="/profile/my-orders" element={<MyOrders/>} />

  
  



  <Route path="/reviews" element={<h1>Review page</h1>} />
  <Route path="/about" element={<h1>About page</h1>} />
  <Route path="/contactus" element={<h1>Contact page</h1>} />
  
</Routes>







<div>


</div>
 

      
    </div>
  )
}

export default CustomerDashboard

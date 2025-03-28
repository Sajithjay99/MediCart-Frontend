import React from 'react'
 import Header from '../../components/header'
  import { Routes, Route } from 'react-router-dom'
import ProductsCustomer from './Shop/ProductsCustomer'
import Customerlogin from '../Customer Login/customerlogin'
import ProductOverview from './Shop/ProductOverview'
import ProductCart from './Shop/ProductCart'
import HomePage from './Home/HomePage'

function CustomerDashboard() {
  return (
    <div>
<div>

<Header/>
 
 

</div>

<Routes>
  <Route path="/" element={<HomePage/>} />
  <Route path="/shop" element={<ProductsCustomer/>} />
  <Route path="/medicine" element={<h1>Medicine page</h1>} />
  <Route path="/reviews" element={<h1>Review page</h1>} />
  <Route path="/about" element={<h1>About page</h1>} />
  <Route path="/contactus" element={<h1>Contact page</h1>} />
  <Route path="/products/:id" element={<ProductOverview />} />
  <Route path="/cart" element={<ProductCart />} />


</Routes>







<div>


</div>
 

      
    </div>
  )
}

export default CustomerDashboard

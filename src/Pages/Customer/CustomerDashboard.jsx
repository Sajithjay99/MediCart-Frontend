import React from 'react'
 import Header from '../../components/header'
  import { Routes, Route } from 'react-router-dom'
import ProductsCustomer from './Shop/ProductsCustomer'
import Customerlogin from '../Customer Login/customerlogin'
import ProductOverview from './Shop/ProductOverview'
import ProductCart from './Shop/ProductCart'
import HomePage from './Home/HomePage'
import About from './Home/About'
import Footer from '../../components/Footer'
import ContactUs from './Home/contactUs'
import Checkout from './Shop/Checkout'

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
  <Route path="/about" element={<About/>} />
  <Route path="/contactus" element={<ContactUs/>} />
  <Route path="/products/:id" element={<ProductOverview />} />
  <Route path="/cart" element={<ProductCart />} />
  <Route path="/checkout" element={<Checkout />} />


</Routes>







<div>
<Footer/>


</div>
 

      
    </div>
  )
}

export default CustomerDashboard

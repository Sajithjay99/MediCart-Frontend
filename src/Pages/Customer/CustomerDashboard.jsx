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
import Header from '../../components/header'
import { Routes, Route } from 'react-router-dom'
import Customerlogin from '../Customer Login/customerlogin'
import Review from './Reviews/Review' 
import AddReview from './Reviews/AddReview'
import ViewOwnReview from './Reviews/ViewOwnReview'
import UpdateReview from './Reviews/UpdateReview'
import CreateMedicine from './CreateMedicine'
import MyOrders from './MyOrders'
import UpdateOrders from './UpdateOrders'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from '../../components/header';
import Profile from './profile/profile.jsx';





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
  <Route path="/reviews" element={<Review />} />
  <Route path="/about" element={<h1>About</h1>} />
  <Route path="/contactus" element={<h1>Contact page</h1>} />
  <Route path="/add-review" element={<AddReview />} />
  <Route path="/my-review" element={<ViewOwnReview />} />
  <Route path="/update-review/:id" element={<UpdateReview />} />
  <Route path="/medicine" element={<CreateMedicine />} />
  <Route path="/profile/my-orders" element={<MyOrders/>} />
  <Route path="/reviews" element={<h1>Review page</h1>} />
  <Route path="/about" element={<About/>} />
  <Route path="/contactus" element={<ContactUs/>} />
  <Route path="/products/:id" element={<ProductOverview />} />
  <Route path="/cart" element={<ProductCart />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/about" element={<h1>About page</h1>} />
  <Route path="/contactus" element={<h1>Contact page</h1>} />

  

</Routes>







<div>
<Footer/>


</div>
 

      
    <div className="customer-dashboard-container">
      {/* Header Section */}
      <Header />



      {/* Main content area */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<h1>Home page</h1>} />
          <Route path="/shop" element={<h1>Shop page</h1>} />
          <Route path="/medicine" element={<h1>Medicine page</h1>} />
          <Route path="/reviews" element={<h1>Review page</h1>} />
          <Route path="/about" element={<h1>About page</h1>} />
          <Route path="/contactus" element={<h1>Contact page</h1>} />
          <Route path="/profile" element={< Profile/>} /> {/* Profile page route */}
        </Routes>
      </div>
    </div>
  );
}

export default CustomerDashboard;

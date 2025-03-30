import React from 'react'
import Header from '../../components/header'
import { Routes, Route } from 'react-router-dom'
import Customerlogin from '../Customer Login/customerlogin'
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

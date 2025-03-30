import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/Footer';

import ProductsCustomer from './Shop/ProductsCustomer';
import Customerlogin from '../Customer Login/customerlogin';
import ProductOverview from './Shop/ProductOverview';
import ProductCart from './Shop/ProductCart';
import HomePage from './Home/HomePage';
import About from './Home/About';
import ContactUs from './Home/contactUs';
import Checkout from './Shop/Checkout';

import Review from './Reviews/Review';
import AddReview from './Reviews/AddReview';
import ViewOwnReview from './Reviews/ViewOwnReview';
import UpdateReview from './Reviews/UpdateReview';

import CreateMedicine from './CreateMedicine';
import MyOrders from './MyOrders';
import UpdateOrders from './UpdateOrders';
import Profile from './profile/profile.jsx';

function CustomerDashboard() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductsCustomer />} />
        <Route path="/products/:id" element={<ProductOverview />} />
        <Route path="/cart" element={<ProductCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/reviews" element={<Review />} />
        <Route path="/add-review" element={<AddReview />} />
        <Route path="/profile/my-review" element={<ViewOwnReview />} />
        <Route path="/update-review/:id" element={<UpdateReview />} />
        <Route path="/medicine" element={<CreateMedicine />} />
        <Route path="/profile/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Customerlogin />} />
        {/* Add any other routes below as needed */}
      </Routes>

      <Footer />
    </div>
  );
}

export default CustomerDashboard;

import React from 'react'
 import Header from '../../components/header'
  import { Routes, Route } from 'react-router-dom'
import Customerlogin from '../Customer Login/customerlogin'
import Review from './Reviews/Review' 
import AddReview from './Reviews/AddReview'
import ViewOwnReview from './Reviews/ViewOwnReview'
import UpdateReview from './Reviews/UpdateReview'


function CustomerDashboard() {
  return (
    <div>
<div>

<Header/>
 
 

</div>

<Routes>
  <Route path="/" element={<h1>Home page</h1>} />
  <Route path="/shop" element={<h1>Shop page</h1>} />
  <Route path="/medicine" element={<h1>Medicine page</h1>} />
  <Route path="/reviews" element={<Review />} />
  <Route path="/about" element={<h1>About</h1>} />
  <Route path="/contactus" element={<h1>Contact page</h1>} />
  <Route path="/add-review" element={<AddReview />} />
  <Route path="/my-review" element={<ViewOwnReview />} />
  <Route path="/update-review/:id" element={<UpdateReview />} />
  
</Routes>







<div>


</div>
 

      
    </div>
  )
}

export default CustomerDashboard

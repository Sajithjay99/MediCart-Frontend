import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';  

function Review() {
  const [reviews, setReviews] = useState([]);

  // Fetch approved reviews for customers
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/reviews/getallapprove', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setReviews(response.data);
      })
      .catch((err) => {
        toast.error('Failed to fetch reviews');
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>

      
      <div className="mb-6">
        <Link to="/add-review">
          <button className="bg-blue-500/90 text-white px-6 py-2 rounded-md hover:bg-black">
            Create Review
          </button>
        </Link>
      </div>

      {/* Display Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-[#22617c] text-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            
            <div className="flex items-center mb-4">
               
              <img
                src={review.profilePicture}
                // alt={review.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              
              <div>
                <div>{review.name}</div>
                <div>{review.email}</div>
              </div>
            </div>

            
            <div className="mb-2">{review.reviewType}</div>

            
            <div className="mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`${
                      i < review.rating ? 'text-yellow-500' : 'text-gray-400'
                    } text-lg`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            
            <div className="mb-2">{review.comment}</div>

             
            {review.image && (
              <div className="mb-2">
                <img
                  src={review.image}
                  alt="Review Image"
                  className="w-full h-48 object-cover rounded-lg mt-2"
                />
              </div>
            )}

             
            <div className="mb-2">{new Date(review.date).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;

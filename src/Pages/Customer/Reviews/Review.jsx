import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

function Review() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/reviews/getallapprove')
      .then((response) => {
        setReviews(response.data);
      })
      .catch(() => {
        toast.error('Failed to fetch reviews');
      });
  }, []);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customer Reviews</h1>
        <Link to="/add-review">
          <button className="bg-blue-600 hover:bg-blue-800 text-white px-5 py-2 rounded-md transition duration-200 shadow">
            Create Review
          </button>
        </Link>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="group relative  border border-gray-200 rounded-lg shadow-sm p-4 text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-xl bg-blue-50"
          >
            {/* Profile image */}
            <div className="flex justify-center -mt-12 mb-2">
              <img
                src={review.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white object-cover shadow"
              />
            </div>

            {/* Name + Email */}
            <div>
              <h3 className="font-semibold text-gray-800 text-base">{review.name}</h3>
              <p className="text-sm text-gray-500">{review.email}</p>
            </div>

            {/* Review Type */}
            <div className="mt-1">
              <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-0.5 rounded-full">
                {review.reviewType}
              </span>
            </div>

            {/* Stars - centered and animated */}
            <div className="flex justify-center items-center mt-2 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  } text-xl transition-transform duration-200 group-hover:scale-110`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 text-sm mt-2 line-clamp-3">{review.comment}</p>

            {/* Optional Image */}
            {review.image && (
              <div className="mt-2">
                <img
                  src={review.image}
                  alt="Review"
                  className="w-full h-32 object-cover rounded-md border"
                />
              </div>
            )}

            {/* Date */}
            <div className="text-xs text-gray-400 mt-2">
              {new Date(review.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;

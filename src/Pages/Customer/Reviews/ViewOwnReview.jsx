import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ViewOwnReview() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  // Fetch user's own reviews
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/reviews/getownreviews', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setReviews(response.data.data);
      })
      .catch((err) => {
        toast.error('Failed to fetch your reviews');
      });
  }, []);

  // Handle delete review
  const handleDeleteReview = (id) => {
    axios
      .delete(`http://localhost:5000/api/reviews/deletebycustomer/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        toast.success('Review deleted');
        setReviews(reviews.filter((review) => review._id !== id)); // Update state immediately
      })
      .catch(() => {
        toast.error('Failed to delete review');
      });
  };

  // Handle navigate to update review page
  const handleUpdateClick = (review) => {
    
    navigate(`/update-review/${review._id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Your Reviews</h1>

      {/* Reviews Table */}
      <table className="min-w-full border-collapse border border-gray-300" style={{ tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th className="border p-2 w-1/6">Review Type</th>
            <th className="border p-2 w-1/6">Rating</th>
            <th className="border p-2 w-1/6">Comment</th>
            <th className="border p-2 w-1/6">Image</th>
            <th className="border p-2 w-1/6">Date</th>
            <th className="border p-2 w-1/6">Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">No reviews found</td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr key={review._id}>
                <td className="border p-2">{review.reviewType}</td>
                <td className="border p-2">{review.rating}</td>
                <td className="border p-2">{review.comment}</td>
                <td className="border p-2">
                  {review.image && (
                    <img
                      src={review.image}
                      alt="Review Image"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </td>
                <td className="border p-2">{new Date(review.date).toLocaleDateString()}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleUpdateClick(review)}
                    className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewOwnReview;

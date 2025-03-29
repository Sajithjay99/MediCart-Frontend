import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

function ViewOwnReview() {
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewToUpdate, setReviewToUpdate] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({
    reviewType: '',
    rating: '',
    comment: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null); // State for storing the uploaded image
  const [errors, setErrors] = useState({});  

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
        setReviews(reviews.filter((review) => review._id !== id));
      })
      .catch(() => {
        toast.error('Failed to delete review');
      });
  };

  // Handle open modal to update review
  const handleUpdateClick = (review) => {
    setReviewToUpdate(review);
    setUpdatedReview({
      reviewType: review.reviewType,
      rating: review.rating,
      comment: review.comment,
      image: review.image,
    });
    setModalOpen(true);
  };

  // Handle update form input change
  const handleInputChange = (e) => {
    setUpdatedReview({
      ...updatedReview,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input change (image upload)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedReview({
          ...updatedReview,
          image: reader.result,  
        });
      };
      reader.readAsDataURL(file);  
    }
  };

  // Validation function
  const validateForm = () => {
    const validationErrors = {};

    
    if (updatedReview.rating < 1 || updatedReview.rating > 5) {
      validationErrors.rating = 'Rating must be between 1 and 5';
    }

    
    if (!updatedReview.comment || updatedReview.comment.trim() === '') {
      validationErrors.comment = 'Comment is required and cannot be empty or just spaces';
    }

    
    if (!updatedReview.reviewType) {
      validationErrors.reviewType = 'Review type is required';
    }

     
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

     
    if (!validateForm()) {
      return; // If validation fails, don't proceed with form submission
    }

    const formData = new FormData();
    formData.append('reviewType', updatedReview.reviewType);
    formData.append('rating', updatedReview.rating);
    formData.append('comment', updatedReview.comment);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    axios
      .put(`http://localhost:5000/api/reviews/updatebycustomer/${reviewToUpdate._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        toast.success('Review updated');
        setReviews(
          reviews.map((review) =>
            review._id === reviewToUpdate._id ? { ...review, ...updatedReview } : review
          )
        );
        setModalOpen(false);
      })
      .catch(() => {
        toast.error('Failed to update review');
      });
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

      {/* Modal for Update */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Update Review</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Review Type</label>
                <select
                  name="reviewType"
                  value={updatedReview.reviewType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Customer Service">Customer Service</option>
                  <option value="Delivery Service">Delivery Service</option>
                  <option value="Online Ordering Experience">Online Ordering Experience</option>
                  <option value="Medication Quality">Medication Quality</option>
                  <option value="Price of Medication">Price of Medication</option>
                  <option value="Other">Other</option>
                </select>
                {errors.reviewType && <p className="text-red-500 text-sm">{errors.reviewType}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={updatedReview.rating}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2">Comment</label>
                <textarea
                  name="comment"
                  value={updatedReview.comment}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {updatedReview.image && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Image Preview</h4>
                    <img
                      src={updatedReview.image}
                      alt="Review Preview"
                      className="w-32 h-32 object-cover rounded-lg mt-2"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewOwnReview;

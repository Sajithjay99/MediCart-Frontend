import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ViewOwnReview() {
  const [reviews, setReviews] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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
      .catch(() => {
        toast.error('Failed to fetch your reviews');
      });
  }, []);

  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setDeleteTargetId(null);
    setShowModal(false);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:5000/api/reviews/deletebycustomer/${deleteTargetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        toast.success('Review deleted successfully');
        setReviews((prev) => prev.filter((r) => r._id !== deleteTargetId));
        closeModal();
      })
      .catch(() => {
        toast.error('Failed to delete review');
        closeModal();
      });
  };

  const handleUpdateClick = (review) => {
    navigate(`/update-review/${review._id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Your Reviews</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-400 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 px-4 py-2 text-left">Review Type</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Rating</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Comment</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Image</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-400 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500 border border-gray-400">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review, index) => (
                <tr key={review._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-400 px-4 py-2">{review.reviewType}</td>
                  <td className="border border-gray-400 px-4 py-2">{review.rating}</td>
                  <td className="border border-gray-400 px-4 py-2">{review.comment}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    {review.image && (
                      <img
                        src={review.image}
                        alt="Review"
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    )}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleUpdateClick(review)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => openDeleteModal(review._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-5 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this review?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewOwnReview;

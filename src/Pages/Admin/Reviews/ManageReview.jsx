import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';

function ManageReview() {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch reviews
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/reviews/getall', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setReviews(response.data);
      })
      .catch(() => {
        toast.error('Failed to fetch reviews');
      });
  }, []);

  // Filter
  const filteredReviews = reviews.filter((review) => {
    return (
      review.reviewType.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (review.recommendation ? 'Yes' : 'No').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Approve review
  const handleApproveReview = (id) => {
    axios
      .put(`http://localhost:5000/api/reviews/updatebyadmin/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        toast.success('Review approved');
        setReviews(reviews.map((review) => review._id === id ? { ...review, isApproved: true } : review));
      })
      .catch(() => {
        toast.error('Failed to approve review');
      });
  };

  // Open delete modal
  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setShowDeleteModal(false);
  };

  // Confirm deletion
  const confirmDeleteReview = () => {
    axios
      .delete(`http://localhost:5000/api/reviews/deletebyadmin/${deleteTargetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        toast.success('Review deleted');
        setReviews(reviews.filter((review) => review._id !== deleteTargetId));
        closeDeleteModal();
      })
      .catch(() => {
        toast.error('Failed to delete review');
        closeDeleteModal();
      });
  };

  // View modal
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text("Reviews Report", 14, 10);

    let yPosition = 20;

    doc.text("Email", 14, yPosition);
    doc.text("Rating", 58, yPosition);
    doc.text("Comment", 75, yPosition);
    doc.text("Review Type", 120, yPosition);
    doc.text("Recommendation", 180, yPosition);

    yPosition += 8;

    filteredReviews.forEach((review) => {
      doc.text(review.email, 14, yPosition);
      doc.text(String(review.rating), 58, yPosition);
      const commentLines = doc.splitTextToSize(review.comment, 50);
      doc.text(commentLines, 75, yPosition);
      doc.text(review.reviewType, 120, yPosition);
      doc.text(review.recommendation ? 'Yes' : 'No', 185, yPosition);
      yPosition += commentLines.length * 4 + 6;
    });

    doc.save("reviews_report.pdf");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Reviews</h1>

      {/* Search + PDF */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search by Review Type or Recommendation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleGeneratePDF}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
        >
          Generate PDF
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Review Type</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Comment</th>
            <th className="border p-2">Recommendation</th>
            <th className="border p-2">Approved</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((review) => (
            <tr key={review._id}>
              <td className="border p-2">{review.name}</td>
              <td className="border p-2">{review.reviewType}</td>
              <td className="border p-2">{review.rating}</td>
              <td className="border p-2">{review.comment}</td>
              <td className="border p-2">{review.recommendation ? 'Yes' : 'No'}</td>
              <td className="border p-2">{review.isApproved ? 'Yes' : 'No'}</td>
              <td className="border p-2 flex gap-2">
                {!review.isApproved && (
                  <button
                    onClick={() => handleApproveReview(review._id)}
                    className="bg-blue-500 text-white py-1 px-4 rounded"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => openDeleteModal(review._id)}
                  className="bg-red-500 text-white py-1 px-4 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewReview(review)}
                  className="bg-gray-500 text-white py-1 px-4 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Review Details</h2>
            <div>
              <p><strong>Name:</strong> {selectedReview.name}</p>
              <p><strong>Email:</strong> {selectedReview.email}</p>
              <p><strong>Rating:</strong> {selectedReview.rating}</p>
              <p><strong>Comment:</strong> {selectedReview.comment}</p>
              <p><strong>Review Type:</strong> {selectedReview.reviewType}</p>
              <p><strong>Recommendation:</strong> {selectedReview.recommendation ? 'Yes' : 'No'}</p>
              <p><strong>Approved:</strong> {selectedReview.isApproved ? 'Yes' : 'No'}</p>
              <p><strong>Profile Picture:</strong> <img src={selectedReview.profilePicture} alt="Profile" className="w-16 h-16 rounded-full" /></p>
              {selectedReview.image && (
                <p><strong>Image:</strong> <img src={selectedReview.image} alt="Review Image" className="w-32 h-32" /></p>
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50  bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this review?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteReview}
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

export default ManageReview;

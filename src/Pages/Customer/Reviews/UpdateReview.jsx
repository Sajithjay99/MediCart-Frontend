import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import mediaUpload from '../../../utils/mediaupload';
 
function UpdateReview() {
  const { id } = useParams();
  const [review, setReview] = useState({});
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState(false);
  const [image, setImage] = useState(null);
  const [reviewType, setReviewType] = useState('');
  const [commentError, setCommentError] = useState('');
  const [ratingError, setRatingError] = useState('');
  const navigate = useNavigate();
 
  // Fetch review data for updating
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/customerlogin');
      return; // Redirect to login if no token exists
    }
 
    // Ensure id is not empty before fetching
    if (!id) {
      toast.error('No review ID provided');
      navigate('/reviews');
      return;
    }
 
    axios
      .get(`http://localhost:5000/api/reviews//getOwnOneReview/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        const reviewData = response.data;
 
        // Check if the review data is correct
        if (reviewData) {
          setReview(reviewData);
          setComment(reviewData.comment || '');
          setRating(reviewData.rating || 0);    
          setRecommendation(reviewData.recommendation || false);
          setImage(reviewData.image || null);
          setReviewType(reviewData.reviewType || '');
        } else {
          toast.error('Review not found');
          navigate('/reviews');
        }
      })
      .catch((err) => {
        toast.error('Failed to fetch review for updating');
        console.error("Error fetching review:", err);
      });
  }, [id, navigate]); // Only run when `id` or `navigate` changes
 
  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the image file
    }
  };
 
  // Handle update review form submission
  const handleUpdateReview = async (e) => {
    e.preventDefault();
 
    // Validation checks
    if (rating === 0) {
      setRatingError('Rating is required');
      return;
    }
 
    if (comment === '') {
      setCommentError('Comment is required');
      return;
    }
 
    let imageUrl = '';
 
    // If image is uploaded, handle the image upload
    if (image) {
      const uploadResult = await mediaUpload(image);
      if (uploadResult.error) {
        toast.error(uploadResult.message);
        return;
      }
      imageUrl = uploadResult.url;
    }
 
    // Prepare the updated review data
    const updatedReview = {
      rating,
      comment,
      recommendation,
      reviewType,
      image: imageUrl || review.image, // Use existing image if no new image is uploaded
    };
 
    try {
      await axios.put(`http://localhost:5000/api/reviews/updatebycustomer/${id}`, updatedReview, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Review updated successfully');
      navigate('/reviews'); // Redirect after success
    } catch (err) {
      toast.error('Failed to update review');
      console.error("Error updating review:", err);
    }
  };
 
  // Handle comment change
  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    setComment(newComment);
 
    if (newComment.length > 100) {
      setCommentError('Comment cannot exceed 100 characters');
    } else {
      setCommentError('');
    }
  };
 
  // Handle rating change
  const handleRatingChange = (star) => {
    setRating(star);
    setRatingError(''); // Reset error when rating is changed
  };
 
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Review</h1>
 
      <form onSubmit={handleUpdateReview} className="space-y-4">
        {/* Rating (Editable) */}
        <div>
          <label className="block text-sm font-semibold">Rating (1-5)</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`${rating >= star ? 'text-yellow-500' : 'text-gray-400'} text-xl`}
              >
                ★
              </button>
            ))}
          </div>
          {ratingError && <p className="text-red-500">{ratingError}</p>}
        </div>
 
        {/* Comment (Editable) */}
        <div>
          <label className="block text-sm font-semibold">Comment</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Update your comment here"
            required
          />
          {commentError && <p className="text-red-500">{commentError}</p>}
        </div>
 
        {/* Review Type (Editable) */}
        <div>
          <label className="block text-sm font-semibold">Review Type</label>
          <select
            value={reviewType}
            onChange={(e) => setReviewType(e.target.value)}
            className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
          >
            <option value="Customer Service">Customer Service</option>
            <option value="Delivery Service">Delivery Service</option>
            <option value="Online Ordering Experience">Online Ordering Experience</option>
            <option value="Medication Quality">Medication Quality</option>
            <option value="Price of Medication">Price of Medication</option>
            <option value="Other">Other</option>
          </select>
        </div>
 
        {/* Would you recommend this? */}
        <div>
          <label className="block text-sm font-semibold">Would you recommend this?</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="yes"
                checked={recommendation === true}
                onChange={() => setRecommendation(true)}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={recommendation === false}
                onChange={() => setRecommendation(false)}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
 
        {/* Image (Editable) */}
        <div>
          <label className="block text-sm font-semibold">Upload Image (optional)</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
 
        {/* Display the image if available */}
        {image && (
          <div className="mt-4">
            <p>Selected Image:</p>
            <img src={URL.createObjectURL(image)} alt="Selected Review Image" className="w-32 h-32 object-cover mt-2" />
          </div>
        )}
 
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Update Review
          </button>
        </div>
      </form>
    </div>
  );
}
 
export default UpdateReview;
 
 
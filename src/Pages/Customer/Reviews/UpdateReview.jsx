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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/customerlogin');
      return;
    }

    if (!id) {
      toast.error('No review ID provided');
      navigate('/reviews');
      return;
    }

    axios
      .get(`http://localhost:5000/api/reviews/getOwnOneReview/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        const reviewData = response.data;
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
      .catch(() => {
        toast.error('Failed to fetch review for updating');
      });
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setRatingError('Rating is required');
      return;
    }

    if (comment === '') {
      setCommentError('Comment is required');
      return;
    }

    let imageUrl = '';
    if (image) {
      const uploadResult = await mediaUpload(image);
      if (uploadResult.error) {
        toast.error(uploadResult.message);
        return;
      }
      imageUrl = uploadResult.url;
    }

    const updatedReview = {
      rating,
      comment,
      recommendation,
      reviewType,
      image: imageUrl || review.image,
    };

    try {
      await axios.put(`http://localhost:5000/api/reviews/updatebycustomer/${id}`, updatedReview, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Review updated successfully');
      navigate('/reviews');
    } catch (err) {
      toast.error('Failed to update review');
    }
  };

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    setComment(newComment);

    if (newComment.length > 100) {
      setCommentError('Comment cannot exceed 100 characters');
    } else {
      setCommentError('');
    }
  };

  const handleRatingChange = (star) => {
    setRating(star);
    setRatingError('');
  };

  return (
    <div className="p-6 max-w-xl mx-auto border border-gray-300 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Your Review</h1>

      <form onSubmit={handleUpdateReview} className="space-y-6">
        {/* Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Rating (1-5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-xl ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                ★
              </button>
            ))}
          </div>
          {ratingError && <p className="text-red-500 text-sm">{ratingError}</p>}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Comment</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Write your comment here"
            required
          />
          {commentError && <p className="text-red-500 text-sm">{commentError}</p>}
        </div>

        {/* Review Type */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Review Type</label>
          <select
            value={reviewType}
            onChange={(e) => setReviewType(e.target.value)}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
          >
            <option value="">Select Review Type</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Delivery Service">Delivery Service</option>
            <option value="Online Ordering Experience">Online Ordering Experience</option>
            <option value="Medication Quality">Medication Quality</option>
            <option value="Price of Medication">Price of Medication</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Recommendation */}
        <div className="space-y-2">
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

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Upload Image (optional)</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Display the image if available */}
        {image && (
          <div className="mt-4">
            <p>Selected Image:</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Selected Review Image"
              className="w-32 h-32 object-cover mt-2"
            />
          </div>
        )}

        {/* Submit Button */}
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

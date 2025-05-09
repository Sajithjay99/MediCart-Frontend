import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import mediaUpload from '../../../utils/mediaupload';

function UpdateReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState(false);
  const [reviewType, setReviewType] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [commentError, setCommentError] = useState('');
  const [ratingError, setRatingError] = useState('');

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
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const review = res.data.data;
        if (review) {
          setComment(review.comment || '');
          setRating(review.rating || 0);
          setRecommendation(review.recommendation ?? false);
          setReviewType(review.reviewType || '');
          setPreviewImage(review.image || null);
        } else {
          toast.error('Review not found');
          navigate('/reviews');
        }
      })
      .catch(() => {
        toast.error('Failed to fetch review');
      });
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
    setCommentError(value.length > 100 ? 'Comment cannot exceed 100 characters' : '');
  };

  const handleRatingChange = (star) => {
    setRating(star);
    setRatingError('');
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (rating === 0) {
      setRatingError('Rating is required');
      toast.error('Rating is required');
      hasError = true;
    }

    if (!comment.trim()) {
      setCommentError('Comment is required');
      toast.error('Comment is required');
      hasError = true;
    }

    if (comment.length > 100) {
      setCommentError('Comment cannot exceed 100 characters');
      toast.error('Comment cannot exceed 100 characters');
      hasError = true;
    }

    if (hasError) return;

    let imageUrl = previewImage;

    if (image) {
      const uploadResult = await mediaUpload(image);
      if (uploadResult.error) {
        toast.error(uploadResult.message);
        return;
      }
      imageUrl = uploadResult.url;
    } else if (!previewImage) {
      imageUrl = null;
    }

    const updatedReview = {
      rating,
      comment,
      recommendation,
      reviewType,
      image: imageUrl,
    };

    try {
      await axios.put(
        `http://localhost:5000/api/reviews/updatebycustomer/${id}`,
        updatedReview,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Review updated successfully!');
      navigate('/profile/my-review');
    } catch (err) {
      toast.error('Failed to update review');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto border border-gray-300 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Your Review</h1>

      <form onSubmit={handleUpdateReview} className="space-y-6">
        {/* Rating */}
        <div>
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
        <div>
          <label className="block text-sm font-semibold">Comment</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Write your comment here"
          />
          {commentError && <p className="text-red-500 text-sm">{commentError}</p>}
        </div>

        {/* Review Type */}
        <div>
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
        <div>
          <label className="block text-sm font-semibold">Would you recommend this?</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                checked={recommendation === true}
                onChange={() => setRecommendation(true)}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                checked={recommendation === false}
                onChange={() => setRecommendation(false)}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Upload New Image */}
        <div>
          <label className="block text-sm font-semibold">Upload Image (optional)</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Image Preview with Red Cross */}
        {previewImage && (
          <div className="relative inline-block mt-4">
            <img
              src={previewImage}
              alt="Review"
              className="w-32 h-32 object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 shadow"
              title="Remove Image"
            >
              ×
            </button>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end mt-6">
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

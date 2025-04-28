import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import mediaUpload from '../../../utils/mediaupload'; // Import the mediaUpload function

function AddReview() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [reviewType, setReviewType] = useState('Customer Service');
  const [recommendation, setRecommendation] = useState(false);
  const [image, setImage] = useState(null);
  const [commentError, setCommentError] = useState('');
  const [ratingError, setRatingError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/customerlogin');
    }

    const decodedToken = jwtDecode(token);
    setUserName(decodedToken.firstName + ' ' + decodedToken.lastName);
    setUserEmail(decodedToken.email);
    setProfilePic(decodedToken.profilePicture || '/path/to/default-profile-pic.jpg');
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, [navigate]);

  // Handle form submit
  const handleSubmit = async (e) => {
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

    if (comment.length > 100) {
      setCommentError('Comment cannot exceed 100 characters');
      return;
    }

    let imageUrl = '';

     
    if (image) {
      const uploadResult = await mediaUpload(image);
      if (uploadResult.error) {
        toast.error(uploadResult.message);
        console.error(uploadResult.message);
        return;
      }
      imageUrl = uploadResult.url;
      console.log('Uploaded Image URL:', imageUrl);
    }

    // Review data to be sent
    const reviewData = {
      rating,
      comment,
      name: userName,
      email: userEmail,
      profilePiccture: profilePic,
      date: currentDate,
      reviewType,
      recommendation,
      image: imageUrl || null,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/reviews/add', reviewData, {
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Review added successfully!');
      navigate('/reviews');
    } catch (err) {
      console.error('Error adding review:', err);
      toast.error('Failed to add review: ' + err.response?.data?.message || err.message);
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

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);  
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 flex justify-center items-center">
  <div className="bg-white p-9 rounded-lg shadow-lg w-full max-w-lg flex items-start relative">
    {/* Profile Image */}
    <div className="w-1/8 flex justify-center items-center mb-4 absolute right-25 top-5">
      <img
        src={profilePic}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover mt-1 border-2 border-gray-300"
      />
    </div>

    <div className="w-4/5">
      <h1 className="text-2xl font-bold mb-4">Add Your Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold">Name</label>
          <input
            type="text"
            value={userName}
            disabled
            className="w-[400px] p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="w-[400px] p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Review Type */}
        <div>
          <label className="block text-sm font-semibold">Review Type</label>
          <select
            value={reviewType}
            onChange={(e) => setReviewType(e.target.value)}
            className="w-[400px] p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
          >
            <option value="Customer Service">Customer Service</option>
            <option value="Delivery Service">Delivery Service</option>
            <option value="Online Ordering Experience">Online Ordering Experience</option>
            <option value="Medication Quality">Medication Quality</option>
            <option value="Price of Medication">Price of Medication</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Rating */}
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

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold">Comment</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            className="w-[400px] p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Write your comment here..."
            //required
          />
          {commentError && <p className="text-red-500">{commentError}</p>}
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

        {/* Upload Image (optional) */}
        <div>
          <label className="block text-sm font-semibold">Upload Image (optional)</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-[400px] p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold">Date</label>
          <input
            type="date"
            value={currentDate}
            disabled
            className="w-[400px] p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
}

export default AddReview;



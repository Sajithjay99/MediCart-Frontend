import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 
import mediaUpload from '../../../utils/mediaupload'; 

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        profilePicture: ''
    });
    const [isAdmin, setIsAdmin] = useState(false);  
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login");
            return;
        }

        
        axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const user = response.data[0];  
            setUserData(user);
            setIsAdmin(user.role === 'admin');  

            setEditFormData({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                profilePicture: user.profilePicture
            });
        })
        .catch(err => {
            console.error("Error fetching user data:", err);
            navigate("/login");
        });
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewProfilePicture(file);
    };

    const handleProfilePictureUpload = async () => {
        if (!newProfilePicture) return;

        const result = await mediaUpload(newProfilePicture);

        if (result.error) {
            console.error(result.message);
            toast.error("Failed to upload profile picture.");
            return;
        }

        setUserData(prevData => ({ ...prevData, profilePicture: result.url }));

        const token = localStorage.getItem('token');
        axios.put(`http://localhost:5000/api/users/edit/${userData._id}`, { profilePicture: result.url }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            toast.success('Profile picture updated successfully!');
        })
        .catch(err => {
            console.error("Error updating profile picture:", err);
            toast.error('Failed to update profile picture.');
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveChanges = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token is missing");
            return;
        }

        axios.put(`http://localhost:5000/api/users/edit/${userData._id}`, editFormData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setUserData(response.data.user); 
            setIsEditing(false); 
            toast.success('Profile updated successfully');
        })
        .catch(err => {
            console.error("Error updating user:", err);
            toast.error("Failed to update profile.");
        });
    };

    const handleDeleteProfile = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const isConfirmed = window.confirm("Are you sure you want to delete your profile?");
        if (!isConfirmed) return;

        axios.delete(`http://localhost:5000/api/users/delete/${userData._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            toast.success('Profile deleted successfully');
            localStorage.removeItem('token');
            navigate("/login");
        })
        .catch(err => {
            console.error("Error deleting user:", err);
            toast.error("Failed to delete profile.");
        });
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        
            {!isAdmin && (
                <div className="flex justify-start mb-6 space-x-4">
                    <button 
                        onClick={() => navigate("/profile/my-orders")} 
                        className="px-6 py-3 bg-blue-500/90 text-white rounded-md hover:bg-black"
                    >
                        My Orders
                    </button>
                    <button 
                        onClick={() => navigate("/profile/my-review")} 
                        className="px-6 py-3 bg-black text-white rounded-md hover:bg-blue-500/90"
                    >
                        My Reviews
                    </button>
                </div>
            )}

            <h1 className="text-3xl font-semibold mb-6">Edit Profile</h1>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {isEditing ? (
                        <>
                            <strong>First Name</strong>
                            <input
                                aria-label="First Name"
                                type="text"
                                name="firstname"
                                value={editFormData.firstname}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md"
                                placeholder="Enter your first name"
                            />
                            <strong>Last Name</strong>
                            <input
                                aria-label="Last Name"
                                type="text"
                                name="lastname"
                                value={editFormData.lastname}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md"
                                placeholder="Enter your last name"
                            />
                            <strong>Email</strong>
                            <input
                                aria-label="Email"
                                type="email"
                                name="email"
                                value={editFormData.email}
                                className="w-full px-4 py-2 border rounded-md"
                                placeholder="Enter your email"
                                readOnly
                            />
                            <strong>Phone</strong>
                            <input
                                aria-label="Phone"
                                type="text"
                                name="phone"
                                value={editFormData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md"
                                placeholder="Enter your phone number"
                            />
                            <button 
                                onClick={handleSaveChanges} 
                                className="w-1/4 mt-4 px-4 py-2 bg-blue-500/90 text-white rounded-md hover:bg-black text-md"
                            >
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-2xl font-semibold">{userData?.firstname} {userData?.lastname}</p>
                            <p className="text-lg"><strong>Email:</strong> {userData?.email}</p>
                            <p className="text-lg"><strong>Phone:</strong> {userData?.phone}</p>
                        </div>
                    )}
                </div>

                
                <div className="flex justify-center items-center">
                    <div className="w-32 h-32 flex justify-center items-center rounded-full border-4 border-gray-200 overflow-hidden">
                        <img 
                            src={userData?.profilePicture} 
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {isEditing && (
                        <div className="mt-4">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="block w-full text-sm"
                            />
                            <button 
                                onClick={handleProfilePictureUpload} 
                                className="w-3/4 mt-2 px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-600 text-md"
                            >
                                Upload Profile Picture
                            </button>
                        </div>
                    )}
                </div>
            </div>

            
            <div className="flex justify-between mt-8 space-x-4">
                <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className="w-1/4 px-2 py-1 bg-blue-500/90 text-white rounded-md hover:bg-black text-md"
                >
                    {isEditing ? "Back" : "Edit Profile"}
                </button>
                <button 
                    onClick={handleDeleteProfile} 
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-md"
                >
                    Delete Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;

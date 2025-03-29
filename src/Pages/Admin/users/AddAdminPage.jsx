import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    role: 'admin',  
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem('token');  

  
  useEffect(() => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phone: '',
      role: 'admin',
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccessMessage(''); 

    const { firstname, lastname, email, password, phone } = formData;

    // Check if all fields are filled
    if (!firstname || !lastname || !email || !password || !phone) {
      setError('All fields are required.');
      toast.error('All fields are required.');
      return;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email.');
      toast.error('Please enter a valid email.');
      return;
    }

    // Validate password (minimum 6 characters)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    // Validate phone number (only numbers, minimum 10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      
      const response = await axios.post(
        'http://localhost:5000/api/users/register',  
        formData
        
      );

      setSuccessMessage('Admin added successfully!');
      toast.success('Admin added successfully!');
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        role: 'admin',
      });
    } catch (err) {
      setError('Error adding admin. Please try again.');
      toast.error('Error adding admin. Please try again.');
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-center mb-6">Add New Admin</h2>

      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="flex flex-col">
          <label htmlFor="firstname" className="text-lg font-medium text-gray-700 mb-2 text-left">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="Enter first name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

       
        <div className="flex flex-col">
          <label htmlFor="lastname" className="text-lg font-medium text-gray-700 mb-2 text-left">Last Name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Enter last name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg font-medium text-gray-700 mb-2 text-left">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
        <div className="flex flex-col">
          <label htmlFor="password" className="text-lg font-medium text-gray-700 mb-2 text-left">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-lg font-medium text-gray-700 mb-2 text-left">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
        <div className="flex flex-col">
          <label htmlFor="role" className="text-lg font-medium text-gray-700 mb-2 text-left">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="admin">Admin</option>
          </select>
        </div>

        
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full md:w-1/4 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Add Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;

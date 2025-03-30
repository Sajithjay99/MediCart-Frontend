import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-hot-toast';

const URL = "http://localhost:5000/api/users/all"; 

function ManageCustomersPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); 

    // Fetch users on page load
    useEffect(() => {
        if (!token) {
            console.error("No token found, redirecting to login.");
            navigate("/login", { replace: true }); 
            return;
        }

        try {
            const decoded = jwtDecode(token); 
            if (decoded.role !== "admin") {
                console.error("Unauthorized access, redirecting to home.");
                navigate("/", { replace: true }); 
                return;
            }
        } catch (error) {
            console.error("Invalid token, redirecting to login.");
            navigate("/login", { replace: true }); 
            return;
        }

        const fetchUsers = async () => {
            setLoading(true); 
            try {
                const response = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` },  
                });

                setUsers(response.data || []);  
                setFilteredUsers(response.data || []); 
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Error fetching users");  
                toast.error("Error fetching users");  
            } finally {
                setLoading(false); 
            }
        };

        fetchUsers();
    }, [navigate, token]);  

    
    const handleDelete = async (userId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this user?');  
        if (!isConfirmed) {
            return;  
        }

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/users/delete-user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccessMessage(response.data.message); 
            setUsers(users.filter((user) => user._id !== userId)); 
            toast.success("User deleted successfully!");  
        } catch (err) {
            console.error("Error deleting user:", err); 
            setError("Error deleting user");  I
            toast.error("Error deleting user");  
        }
    };

    
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query === '') {
            setFilteredUsers(users); 
        } else {
            
            const filtered = users.filter(user => 
                user.firstname.toLowerCase().includes(query.toLowerCase()) ||
                user.lastname.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase()) ||
                user.phone.includes(query)
            );
            setFilteredUsers(filtered);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Manage Customers
            </h1>

            
            <div className="mb-6 max-w-lg mx-auto">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by name, email, or phone"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>

            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

            
            {loading ? (
                <div className="text-center text-lg text-blue-500">Loading customers...</div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg bg-white">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Phone</th>
                                <th className="px-4 py-2 border">Role</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-4 py-2 border text-center">{user.firstname} {user.lastname}</td>
                                        <td className="px-4 py-2 border text-center">{user.email}</td>
                                        <td className="px-4 py-2 border text-center">{user.phone}</td>
                                        <td className="px-4 py-2 border text-center">{user.role}</td>
                                        <td className="px-4 py-2 border text-center">
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-150"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-2 border text-center">
                                        No customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ManageCustomersPage;

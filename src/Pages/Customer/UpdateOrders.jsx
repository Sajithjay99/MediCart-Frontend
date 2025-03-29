import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import mediaUpload from "../../utils/mediaUpload";

const URL = "http://localhost:5000/api/orders/";

function UpdateOrder() {
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    duration: "",
    gender: null,
    receiveSubstitutes: false,
    allergies: "",
    orderDate: "",
    note: "",
    prescriptionImage: "",
  });
  const [uploading, setUploading] = useState(false);
  const { orderId } = useParams(); // Get order ID from URL parameters
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token missing, please log in again.");
          return;
        }
  
        const decoded = jwtDecode(token);
        if (decoded.role !== "customer") {
          toast.error("You are not authorized to update orders");
          return;
        }
  
        const response = await axios.get(`${URL}myorders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setOrderDetails(response.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        toast.error("Failed to fetch order details");
      }
    };
  
    fetchOrderDetails();
  }, [orderId]);
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const result = await mediaUpload(file);
    setUploading(false);

    if (result.error) {
      toast.error("Error uploading file: " + result.message);
      return;
    }

    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      prescriptionImage: result.url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, email, address, duration, gender, receiveSubstitutes, allergies, orderDate, note, prescriptionImage } = orderDetails;

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      toast.error("Name should contain only letters and spaces.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token missing, please log in again.");
        return;
      }

      await axios.put(`${URL}update/${orderId}`, {
        name,
        phone,
        email,
        address,
        duration,
        gender,
        receiveSubstitutes,
        allergies,
        orderDate,
        note,
        prescriptionImage,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Order updated successfully");
      navigate("/profile/my-orders");
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Failed to update order: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Medicine Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Name:</label>
            <input
              type="text"
              value={orderDetails.name}
              onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Phone:</label>
            <input
              type="text"
              value={orderDetails.phone}
              onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              value={orderDetails.email}
              onChange={(e) => setOrderDetails({ ...orderDetails, email: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Address:</label>
            <input
              type="text"
              value={orderDetails.address}
              onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Duration:</label>
            <input
              type="text"
              value={orderDetails.duration}
              onChange={(e) => setOrderDetails({ ...orderDetails, duration: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Gender:</label>
            <select
              value={orderDetails.gender === null ? "" : orderDetails.gender ? "true" : "false"}
              onChange={(e) => setOrderDetails({ ...orderDetails, gender: e.target.value === "true" })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="true">Male</option>
              <option value="false">Female</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={orderDetails.receiveSubstitutes}
            onChange={(e) => setOrderDetails({ ...orderDetails, receiveSubstitutes: e.target.checked })}
            className="mr-2"
          />
          <label className="text-gray-700 font-medium">Receive Substitutes</label>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Allergies (if any):</label>
          <input
            type="text"
            value={orderDetails.allergies}
            onChange={(e) => setOrderDetails({ ...orderDetails, allergies: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Order date:</label>
          <input
            type="date"
            value={orderDetails.orderDate}
            onChange={(e) => setOrderDetails({ ...orderDetails, orderDate: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Note:</label>
          <textarea
            value={orderDetails.note}
            onChange={(e) => setOrderDetails({ ...orderDetails, note: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Prescription Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg" disabled={uploading}>
            {uploading ? "Uploading..." : "Update Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateOrder;

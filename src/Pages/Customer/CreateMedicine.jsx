import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import mediaUpload from "../../utils/mediaUpload";

const URL = "http://localhost:5000/api/orders/add";

function CreateMedicine() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [duration, setDuration] = useState("");
  const [gender, setGender] = useState(null); // Boolean
  const [receiveSubstitutes, setReceiveSubstitutes] = useState(false); // Boolean
  const [allergies, setAllergies] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [note, setNote] = useState("");
  const [prescriptionImage, setPrescriptionImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

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

    setPrescriptionImage(result.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
  if (!nameRegex.test(name)) {
    toast.error("Name should contain only letters and spaces.");
    return;
  }

  // Validate phone number (basic validation for digits)
  const phoneRegex = /^[0-9]{10}$/; // Adjust the length and format as needed
  if (!phoneRegex.test(phone)) {
    toast.error("Please enter a valid 10-digit phone number.");
    return;
  }

  // Validate email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token missing, please log in again.");
      return;
    }
  
    const decoded = jwtDecode(token);
    if (decoded.role !== "customer") {
      toast.error("You are not authorized to add orders");
      return;
    }
  
    const orderData = {
      name,
      phone,
      email,
      address,
      duration,
      gender, // Boolean (true for Male, false for Female)
      reveive_substitutes: receiveSubstitutes, // Match backend spelling
      allergies: Boolean(allergies), // Convert to Boolean
      order_date: orderDate,
      note,
      prescription_Image: prescriptionImage, // Match backend field
    };
  
    try {
      await axios.post(URL, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Order created successfully");
  
      // Reset form fields
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setDuration("");
      setGender(null);
      setReceiveSubstitutes(false);
      setAllergies("");
      setOrderDate("");
      setNote("");
      setPrescriptionImage("");

      navigate("/profile/my-orders");
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error(
        "Failed to create order: " + (err.response?.data?.message || err.message)
      );
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Medicine Order
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Duration:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Gender:</label>
            <select
              value={gender === null ? "" : gender ? "true" : "false"}
              onChange={(e) => setGender(e.target.value === "true")}
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
            checked={receiveSubstitutes}
            onChange={(e) => setReceiveSubstitutes(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-700 font-medium">Receive Substitutes</label>
        </div>
        <div>
        
            <label className="block text-gray-700 font-medium">Allergies (if any):</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            
            />
        
          </div>
           
        
        <div>
          <label className="block text-gray-700 font-medium">Order date:</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
            {uploading ? "Uploading..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMedicine;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/orders";

function MedicineOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        navigate("/", { replace: true });
        return;
      }
    } catch (error) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/allorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [navigate]);

  //delete
  const handleDelete = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/delete/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };
//approve orders
  const handleApprove = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_URL}/approve/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isApproved: true } : order
        )
      );
    } catch (err) {
      console.error("Error approving order:", err);
    }
  };
  
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const status = order.isApproved ? "approved" : "pending";
    return (
      order.name.toLowerCase().includes(query) ||
      order.phone.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query) ||
      status.includes(query)
    );
  });
  


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Medicine Orders</h2>

      {/* Search Box and Report Generation Button Container */}
      <div className="flex justify-between mb-6">
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by name, phone,email or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Customer</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Phone</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">{order.name}</td>
                  <td className="px-4 py-2 border text-center">{order.email}</td>
                  <td className="px-4 py-2 border text-center">{order.phone}</td>
                  <td className="px-4 py-2 border text-center">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        order.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-center space-x-2">
                   
                    <button 
                    onClick={() => handleView(order)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">View</button>
                    <button
                      onClick={() => handleApprove(order._id)}
                      disabled={order.isApproved}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        order.isApproved
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-3 border text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
          {/* View Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Name:</strong> {selectedOrder.name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Duration:</strong> {selectedOrder.duration}</p>
              <p><strong>Gender:</strong> {selectedOrder.gender ? "Male" : "Female"}</p>
              <p><strong>Substitutes:</strong> {selectedOrder.reveive_substitutes ? "Yes" : "No"}</p>
              <p><strong>Allergies:</strong> {selectedOrder.allergies ? "Yes" : "No"}</p>
              <p className="col-span-2"><strong>Note:</strong> {selectedOrder.note}</p>
              <p><strong>Status:</strong> {selectedOrder.isApproved ? "Approved" : "Pending"}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
              <p className="col-span-2">
                <strong>Prescription:</strong>{" "}
                <a
                  href={selectedOrder.prescription_Image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Prescription
                </a>
              </p>
            </div>
            <div className="text-right mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default MedicineOrders;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const URL = "http://localhost:5000/api/orders/myorders";

function MyOrders() {
  const [myorders, setMyOrders] = useState([]);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  // If the data is passed via state (like from a previous component)
  const passedOrders = location.state?.orders;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "customer") {
        navigate("/", { replace: true });
        return;
      }
    } catch (error) {
      console.error("Invalid token, redirecting to login.");
      navigate("/login", { replace: true });
      return;
    }

    const fetchOrders = async () => {
      if (passedOrders) {
        // If orders were passed via state, use that data
        setMyOrders(passedOrders);
      } else {
        // Fetch orders from the API if not passed through state
        try {
          const res = await axios.get(URL, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMyOrders(res.data || []);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      }
    };

    fetchOrders();
  }, [navigate, passedOrders]);

  const handleUpdate = (order) => {
    navigate(`/updateorders/${order._id}`, { state: { order } });
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleDeleteOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login.");
      navigate("/login", { replace: true });
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this order?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/deletebycustomer/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Orders</h1>
      <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Order date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {myorders.length > 0 ? (
            myorders.map((myorder, index) => (
              <tr key={myorder._id || index} className="hover:bg-gray-50 transition duration-150">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border text-center">
                  {new Date(myorder.order_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border text-center">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      myorder.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {myorder.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleView(myorder)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-150 mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdate(myorder)}
                    disabled={myorder.isApproved} 
                    className={`${
                      myorder.isApproved ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    } text-white px-3 py-1 rounded-md transition duration-150 mr-2`}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(myorder._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-150 mr-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-2 border text-center">
                No orders available
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
  );
}

export default MyOrders;

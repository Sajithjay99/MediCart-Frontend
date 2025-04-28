import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const [cart, setCart] = useState([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    phone: '',
    email: '',
    notes: '',
    paymentMethod: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateMainForm = () => {
    const requiredFields = ['firstName', 'lastName', 'address', 'postalCode', 'phone', 'email', 'paymentMethod'];

    for (let field of requiredFields) {
      if (!form[field]?.trim()) {
        toast.error(`Please fill in ${field}`);
        return false;
      }
    }

    // Postal code must be numeric
    if (!/^\d+$/.test(form.postalCode)) {
      toast.error('Postal Code must be a number');
      return false;
    }

    // Phone must be a 10-digit number
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Phone must be a 10-digit number');
      return false;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const validateCardForm = () => {
    if (!form.cardNumber.trim() || form.cardNumber.length < 12) {
      toast.error('Invalid card number');
      return false;
    }
    if (!form.expiry.trim()) {
      toast.error('Expiry date required');
      return false;
    }
    if (!form.cvv.trim() || form.cvv.length < 3) {
      toast.error('Invalid CVV');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!validateMainForm()) return;

    if (form.paymentMethod === 'Card Details') {
      setShowCardModal(true);
    } else {
      placeOrder();
    }
  };

  const placeOrder = () => {
    toast.success('Order placed successfully!');
    localStorage.removeItem('cart');
    navigate('/');
  };

  const handleCardPayment = (e) => {
    e.preventDefault();
    if (!validateCardForm()) return;

    setShowCardModal(false);
    placeOrder();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping & Contact Info</h2>
        <form onSubmit={handlePlaceOrder} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
          </div>

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
          />

          <textarea
            name="notes"
            placeholder="Order Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            rows={3}
          />

          {/* Payment Method */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              {['Card Details', 'cod'].map((method) => (
                <label key={method} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-700 capitalize">
                    {method === 'cod' ? 'Cash on Delivery' : method}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Place Order
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × Rs.{item.price}
                    </p>
                  </div>
                  <span className="font-semibold text-blue-600">
                    Rs.{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span>Rs.{total.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Card Payment Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Enter Card Details</h3>
            <form onSubmit={handleCardPayment} className="space-y-4">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={form.cardNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={handleChange}
                  className="w-1/2 p-3 border rounded-lg"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={form.cvv}
                  onChange={handleChange}
                  className="w-1/2 p-3 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Pay Rs.{total.toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ProductCart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(stored);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = quantity;
    updateCart(updatedCart);
  };

  const handleRemove = (index) => {
    const updatedCart = [...cartItems];
    const removed = updatedCart.splice(index, 1);
    updateCart(updatedCart);
    toast.success(`${removed[0].name} removed from cart`);
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
    navigate('/checkout'); // adjust this route to your real checkout page
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return <div className="text-center text-gray-600 py-20 text-lg">Your cart is empty 🛒</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">🛍 Your Cart</h2>

      <div className="space-y-6">
        {cartItems.map((item, idx) => (
          <div key={idx} className="flex gap-4 border-b pb-4">
            <img
              src={item.images?.[0] || ''}
              alt={item.name}
              className="w-24 h-24 object-contain border rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-green-600 font-medium mt-1">₹{item.price}</p>

              <div className="mt-2 flex items-center gap-3">
                <label>Qty:</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(idx, Number(e.target.value) || 1)
                  }
                  className="w-16 p-1 border rounded text-center"
                />
              </div>
            </div>
            <button
              onClick={() => handleRemove(idx)}
              className="text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mt-8 border-t pt-4 flex justify-between items-center">
        <h3 className="text-xl font-bold">Total: ₹{totalAmount}</h3>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default ProductCart;

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from 'react-icons/md';

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
    navigate('/checkout');
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-600 text-lg">
        <img src="/empty-cart.png" alt="Empty Cart" className="w-48 h-48 mb-4" />
        <p>Your cart is currently empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white rounded-lg shadow p-6 md:p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Your Cart</h2>

        <div className="space-y-6">
          {cartItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-5 gap-4"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4 w-full">
                <img
                  src={item.images?.[0] || '/no-image.png'}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 capitalize">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-xs italic text-gray-400">Brand: {item.brand}</p>

                  <p className="text-green-600 font-semibold mt-1 text-[15px]">Rs.{item.price}</p>

                  {/* Quantity */}
                  <div className="mt-3 flex items-center gap-2">
                    <label className="text-sm font-medium">Qty:</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(idx, Number(e.target.value) || 1)
                      }
                      className="w-16 text-sm border rounded px-2 py-1 text-center focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(idx)}
                className="flex items-center text-red-600 text-sm font-medium hover:underline mt-2 md:mt-0"
              >
                <MdDeleteOutline className="mr-1 text-lg" /> Remove
              </button>
            </div>
          ))}
        </div>

        {/* Total & Checkout */}
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-bold text-blue-700">
            Total: Rs.{totalAmount.toLocaleString()}
          </h3>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition shadow"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCart;

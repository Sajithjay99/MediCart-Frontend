import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
  };

  const image1 = product.images?.[0];
  const image2 = product.images?.[1];

  return (
    <div
      className="w-[300px] h-[420px] bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 m-3 flex flex-col justify-between"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Flip image area */}
      <div
        className="relative w-full h-48 bg-gray-100 cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        <div
          className={`w-full h-full transition-transform duration-1000 ${
            hovered ? 'rotate-y-180' : ''
          }`}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 1s',
          }}
        >
          {/* Front */}
          {image1 && (
            <img
              src={image1}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ backfaceVisibility: 'hidden' }}
            />
          )}

          {/* Back */}
          {image2 && (
            <img
              src={image2}
              alt={`${product.name} alt`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}
            />
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-bold text-green-600">Rs.{product.price}</span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {product.availability ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Expiry: {new Date(product.expiryDate).toLocaleDateString()}
        </p>

        <div className="mt-auto flex justify-between space-x-2 pt-2 border-t border-gray-100">
          <button
            onClick={handleViewDetails}
            className="w-1/2 py-2 text-sm bg-black text-white rounded hover:bg-blue-500/90 transition"
          >
            View Details
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!product.availability}
            className={`w-1/2 py-2 text-sm text-white rounded transition ${
              product.availability
                ? 'bg-blue-500/90 hover:bg-black'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

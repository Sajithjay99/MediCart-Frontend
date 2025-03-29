import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ProductOverview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data.images?.[0]);
        setStatus('success');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Something went wrong');
        setStatus('error');
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setStatus('error');
    }
  }, [id]);

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const alreadyInCart = existingCart.find(item => item._id === product._id);

    if (alreadyInCart) {
      alreadyInCart.quantity += quantity;
    } else {
      existingCart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    toast.success('Product added to cart!');
    navigate('/cart');
  };

  if (status === 'loading') {
    return <div className="text-center py-20 text-blue-600">Loading...</div>;
  }

  if (status === 'error' || !product) {
    return <div className="text-center py-20 text-red-600">Failed to load product</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left - Image Section */}
          <div>
            <div className="border rounded-lg h-[300px] flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="object-contain max-h-full max-w-full"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumb-${idx}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 object-cover border rounded cursor-pointer transition-all ${
                      selectedImage === img
                        ? 'ring-2 ring-blue-500'
                        : 'hover:ring hover:ring-blue-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-800 capitalize">{product.name}</h1>
            <p className="text-sm text-blue-500 font-medium">{product.category}</p>

            {product.brand && (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-600">Brand:</span> {product.brand}
              </p>
            )}

            <div className="text-lg font-semibold text-green-600 mt-2">
              Rs.{product.price}
            </div>

            <div className="text-sm text-gray-700">
              <span className="font-medium">Availability:</span>{' '}
              <span
                className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                  product.availability
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {product.availability ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 pt-2 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mt-4">
              <label className="text-sm font-medium">Qty:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-sm text-center focus:outline-blue-500"
              />
              <button
                onClick={handleAddToCart}
                disabled={!product.availability}
                className={`px-5 py-2 rounded text-white text-sm font-semibold transition ${
                  product.availability
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductOverview;

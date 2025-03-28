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
    navigate('/cart'); // Navigate to cart after adding
  };

  if (status === 'loading') {
    return <div className="text-center py-10 text-lg">Loading...</div>;
  }

  if (status === 'error' || !product) {
    return <div className="text-center text-red-600 py-10">Failed to load product</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">{product.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-[320px] object-contain rounded border"
            />
          ) : (
            <div className="w-full h-[320px] bg-gray-100 text-gray-500 flex items-center justify-center rounded border">
              No Image Available
            </div>
          )}

          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 object-cover border rounded cursor-pointer transition ${
                    selectedImage === img ? 'ring-2 ring-blue-500' : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <p className="text-gray-700"><strong>Category:</strong> {product.category}</p>
          <p className="text-gray-700"><strong>Description:</strong> {product.description || 'No description provided.'}</p>
          <p className="text-xl text-green-600 font-semibold"><strong>₹{product.price}</strong></p>
          <p>
            <strong>Availability:</strong>{' '}
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                product.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              }`}
            >
              {product.availability ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>
          <p>
            <strong>Expiry Date:</strong>{' '}
            {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A'}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mt-6">
            <label className="font-medium">Qty:</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 p-1 border rounded text-center"
            />
            <button
              onClick={handleAddToCart}
              disabled={!product.availability}
              className={`px-5 py-2 rounded text-white font-semibold transition ${
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
  );
}

export default ProductOverview;

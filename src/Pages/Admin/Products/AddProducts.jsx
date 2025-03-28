import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mediaUpload from '../../../utils/mediaupload';
import { jwtDecode } from 'jwt-decode';

function AddProducts() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [images, setImages] = useState([]); 
  const navigate = useNavigate();

  const categories = [
    'Adult Care',
    'Beauty Accessories',
    'Beverages',
    'Cosmetics',
    'Dairy Products',
    'Kids',
    'Mother & Baby Care',
    'Personal Care',
    'Pet Care',
    'Skin Care',
    'Surgical Items',
    'Vitamins & Nutritions',
    'Others',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const productData = {
      name,
      category,
      description,
      price: Number(price),
      expiryDate,
      images,
    };
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      toast.error('Please login to add a product');
      return;
    }
  
    const decoded = jwtDecode(token);
  
    if (decoded.role !== 'admin') {
      toast.error('You are not authorized to add products');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:5000/api/products/add', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success('Product added successfully!');
      // Reset form
      setName('');
      setCategory('');
      setDescription('');
      setPrice('');
      setExpiryDate('');
      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product');
    }
  };

  
  const handleCancel = () => {
    setName('');
    setCategory('');
    setDescription('');
    setPrice('');
    setExpiryDate('');
    setImages([]);  

    navigate('/admin/products/manage');
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[400px] bg-white p-6 shadow-lg rounded">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add New Product</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;

              toast.loading("Uploading images...");
              const uploadedUrls = [];

              for (const file of files) {
                const res = await mediaUpload(file);
                if (res.error) {
                  toast.dismiss();
                  toast.error(`Failed to upload ${file.name}`);
                  return;
                }
                uploadedUrls.push(res.url);
              }

              toast.dismiss();
              toast.success("All images uploaded!");
              setImages(uploadedUrls);  
            }}
            className="w-full p-2 border rounded"
          />

          {/* Show Previews */}
          {Array.isArray(images) && images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`uploaded-${idx}`}
                  className="w-full h-20 object-cover rounded"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col items-center space-y-2 mt-4">
            <button
              type="submit"
              className="w-[200px] bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Add Product
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-[200px] bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProducts;

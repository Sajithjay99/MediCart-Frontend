import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mediaUpload from '../../../utils/mediaupload';
import { jwtDecode } from 'jwt-decode';
import { FaPlus } from 'react-icons/fa';

function AddProducts() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
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

  const validateForm = () => {
    if (name.trim().length < 3) {
      toast.error('Product name must be at least 3 characters long');
      return false;
    }
    if (!brand.trim()) {
      toast.error('Brand is required');
      return false;
    }
    if (!category) {
      toast.error('Please select a category');
      return false;
    }
    if (description && description.trim().length === 0) {
      toast.error('Description cannot be just spaces');
      return false;
    }
    if (!price || Number(price) <= 0) {
      toast.error('Price must be greater than 0');
      return false;
    }
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData = {
      name,
      brand,
      category,
      description: description.trim(),
      price: Number(price),
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
      await axios.post('http://localhost:5000/api/products/add', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Product added successfully!');
      setName('');
      setBrand('');
      setCategory('');
      setDescription('');
      setPrice('');
      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product');
    }
  };

  const handleCancel = () => {
    setName('');
    setBrand('');
    setCategory('');
    setDescription('');
    setPrice('');
    setImages([]);
    navigate('/admin/products/manage');
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min={1}
          />

          {/* File Upload UI */}
          <div>
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <FaPlus className="text-blue-600 mr-2" />
              <span className="text-blue-600 font-medium">Choose Images</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
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
              />
            </label>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`uploaded-${idx}`}
                    className="w-full h-20 object-cover rounded shadow"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500/90 text-white py-3 rounded-lg font-semibold hover:bg-black transition"
            >
              Add Product
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-blue-500/90 transition"
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

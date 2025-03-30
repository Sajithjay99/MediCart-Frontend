import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import mediaUpload from '../../../utils/mediaupload';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/all');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/products/update/${selectedProduct._id}`,
        selectedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Product updated');
      setEditModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update product');
    }
  };

  const getImages = (product) => {
    return Array.isArray(product.images) ? product.images : [];
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link to="/admin/products/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add New
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Brand</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id}>
                <td className="py-2 px-4 border-b">{prod.name}</td>
                <td className="py-2 px-4 border-b">{prod.brand}</td>
                <td className="py-2 px-4 border-b">{prod.category}</td>
                <td className="py-2 px-4 border-b">Rs.{prod.price}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    className="bg-blue-500/90 text-white px-3 py-1 rounded hover:bg-black"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setViewModal(true);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="bg-black text-white px-3 py-1 rounded hover:bg-blue-500/90"
                    onClick={() => {
                      setSelectedProduct({ ...prod });
                      setEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(prod._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewModal && selectedProduct && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-xl bg-white/10">
          <div className="bg-white w-[400px] p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <p><strong>Name:</strong> {selectedProduct.name}</p>
            <p><strong>Brand:</strong> {selectedProduct.brand}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
            <p><strong>Availability:</strong> {selectedProduct.availability ? 'Available' : 'Not Available'}</p>

            <p className="font-semibold mt-2">Images:</p>
            <div className="grid grid-cols-2 gap-2 my-2">
              {getImages(selectedProduct).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Product ${idx}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && selectedProduct && (
  <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-xl bg-white/10">
    <div className="bg-white w-[450px] p-6 rounded shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const { name, brand, category, price, description } = selectedProduct;

          if (!name || name.trim().length < 3) {
            toast.error("Product name must be at least 3 characters");
            return;
          }

          if (!brand || brand.trim().length < 2) {
            toast.error("Brand is required");
            return;
          }

          if (!category || category.trim().length < 3) {
            toast.error("Please select a valid category");
            return;
          }

          if (!price || isNaN(price) || Number(price) <= 0) {
            toast.error("Price must be a valid number greater than 0");
            return;
          }

          if (description && description.trim().length > 0 && description.trim().length < 10) {
            toast.error("Description should be at least 10 characters or leave it empty");
            return;
          }

          handleEditSubmit(e);
        }}
      >
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={selectedProduct.name}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, name: e.target.value })
          }
          required
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Brand"
          value={selectedProduct.brand}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, brand: e.target.value })
          }
          required
        />

        {/* Category Dropdown with enum values */}
        <select
          className="w-full p-2 border rounded"
          value={selectedProduct.category}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, category: e.target.value })
          }
          required
        >
          <option value="">Select Category</option>
          {[
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
          ].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={selectedProduct.description}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, description: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Price"
          value={selectedProduct.price}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, price: e.target.value })
          }
          required
          min="1"
        />

        {/* Image previews */}
        <div className="grid grid-cols-2 gap-2">
          {(selectedProduct.images || []).map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img}
                alt={`product-${idx}`}
                className="w-full h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = selectedProduct.images.filter((_, i) => i !== idx);
                  setSelectedProduct({ ...selectedProduct, images: updated });
                }}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Upload more images */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;
            toast.loading('Uploading...');
            const uploaded = [];

            for (const file of files) {
              const res = await mediaUpload(file);
              if (!res.error) {
                uploaded.push(res.url);
              } else {
                toast.error(`Failed: ${file.name}`);
              }
            }

            toast.dismiss();
            if (uploaded.length > 0) {
              toast.success('Images uploaded');
              setSelectedProduct((prev) => ({
                ...prev,
                images: [...(prev.images || []), ...uploaded],
              }));
            }
          }}
          className="w-full p-2 border rounded"
        />

        {/* Availability toggle */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="availability"
            checked={selectedProduct.availability}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, availability: e.target.checked })
            }
          />
          <label htmlFor="availability" className="text-sm text-gray-700 font-medium">
            Available
          </label>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
  
      </div>
    );
  }

export default ManageProducts;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Chatbot from '../../../components/ChatBot';
import { FaTruck, FaShieldAlt, FaHeadset } from "react-icons/fa";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    `${window.location.origin}/slider1.jpeg`,
    `${window.location.origin}/slider2.jpg`,
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/all')
      .then(res => {
        setProducts(res.data.slice(0, 8));
        setStatus('success');
      })
      .catch(() => {
        toast.error("Failed to fetch products");
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="w-full text-gray-800 bg-blue-50">
      {/* ✅ Hero Slider */}
      <div className="relative h-[500px] w-full overflow-hidden">
        {slides.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`slide-${idx}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent flex flex-col justify-center items-start text-white px-8 md:px-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Trusted Online Pharmacy</h1>
          <p className="text-lg max-w-xl mb-6">We deliver authentic medicines to your door — safely and swiftly, every time.</p>
          <Link to="/shop" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold">
            Shop Now
          </Link>
        </div>
      </div>

     

{/* ✅ Modern Feature Section */}
<div className="bg-gradient-to-b from-white to-blue-50 pt-8 b-5">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-blue-500/90 mb-6">
      Why Choose Medicart?
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-left">
      {[
        {
          icon: <FaTruck className="text-blue-600 text-4xl mb-4" />,
          title: "Effortless Ordering",
          desc: "Easily search and order medicines using our intelligent platform. No confusion, no delay.",
        },
        {
          icon: <FaShieldAlt className="text-blue-600 text-4xl mb-4" />,
          title: "Secure & Reliable",
          desc: "Your personal info and payments are always protected with enterprise-grade security.",
        },
        {
          icon: <FaHeadset className="text-blue-600 text-4xl mb-4" />,
          title: "24/7 Assistance",
          desc: "Chatbot + real human experts available any time you need support, day or night.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          {item.icon}
          <h4 className="text-lg font-semibold text-blue-700 mb-2">{item.title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</div>


{/* ✅ Featured Products */}
<div className="max-w-7xl mx-auto px-6 pt-12">
  <h2 className="text-4xl font-bold text-center text-blue-500/90 mb-5">
    Featured Products
  </h2>

  {status === 'loading' ? (
    <div className="flex justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.slice(0, 8).map(product => (
        <div
          key={product._id}
          className="bg-white border-b-4 border-blue-600 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-transform duration-300 ease-in-out"
        >
          <div className="p-4 flex flex-col h-full">
            {/* Image */}
            <div className="overflow-hidden rounded-md">
              <img
                src={product.images?.[0] || '/no-image.png'}
                alt={product.name}
                className="w-full h-40 object-contain transition-transform duration-500 hover:scale-110"
              />
            </div>

            {/* Info */}
            <h3 className="font-semibold text-base truncate mt-3 text-blue-800">
              {product.name}
            </h3>

            <p className="text-xs text-gray-500">{product.category}</p>

            {product.brand && (
              <p className="text-xs italic text-gray-400">Brand: {product.brand}</p>
            )}

            <p className="text-xs text-gray-400 mb-1 line-clamp-2">
              {product.description}
            </p>

            {/* Price & Availability aligned in row */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-blue-600 font-semibold text-sm">
                Rs.{product.price}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  product.availability
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {product.availability ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Buttons */}
            <div className="mt-auto flex gap-2">
              <Link
                to={`/products/${product._id}`}
                className="flex-1 bg-black hover:bg-blue-500/90 text-white text-sm py-1 rounded text-center transition"
              >
                View
              </Link>
              <button
                onClick={() => {
                  const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
                  const alreadyInCart = existingCart.find(item => item._id === product._id);
                  if (alreadyInCart) {
                    alreadyInCart.quantity += 1;
                  } else {
                    existingCart.push({ ...product, quantity: 1 });
                  }
                  localStorage.setItem('cart', JSON.stringify(existingCart));
                  toast.success("Added to cart");
                }}
                className={`flex-1 ${
                  product.availability
                    ? 'bg-blue-500/90 hover:bg-black'
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white text-sm py-1 rounded transition`}
                disabled={!product.availability}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>



    {/* ✅ Ultra Clean, Blue-Themed Stats Section with Bottom Borders */}
<div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-15">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-blue-500/90 text-center mb-12">
      Medicart by the Numbers
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
      {/* Stat Item */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-b-4 border-blue-500 p-8">
        <div className="text-5xl font-extrabold text-blue-600 mb-2">10K+</div>
        <div className="text-lg font-semibold text-gray-800">Orders Delivered</div>
        <p className="text-sm text-gray-500 mt-2">Safe and speedy medicine delivery across India.</p>
      </div>

      {/* Stat Item */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-b-4 border-blue-500 p-8">
        <div className="text-5xl font-extrabold text-blue-600 mb-2">5K+</div>
        <div className="text-lg font-semibold text-gray-800">Happy Customers</div>
        <p className="text-sm text-gray-500 mt-2">People trust Medicart for their health needs.</p>
      </div>

      {/* Stat Item */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-b-4 border-blue-500 p-8">
        <div className="text-5xl font-extrabold text-blue-600 mb-2">100+</div>
        <div className="text-lg font-semibold text-gray-800">Cities Covered</div>
        <p className="text-sm text-gray-500 mt-2">Expanding quality care, one city at a time.</p>
      </div>
    </div>
  </div>
</div>



     {/* ✅ Next-Level Testimonials */}
<div className="bg-gradient-to-b from-gray-100 via-white to-gray-50 py-16">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-4xl font-bold text-blue-500/90 mb-7">
      Hear From Our Customers
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {[
        {
          quote:
            "Medicart has completely changed the way I order my medicines. The delivery is super fast and the UI is extremely user-friendly.",
          name: "Gayan Perera",
          role: "Verified Buyer",
        },
        {
          quote:
            "I had a question and the chatbot actually helped me find exactly what I needed. Totally impressed!",
          name: "Nehara Fernando",
          role: "Long-term Customer",
        },
      ].map((testimonial, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-left relative"
        >
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="text-gray-600 italic relative pl-6 leading-relaxed">
            <span className="absolute left-0 top-0 text-3xl text-blue-400 leading-none">“</span>
            {testimonial.quote}
          </blockquote>

          {/* Bottom glow line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-b-xl"></div>
        </div>
      ))}
    </div>
  </div>
</div>

     
      {/* ✅ Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>

      
    </div>
  );
}

export default HomePage;

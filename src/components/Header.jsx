import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';


function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  // Reusable class for nav links
  const navLinkClasses = (path) =>
    `font-semibold px-6 transition duration-200 ${
      location.pathname === path
        ? 'text-black'
        : 'hover:text-blue-200'
    }`;

  return (
    <div className='w-full h-[100px] bg-blue-500/90 backdrop-blur-md flex items-center justify-center relative text-white z-50'>

      {/* Logo */}
      <img
        src="/logo.png"
        alt="logo"
        className='w-[90px] h-[90px] rounded-full absolute left-10 border-[1px] object-cover border-black'
      />

      {/* Navigation */}
      <Link to="/" className={navLinkClasses('/')}>Home</Link>
      <Link to="/shop" className={navLinkClasses('/shop')}>Shop</Link>
      <Link to="/medicine" className={navLinkClasses('/medicine')}>Medicine</Link>
      <Link to="/reviews" className={navLinkClasses('/reviews')}>Reviews</Link>
      <Link to="/about" className={navLinkClasses('/about')}>About</Link>
      <Link to="/contactus" className={navLinkClasses('/contactus')}>Contact Us</Link>

      {/* Cart & Profile */}
      <div className='absolute right-10 flex items-center space-x-5'>

        {/* Cart */}
        <Link to="/cart" className="relative hover:text-gray-100 transition">
          <FaShoppingCart size={26} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:text-gray-100 transition"
          >
            <FaUser size={26} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg py-2 z-50">
              {!token ? (
                <>
                  <Link
                    to="/customerlogin"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={userRole === 'admin' ? "/admin" : "/profile"}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    {userRole === 'admin' ? "Admin Panel" : "Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

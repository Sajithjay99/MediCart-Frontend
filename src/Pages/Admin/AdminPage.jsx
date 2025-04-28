import React, { useState } from "react";
import {
  MdDashboard,
  MdReviews,
} from "react-icons/md";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaUserLarge } from "react-icons/fa6";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { Link, Routes, Route } from "react-router-dom";
import ManageProducts from "./Products/ManageProducts";
import AddProducts from "./Products/AddProducts";
import MedicineOrders from "./MedicineOrders";
import AddAdmin from './users/AddAdminPage';  
import ManageCustomers from './users/ManageCustomersPage';  



import ManageReview from "./Reviews/ManageReview";


/** SidebarDropdown Component */
const SidebarDropdown = ({ title, icon: Icon, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-4 py-3 font-semibold text-[16px] hover:bg-blue-400 hover:text-white transition duration-200 rounded"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} />
          <span>{title}</span>
        </div>
        <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 bg-white rounded-md shadow border border-gray-200 flex flex-col py-2 transition-all duration-300">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 text-[15px] hover:bg-blue-100 hover:text-blue-700 transition duration-200"
            >
              ➤ {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/** AdminPage Component */
function AdminPage() {
  const commonLinkClasses =
    "flex items-center gap-3 px-4 py-3 text-[16px] font-semibold rounded hover:bg-blue-400 hover:text-white transition duration-200";

  return (
    <div className="flex w-full h-screen font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-[225px] h-full bg-blue-300 shadow-lg flex flex-col justify-between py-6 fixed left-0 top-0">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/logo.png"
            alt="logo"
            className="w-[100px] h-[100px] rounded-full object-cover border-2 border-white shadow-md"
          />
          <h2 className="text-white font-bold text-xl">Admin Panel</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2 px-2">
          <Link to="/admin/dashboard" className={commonLinkClasses}>
            <MdDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/medicine" className={commonLinkClasses}>
            <AiFillMedicineBox size={20} />
            <span>Medicine</span>
          </Link>

          <SidebarDropdown
            title="Products"
            icon={RiShoppingCart2Fill}
            links={[
              { label: "Add Product", to: "/admin/products/add" },
              { label: "Manage Products", to: "/admin/products/manage" },
            ]}
          />

          <Link to="/admin/reviews" className={commonLinkClasses}>
            <MdReviews size={20} />
            <span>Reviews</span>
          </Link>

          <SidebarDropdown
            title="Users"
            icon={FaUserLarge}
            links={[
              { label: "Add Admin", to: "/admin/users/add-admin" },
              { label: "Manage Customers", to: "/admin/users/manage-customers" },
            ]}
          />
        </nav>

        {/* Footer */}
        <div className="text-center px-4 pt-10 text-white text-sm">
          © 2025 Y3S2-WE-54
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[225px] w-[calc(100%-225px)] h-full overflow-y-auto bg-gray-100 p-6">
        <Routes>
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/medicine" element={<MedicineOrders/>} />

          <Route path="/products/add" element={<AddProducts/>} />
          <Route path="/products/manage" element={<ManageProducts/>} />

          <Route path="/reviews" element={<ManageReview />} />

          <Route path="/users/add-admin" element={<AddAdmin />} />
          <Route path="/users/manage-customers" element={<ManageCustomers />} />

          
          <Route path="*" element={<h1>Welcome to Admin Panel</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminPage;

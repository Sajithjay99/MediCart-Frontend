import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser } from "react-icons/fa";

function Header() {
  return (
    <div className='w-full h-[100px] bg-blue-300  flex items-center justify-center relative text-white'>
        
        <img src="/logo.png" alt="logo" className='w-[90px] h-[90px] rounded-full absolute left-10 border-[1px] object-cover'/>

        <Link to="/"  className='font-semibold px-6 '>
        Home
        </Link>

        <Link to="/shop" className='font-semibold px-6 '>
        Shop
        </Link>

        <Link to="/medicine" className='font-semibold px-6 '>
        Medicine
        </Link>


        <Link to="/reviews" className='font-semibold px-6 '>
        Reviews
        </Link>


        <Link to="/about" className='font-semibold px-6 '>
        About
        </Link>



        <Link to="/contactus" className='font-semibold px-6 '>
        Contact Us
        </Link>


        <Link to="/customerlogin" className='font-semibold px-6 right-10 absolute'>
        <FaUser size={30} />
        </Link>



    </div>
  )
}

export default Header

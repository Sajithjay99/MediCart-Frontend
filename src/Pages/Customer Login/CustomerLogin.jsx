import React from 'react'
import './customerlogin.css'
import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import {toast} from 'react-hot-toast'


function Customerlogin() {


    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const navigate = useNavigate()

    const handleonsubmit = (e) => {
        e.preventDefault();
      
        axios.post("http://localhost:5000/api/users/login", {
          email: email,
          password: password
        }).then((res) => {
         
            toast.success('login success');
      
          const token = res.data.token;
          const decoded = jwtDecode(token);   

          console.log(decoded);
      
          
          if (decoded.role === "admin") {
            navigate('/admin');
          } else {
            navigate('/');
          }
      
         
          localStorage.setItem('token', token);
        }).catch((err) => {
          toast.error(err.response.data)
        });
      };
    
 
  return (

    <form  onSubmit={handleonsubmit}>
    <div className='w-full h-screen flex items-center justify-center bg-picture'>
       <div className='w-[400px] h-[400px]  flex items-center justify-center flex-col relative backdrop-blur-2xl rounded-2xl'>

        <img src="/logo.png" alt="logo" className='w-[100px] h-[100px] rounded-full border-[1px] absolute top-6'/>

        <input type="Email" placeholder='Email' className='w-[300px] h-[35px]   pl-2 mt-10'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        
        />
        <input type="Password" placeholder='Password' className='w-[300px] h-[35px] pl-2'
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        
        />


        <button className='w-[100px] h-[35px] bg-red-500 mt-6 rounded-2xl cursor-pointer'>Login</button>

       </div>
    </div>

    </form>
  )
}

export default Customerlogin

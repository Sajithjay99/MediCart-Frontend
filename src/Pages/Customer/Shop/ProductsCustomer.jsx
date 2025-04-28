import axios from 'axios'
import React, { useEffect , useState} from 'react'
import ProductCard from '../../../components/ProductCard'

function ProductsCustomer() {
    const [state, setstate] = useState("loading") //loading,success,error
    const [products, setProducts] = useState([])

    useEffect(() => {
        if(state=="loading")
        axios.get('http://localhost:5000/api/products/all').then(
            (response) => {
                console.log(response.data)
                setProducts(response.data)
                setstate("success")
            }
        ).catch(
            (error) => {
                toast.error(err?.response?.data?.message || "Error")
                setstate("error")
            }
        )
      }, [])
  return (
  
    <div className="w-full h-full flex flex-wrap justify-center pt-[50px]">
    {state=="loading" && <div className='w-full h-full justify-center items-center flex'>
        
        <div className='w-[50px] h-[50px] border-4  border-t-blue-500 rounded-full animate-spin  border-blue-200'></div>

       
        </div>}

        {
            state == "success" &&
            products.map((product) => {
                return(
                    <ProductCard key={product._id} product={product} />
                )
            }
                 
            )
        }
    </div>
  )
}

export default ProductsCustomer

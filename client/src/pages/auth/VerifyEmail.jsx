import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import authServices from '../../services/authServices';
import { CheckCircle, Loader, LogIn, Wallet, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleVerify = async () => {
    setIsLoading(true);
    try {
        const data = await authServices.verifyEmail(token);

        if (data?.success) {
            setSuccess(true);
            setMessage(data?.message);
            setTimeout(() => {
                navigate("/login")
            }, 4000)

        } else {
            setSuccess(false);
            setMessage(data?.error)
        }
    } catch (error) {
        setSuccess(false);
        setMessage(error.message)
    } finally {
        setIsLoading(false)
    }
  }

  useEffect(() => {
    handleVerify()
  }, [])
  
  return (
    <div className='flex items-center justify-center w-full h-screen bg-slate-50'>
        <div className='w-100 p-8 rounded-lg bg-white shadow-lg border border-slate-200'>
            <div className='flex items-center justify-center mb-8 gap-2'>
              <Wallet size={32} className='text-blue-500'/>
              <h1 className=' text-blue-500 text-2xl font-bold'>E-WALLET</h1>
            </div>

            {isLoading ? (
                <div className='flex items-center justify-center w-full'>
                    <Loader className='text-blue-500 animate-spin' size={52}/>
                </div>
            ): (
                <>
                    <div className='w-full flex items-center justify-center '>
                        {success ? <CheckCircle className='text-green-500 animate-pulse' size={50}/> : <XCircle className='text-red-500 animate-pulse' size={50}/>}
                    </div>
                    <h1 className={`text-center text-xl ${success ? "text-green-600" : "text-red-600"} font-semibold mt-1`}>{success ? "Success" : "Failed"}</h1>
                    <h1 className='mt-8'>{message}</h1>
                    {success ? (
                        <div className='text-lg mt-4 flex items-center justify-between w-full'>
                            <h1>Redirecting to login...</h1>
                            <button onClick={() => navigate("/login")} className='text-blue-500 hover:underline cursor-pointer hover:text-blue-700 duration-300 flex items-center gap-0.5'>Login <LogIn /></button>
                        </div> 
                    ) : ""}
                </>
            )}


        </div>
    </div>
  )
}

export default VerifyEmail
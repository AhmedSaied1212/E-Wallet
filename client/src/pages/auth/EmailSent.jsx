import { CheckCircle, Loader, RotateCcw, Wallet } from 'lucide-react'
import React, { useState } from 'react'
import authServices from '../../services/authServices';
import toast from 'react-hot-toast';

const EmailSent = ({ email = 'www.ahmedsoliman1@gmail.com' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await authServices.resendVerify(email)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center w-full h-screen bg-slate-50'>
        <div className='w-100 p-8 rounded-lg bg-white shadow-lg border border-slate-200'>
            <div className='flex items-center justify-center mb-8 gap-2'>
              <Wallet size={32} className='text-blue-500'/>
              <h1 className=' text-blue-500 text-2xl font-bold'>E-WALLET</h1>
            </div>
            <div className='w-full flex items-center justify-center '>
                <CheckCircle className='text-green-500 animate-pulse' size={50}/>
            </div>
            <h1 className='text-center text-xl text-green-600 font-semibold mt-1'>Success</h1>
            <h1 className='mt-8'>We have sent you an email to verify your account check your inbox if you didn't find it in inbox check the spam folder.</h1>
            <div className='w-full flex items-center justify-between mt-6'>
              <h1 className='text-lg'>Didn't get an email?</h1>
              <button disabled={isLoading} onClick={handleResendVerification} className={`${isLoading ? "cursor-not-allowed" : "cursor-pointer"} text-blue-500 gap-0.5 hover:text-blue-700 duration-300`}>
                {
                  isLoading ?
                  (
                    <Loader className='animate-spin'/>
                  ) :
                  (
                    <div className='flex items-center justify-center'>
                      <RotateCcw />
                      <h1>Retry</h1>
                    </div> 
                  )  
                }
              </button>
            </div>
        </div>
    </div>
  )
}

export default EmailSent;
import React from 'react'
import { useState } from 'react';
import authServices from '../../services/authServices';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AtSign, Loader2, Lock, Mail, User } from 'lucide-react';
import EmailSent from './EmailSent';

const Register = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setIsLoading(true)
        try {
            const data = await authServices.register({
                name,
                username,
                email, 
                password
            });
            if (data?.success) {
                navigate("/email-sent");
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <div className='w-full bg-slate-50 h-screen flex items-center justify-center'>
        <div className='hidden lg:flex flex-1 h-screen items-center justify-center p-0'>
            <div className="relative h-full w-full overflow-hidden border-l border-slate-200/60 shadow-2xl shadow-slate-900/20 bg-linear-to-br from-[#62cff4] via-[#2c67f2] to-[#071a44]">
                <div className="absolute -left-20 top-[-80px] h-72 w-72 rounded-full bg-[#6ee7f9]/50 blur-3xl" />
                <div className="absolute right-[-120px] bottom-[-80px] h-96 w-96 rounded-full bg-[#8b5cf6]/60 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent)]" />
                <div className="absolute inset-0 opacity-30">
                    <div className="grid h-full w-full grid-cols-8 grid-rows-8">
                        {Array.from({ length: 64 }).map((_, i) => (
                            <span key={i} className="border border-white/10" />
                        ))}
                    </div>
                </div>
                <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
                    <div className="flex justify-center items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/10 text-lg font-bold shadow-lg backdrop-blur-sm">E</span>
                        <span className="text-3xl font-semibold uppercase tracking-[0.24em]">E-Wallet</span>
                    </div>
                    <div className="max-w-md m-auto text-center">
                        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-sky-100">Digital Banking</p>
                        <h2 className="text-4xl font-bold leading-tight">Smart payments<br />made simple</h2>
                        <div className="mt-6 flex justify-center gap-3">
                            <span className="h-2 w-14 rounded-full bg-white/90" />
                            <span className="h-2 w-8 rounded-full bg-white/50" />
                            <span className="h-2 w-8 rounded-full bg-white/50" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <span className="rounded-full border border-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">Secure</span>
                        <span className="rounded-full border border-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">Fast</span>
                        <span className="rounded-full border border-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">Simple</span>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-[35%] p-20 mx-auto'>
            <h1 className='text-3xl text-center font-semibold mb-6'>Register</h1>
            <div className='felx-col items-center justify-center items-center'>
              <div className='flex-col items-center justify-center items-center mb-8'>
                    <div className='flex items-center gap-2 mb-3'>
                        <User />
                        <h1 className='text-lg'>Full Name</h1>
                    </div>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='John Alex' className='p-3 w-full bg-white/30 backdrop-blur-md text-black focus:border-blue-500 outline-none rounded-lg shadow-lg'/>
                </div>
              <div className='flex-col items-center justify-center items-center mb-8'>
                    <div className='flex items-center gap-2 mb-3'>
                        <AtSign />
                        <h1 className='text-lg'>Username</h1>
                    </div>
                    <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder='john123' className='p-3 w-full bg-white/30 backdrop-blur-md text-black focus:border-blue-500 outline-none rounded-lg shadow-lg'/>
                </div>
                <div className='flex-col items-center justify-center items-center mb-8'>
                    <div className='flex items-center gap-2 mb-3'>
                        <Mail />
                        <h1 className='text-lg'>Email</h1>
                    </div>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='john@example.com' className='p-3 w-full bg-white/30 backdrop-blur-md text-black focus:border-blue-500 outline-none rounded-lg shadow-lg'/>
                </div>
                <div className='flex-col items-center justify-center items-center'>
                    <div className='flex items-center gap-2 mb-3'>
                        <Lock />
                        <h1 className='text-lg'>Password</h1>
                    </div>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='********' className='p-3 w-full bg-white/30 backdrop-blur-md text-black focus:border-blue-500 outline-none rounded-lg shadow-lg'/>
                </div>
                <button onClick={handleRegister} className={`${isLoading ? 'bg-blue-100 cursor-not-allowed' : 'bg-blue-500 cursor-pointer hover:bg-blue-600'} p-3 w-full shadow-lg rounded-lg  duration-500 text-white mt-10 flex items-center justify-center`} disabled={isLoading}>{isLoading ? <Loader2 className='text-center animate-spin'/> : "Register"}</button>
                <h1 className='text-left text-md flex items-center gap-2 mt-3'>Have an account? <p onClick={() => navigate("/login")} className='text-blue-500 hover:underline cursor-pointer hover:text-blue-600'>Login</p></h1>
            </div>
        </div>
        <div className='hidden'>
          <EmailSent email={email}/>
        </div>

    </div>

  )
}

export default Register;
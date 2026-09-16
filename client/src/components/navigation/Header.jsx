import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { formatDate } from '../../utils/formatDate'
import { AtSign, Bell, UserCircle } from 'lucide-react';

const Header = () => {
    const { user } = useContext(AuthContext);
  return (
    <div className='py-[9.5px] px-8 border-b flex items-center justify-between'>
        <div>
            <h1 className='text-2xl capitalize font-semibold'>Welcome, <span>{user?.name}</span> 👋</h1>
            <p className='text-sm mt-2'>{formatDate.dateTime(new Date())}</p>
        </div>
        <div className='flex items-center justify-center'>
            <Bell size={25}/>
            <div className='p-2 border-r-2 border-slate-400' />
            <div className='flex items-center justify-center gap-1 mx-3'>
                <img src={user?.avatar ? user.avatar : 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='} alt="User avatar" className='rounded-full w-10 h-10'/>
                <div className='flex items-center justify-center gap-0.5'>
                    <AtSign size={18}/>
                    <h1 className='text-md'>{user?.username}</h1>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default Header
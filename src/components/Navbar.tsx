'use client'
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { handleErrorToast, handleSuccesToast } from '@/toastFunctions';
import { Toaster } from 'react-hot-toast';

export default function Navbar(){
    const {data: session, status} = useSession()
    useEffect(() => {
        if(status == 'loading'){
            return
        }
        if(session){
            console.log(session.userId)
        }
    }, [session, status])
    const [showMenu, setShowMenu] = useState(false)
    const toggleDropdown = () => {
        if(showMenu){
            setShowMenu(false)
        } else {
            setShowMenu(true)
        }
    };

    const handleCreateTrivia = () => {
        if(session){
            redirect('trivia')
        } else if(!session){
            handleErrorToast("You have to be logged in!")
        }
    }
    return (
        <>
            <nav className="bg-gradient-to-r sticky top-0 from-blue-500 to-indigo-600 shadow-lg p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                    <a href="/" className="text-3xl font-extrabold text-white drop-shadow-md">
                        Trivia Competitors
                    </a>
                    </div>
                    <div className="hidden md:flex space-x-6">
                    <a
                        href="/"
                        className="text-white text-lg hover:text-indigo-200 transition duration-300"
                    >
                        Home
                    </a>
                    <button
                        onClick={handleCreateTrivia}
                        className="text-white text-lg hover:text-indigo-200 transition duration-300"
                    >
                        Create Trivia
                    </button>
                    <a
                        href="/contact"
                        className="text-white text-lg hover:text-indigo-200 transition duration-300"
                    >
                        Contact
                    </a>
                    </div>
            
                    <div className="hidden md:block">
                        {!session ? 
                        <a href="/login" className="relative ml-5 px-12 py-2 text-lg font-semibold text-blue-600 bg-white rounded-md shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 active:translate-y-1 active:shadow-md">Login</a>
                        :
                        <>
                            <button onClick={toggleDropdown}><Image src={session.user?.image ? session.user.image : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} className='rounded-full' alt='profile_picture' width={40} height={50}></Image></button>
                        </>
                        }
                        
                    </div>

                    {showMenu && (
                        <div className="absolute right-32 top-14 mt-2 w-48 bg-white transition-all duration-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                                <button
                                    onClick={() => signOut()}
                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                    My Profile
                                </button>
                                <button
                                    onClick={() => signOut()}
                                    className="block px-4 w-full py-2 text-sm text-red-700 hover:bg-gray-100"
                                    >
                                    Log out
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="md:hidden flex items-center">
                    <button className="text-white hover:text-indigo-200 focus:outline-none">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    </div>
                </div>
            </nav>
            <Toaster />
        </>
      );
}

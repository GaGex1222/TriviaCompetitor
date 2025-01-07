'use client'
import { signOut, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { handleErrorToast } from '@/toastFunctions';
import { Toaster } from 'react-hot-toast';
import { User, LogOut, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { House, BadgePlus, Key, List } from 'lucide-react';

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status == 'loading') {
            return;
        }
        if (session) {
            console.log(session.userId);
        }
    }, [session, status]);

    const [showMenu, setShowMenu] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    const toggleDropdown = () => {
        if(mobileMenu){
            toggleMobileMenu()
        }
        setShowMenu(!showMenu);
    };

    const toggleMobileMenu = () => {
        if(showMenu){
            toggleDropdown()
        }
        setMobileMenu(!mobileMenu);
    };

    const handleMobileButtonClick =  (pathToRoute: string) => {
        toggleMobileMenu()
        router.push(pathToRoute)
    }

    const handleCreateTrivia = () => {
        if (session) {
            redirect('/createtrivia');
        } else if (!session) {
            handleErrorToast("You have to be logged in!");
        }
    };

    return (
        <>
            <nav className="bg-gradient-to-tr sticky top-0 from-blue-500 to-indigo-600 shadow-md p-4 z-10 h-[75px]"> 
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-3xl font-extrabold text-white drop-shadow-md">
                            Trivia Competitors
                        </Link>
                        <p>
                            <Image alt='logo' className='drop-shadow-sm object-contain' height={80} width={80} src={'https://trivia-competitors-image-storage.s3.eu-north-1.amazonaws.com/image-removebg-preview.png'}/>
                        </p>
                    </div>
                    <div className="hidden md:flex space-x-12 flex-grow justify-center">
                        <Link
                            href="/"
                            className="text-white text-lg hover:text-indigo-200 transition duration-300"
                        >
                            Home
                        </Link>
                        <button
                            onClick={handleCreateTrivia}
                            className="text-white text-lg hover:text-indigo-200 transition duration-300"
                        >
                            Create Trivia
                        </button>
                        <a
                            href="/browse"
                            className="text-white text-lg hover:text-indigo-200 transition duration-300"
                        >
                            Browse
                        </a>
                        <a
                            href="/leaderboard"
                            className="text-white text-lg hover:text-indigo-200 transition duration-300"
                        >
                            Leaderboard
                        </a>
                    </div>
                    <div className="hidden md:block">
                        {!session ? (
                            <a
                                href="/login"
                                className="relative ml-5 px-12 py-2 text-lg font-semibold text-blue-600 bg-white rounded-md shadow-lg hover:bg-black hover:text-white transition duration-300 active:translate-y-1 active:shadow-md"
                            >
                                Login
                            </a>
                        ) : (
                            <>
                                <button onClick={toggleDropdown}>
                                    <Image
                                        src={
                                            session.user?.image
                                                ? session.user.image
                                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                        }
                                        className="rounded-full w-10 h-10 object-cover"
                                        width={80}
                                        height={80}
                                        alt="profile_picture"
                                    />
                                </button>
                            </>
                        )}
                    </div>

                    {showMenu && (
                        <div className="absolute right-44 top-14 mt-2 w-48 bg-gray-900 rounded-md shadow-lg">
                            <div className="">
                                <button
                                    onClick={() => {toggleDropdown(); redirect(`/profile/${session.user.name}`)}}
                                    className="rounded-md flex items-center justify-between w-full px-4 py-2 text-sm transition-all duration-300 text-indigo-400 hover:bg-gray-800 focus:outline-none"
                                >
                                    <span className="flex items-center space-x-2">
                                        <span>My Profile</span>
                                        <User className="h-5 w-5" />
                                    </span>
                                </button>
                                <hr className='opacity-20'/>
                                <button
                                    onClick={() => signOut()}
                                    className="rounded-md flex items-center justify-between w-full px-4 py-2 text-sm transition-all duration-300 text-red-700 hover:bg-gray-800 focus:outline-none"
                                >
                                    <span className="flex items-center space-x-2">
                                        <span>Log out</span>
                                        <LogOut className="h-5 w-5" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {mobileMenu && (
                        !session ? (
                            <div className="md:hidden absolute right-0 top-16 mt-2 w-48 bg-gray-900 rounded-md shadow-lg">
                            <button
                                onClick={() => handleMobileButtonClick('/')}
                                className="rounded-md px-4 py-2 text-sm text-indigo-400 hover:bg-gray-800 transition-all duration-300 flex justify-between items-center w-full"
                            >
                                <span>Home</span>
                                <House className="ml-2 w-4" />
                            </button>
                            <hr className="opacity-20" />
                            <button
                                onClick={() => handleMobileButtonClick('/createtrivia')}
                                className="rounded-md px-4 py-2 text-sm text-indigo-400 hover:bg-gray-800 transition-all duration-300 flex justify-between items-center w-full"
                            >
                                Create Trivia
                                <BadgePlus className="ml-2 w-4" />
                            </button>
                            <hr className="opacity-20" />
                            <button
                                onClick={() => handleMobileButtonClick('/browse')}
                                className="rounded-md px-4 py-2 text-sm text-indigo-400 hover:bg-gray-800 transition-all duration-300 flex justify-between items-center w-full"
                            >
                                Browse
                                <Search className="ml-2 w-4" />
                            </button>
                            <hr className="opacity-20" />
                            <button
                                onClick={() => handleMobileButtonClick('/leaderboard')}
                                className="rounded-md px-4 py-2 text-sm text-indigo-400 hover:bg-gray-800 transition-all duration-300 flex justify-between items-center w-full"
                            >
                                Leaderboard
                                <List className="ml-2 w-4" />
                            </button>
                            <hr className="opacity-20" />
                                <button
                                            onClick={() => handleMobileButtonClick('/login')}
                                            className="rounded-md px-4 py-2 text-sm text-indigo-400 hover:bg-gray-800 transition-all duration-300 flex justify-between items-center w-full"
                                        >
                                            Login
                                            <Key className="ml-2 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="absolute left-72 top-14 mt-2 w-48 bg-gray-900 rounded-md shadow-lg">
                                <div className="">
                                    <button
                                        onClick={() => {toggleMobileMenu(); redirect(`/profile/${session.user.name}`)}}
                                        className="rounded-md flex items-center justify-between w-full px-4 py-2 text-sm transition-all duration-300 text-indigo-400 hover:bg-gray-800 focus:outline-none"
                                    >
                                        <span className="flex items-center space-x-2">
                                            <span>My Profile</span>
                                            <User className="h-5 w-5" />
                                        </span>
                                    </button>
                                    <hr className='opacity-20'/>
                                    <button
                                        onClick={() => signOut()}
                                        className="rounded-md flex items-center justify-between w-full px-4 py-2 text-sm transition-all duration-300 text-red-700 hover:bg-gray-800 focus:outline-none"
                                    >
                                        <span className="flex items-center space-x-2">
                                            <span>Log out</span>
                                            <LogOut className="h-5 w-5" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMobileMenu} className="text-white hover:text-indigo-200 focus:outline-none">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            <Toaster />
        </>
    );
}

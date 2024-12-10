import { auth } from '@/auth';
import React from 'react'

export default async function Navbar(){
    const session = await auth()
    return (
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
              <a
                href="/about"
                className="text-white text-lg hover:text-indigo-200 transition duration-300"
              >
                About
              </a>
              <a
                href="/services"
                className="text-white text-lg hover:text-indigo-200 transition duration-300"
              >
                Services
              </a>
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
                <a className='text-white font-bold'>{session.user?.name}</a>
                }
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-white hover:text-indigo-200 focus:outline-none">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </nav>
      );
}

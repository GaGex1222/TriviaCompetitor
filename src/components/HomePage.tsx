'use client'
import { handleErrorToast } from '@/toastFunctions';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
    const {data: session} = useSession();
    const handleGetStarted = () => {
        if(session){
            redirect('trivia')
        } else {
            handleErrorToast("You have to be logged in!")
        }
    }
  return (
    <>
        <div className="h-screen flex flex-col justify-center items-center bg-cover bg-center">
            <div className="bg-gray-800 p-8 rounded-lg text-center" >
                <h1 className="text-white text-5xl font-bold mb-4">
                Welcome to TriviaCompetitors
                </h1>
                <p className="text-gray-200 text-lg mb-6">
                Compete, learn, and have fun! Test your knowledge against the best.
                </p>
                <button onClick={handleGetStarted} className="bg-indigo-600 text-white py-2 px-4 rounded transition-all duration-300 hover:bg-indigo-700">
                Get Started
                </button>
            </div>
        </div>
        <Toaster />
    </>
  );
}

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
                <button onClick={handleGetStarted} className="px-6 py-3 bg-gradient-to-t hover:bg-gradient-to-b from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:-translate-y-1 transition-all">
                Get Started
                </button>
            </div>
        </div>
        <Toaster />
    </>
  );
}

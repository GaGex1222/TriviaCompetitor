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
        <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
            <h1 className="text-white text-5xl font-bold mb-4">
            Welcome to TriviaCompetitors
            </h1>
            <p className="text-gray-200 text-lg mb-6">
            Compete, learn, and have fun! Test your knowledge against the best.
            </p>
            <button onClick={handleGetStarted} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:-translate-y-1 transition-all">
            Get Started
            </button>
        </div>
        </div>
        <Toaster />
    </>
  );
}

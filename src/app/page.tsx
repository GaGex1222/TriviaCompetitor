'use client'
import { MoveRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <>
        <div className="h-screen flex flex-col justify-center items-center bg-cover bg-center">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">
                    <span className="text-white">Play</span> or <span className="text-white">Create</span> Trivia<br />
                    for Knowledge and Competition
                </h1>
                <p className="text-gray-200 text-lg mb-6">
                    Challenge your knowledge and compete with others! Play solo or host a live trivia game to test your skills against friends and followers.<br/>
                    Unlock endless learning and fun. 100% free.
                </p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => redirect('/createtrivia')} className="bg-indigo-600 flex items-center text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-indigo-700">
                        Create a Trivia Template 
                        <span className='ml-2'>
                            <MoveRight/>
                        </span>
                    </button>
                    <button onClick={() => redirect('/browse')} className="bg-gray-200 flex text-gray-900 py-2 px-4 rounded transition-all duration-300 hover:bg-gray-300">
                        Play Trivia Now
                    </button>
                </div>
            </div>
        </div>
        <Toaster />
    </>
  );
}

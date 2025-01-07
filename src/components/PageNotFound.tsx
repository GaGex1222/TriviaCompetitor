'use client'
import { useRouter } from 'next/navigation';
import React from 'react';
import { MoveRight } from 'lucide-react';

export default function PageNotFound() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-cover bg-center">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-white mb-4">
          Oops! <span className="text-indigo-700">404</span>
        </h1>
        <p className="text-gray-200 text-lg mb-6">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.<br />
          But don’t worry! There’s still plenty to explore.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 flex items-center text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-indigo-700"
          >
            Go to Home
            <span className="ml-2">
              <MoveRight />
            </span>
          </button>
          <button
            onClick={() => router.push('/browse')}
            className="bg-gray-200 flex text-gray-900 py-2 px-4 rounded transition-all duration-300 hover:bg-gray-300"
          >
            Play Trivia Now
          </button>
        </div>
      </div>
    </div>
  );
}

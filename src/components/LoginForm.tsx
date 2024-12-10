'use client'
import React from 'react'
import GoogleLogo from './GoogleLogo'
import GithubLogo from './GithubLogo'
import { signIn } from 'next-auth/react'

export const LoginForm = () => {
  return (
    <>
        <div className="mt-40 flex justify-center">
        <div className="w-96 h-auto p-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex flex-col text-white font-semibold">
            <h1 className="text-2xl text-center">Sign-in</h1>
            <hr className="mt-4 border-white opacity-50" />
            <button onClick={async () => {signIn('google')}} className="flex items-center justify-center gap-3 border-white border-2 rounded-full px-4 py-2 mt-6 hover:bg-white hover:text-indigo-600 transition-all duration-300">
            <GoogleLogo/>
                <span>Sign in with Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 border-white border-2 rounded-full px-4 py-2 mt-6 hover:bg-white hover:text-indigo-600 transition-all duration-300">
            <GithubLogo/>
                <span>Sign in with Github</span>
            </button>
        </div>
        </div>
    </>
    
  )
}

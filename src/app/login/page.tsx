'use client'
import React from 'react'
import {LoginForm} from '@/components/LoginForm'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function LoginPage() {
    const {data: session} = useSession();
    if(session){
        redirect('/')
    }
  return (
    <>
        <LoginForm/>
    </>
  )
}

'use client'
import { UserData } from '@/interfaces/user'
import { handleErrorToast, handleSuccesToast } from '@/toastFunctions'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function EditProfilePage() {
    const router = useRouter()
    const { data: session, status, update } = useSession()
    const [userData, setUserData] = useState<UserData>()
    const [loading, setLoading] = useState(false)

    const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("userId" ,session.userId)
    
        try {
            const response = await fetch('/api/editUserProfile', {
                method: 'POST',
                body: formData, 
            });
            if (response.status === 200) {
                const result = await response.json();
                console.log("RESULT", result)
                const updatedUserData = result['data'][0]
                console.log("sddsdsss", updatedUserData)
                await update({
                    user: {
                        ...session.user,
                        image: updatedUserData.profileUrl,
                        name: updatedUserData.username
                    }
                })
                handleSuccesToast("Successfully saved changes!")
                router.push(`/profile/${updatedUserData.username}`)
            } 
        } catch (error) {
            console.error('Network error while updating profile:', error);
            handleErrorToast("Error while changing account information, try again later")
            return
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
            handleErrorToast("You have to be logged in to edit profile!")
            return
        }

        if (status === 'authenticated' && session?.user?.name) {
            const username = session.user.name
            const fetchUserData = async () => {
                setLoading(true)
                try {
                    const response = await fetch('/api/getUserData', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username })
                    })
                    const result = await response.json()
                    if (response.status === 200) {
                        setUserData(result.data[0])
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                } finally {
                    setLoading(false)
                }
            }
            fetchUserData()
        }
    }, [status, session, router])

    if (status === 'loading' || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin w-10 h-10 text-white" />
            </div>
        )
    }

    if (!userData) {
        return null // Or handle the "no data" case gracefully
    }

    return (
        <div className='items-center flex justify-center min-h-screen'>
            <div className="max-w-sm w-full bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl text-center text-white font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="profileImage" className="text-gray-400">Profile Image</label>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            className="bg-gray-700 text-white border border-gray-600 rounded-lg p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="bio" className="text-gray-400">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            placeholder="Write your bio..."
                            defaultValue={userData.bio}
                            className="bg-gray-700 text-white border border-gray-600 rounded-lg p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-gray-400">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            defaultValue={userData.username ? userData.username : ''}
                            className="bg-gray-700 text-white border border-gray-600 rounded-lg p-2"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

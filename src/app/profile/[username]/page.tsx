'use client'
import { UserData } from "@/interfaces/user";
import { Loader2, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ProfilePage({ params }) {
    const [username, setUsername] = useState();
    const [userData, setUserData] = useState<UserData>(null);
    useEffect(() => {
        const fetchUsername = async () => {
            const { username } = await params;
            console.log("sssss", username)
            setUsername(username);
        };
        fetchUsername();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch('/api/getUser', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username})
            })
            if(response.ok){
                const data = await response.json()
                setUserData(data.userData)
            }
        }
        fetchUserData()
    }, [username])

    return (
        <div className="text-white flex justify-center p-6">
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-md relative">
            <div className="h-36 bg-gray-900 rounded-t-lg relative">
            <div className="absolute inset-0 bg-gray-700 opacity-20"></div>
            </div>
            <div className="flex items-center justify-between px-6 py-4"> {/* Removed -mt-16 */}
            {userData ? (
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-600 border-4 border-indigo-700">
                        <img
                        className="w-full h-full object-cover rounded-full"
                        src={userData.profileUrl ? userData.profileUrl : ''}
                        alt="Profile"
                        />
                    </div>
                    <h1 className="text-3xl ml-2 font-semibold">{userData.username ? userData.username : "Gal"}</h1>
                </div>
            ) : (
                <Loader2 className="animate-spin w-5"/>
            )}
            <button className="flex items-center space-x-2 bg-indigo-600 text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-indigo-700">
                <span>Edit Profile</span>
                <Pencil className="w-4" />
            </button>
            </div>
            <div className="flex justify-around items-center border-t border-gray-700 py-4">
            <div className="text-center">
                <p className="text-xl font-bold text-indigo-500">26</p>
                <p className="text-gray-400 text-sm">Points</p>
            </div>
            <div className="text-center">
                <p className="text-indigo-500 text-xl font-bold">0</p>
                <p className="text-gray-400 text-sm">Quizzes</p>
            </div>
            </div>
        </div>
        </div>
    );
}

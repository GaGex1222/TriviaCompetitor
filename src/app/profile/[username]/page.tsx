'use client'
import PageNotFound from "@/components/PageNotFound";
import { UserSpecificTrivias } from "@/components/UserSpecificTrivias";
import { Trivia } from "@/interfaces/trivia";
import { UserData } from "@/interfaces/user";
import { Loader2, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { MoveRight, MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage({ params }) {
    const router = useRouter();
    const {data: session, status} = useSession();
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState<UserData>(null);
    const [userNotFound, setUserNotFound] = useState(false);
    const [userTriviaData, setUserTriviaData] = useState<Trivia[]>([]);
    const [loadingTrivias, setLoadingTrivias] = useState(true);
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState();
    useEffect(() => {
        const fetchUsername = async () => {
            const { username } = await params;
            console.log("sssss", username)
            setUsername(username);
        };
        fetchUsername();
    }, []);

    const handlePreviousPage = () => {
        if(!(page === 1)){
            setPage(page - 1)
        }
    }
    


    useEffect(() => {
        const fetchUserTrivias = async () => {
            setLoadingTrivias(true)
            console.log("SESS", session)
            const requestData = {
                userId: userId,
                page: page
            }
            const response = await fetch('/api/getUserTrivias', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
            const result = await response.json()
            if(response.status === 200){
                setUserTriviaData(result.data)
                setLoadingTrivias(false)
            }
        }
        fetchUserTrivias()
    }, [userId])

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch('/api/getUserData', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username})
            })
            const result = await response.json()
            if(response.status === 200){
                setUserData(result.data[0])
                setUserId(result.data[0].id)
            } else if(response.status === 500){
                console.log("ssss", result.userData)
                setUserNotFound(true)
            }
        }
        if(username.trim() !== ''){
            fetchUserData()
        }
    }, [username])


    if (userNotFound) {
        return <PageNotFound />;
    }

    if (!userData) {
        return (
            <div className="text-white flex h-screen justify-center p-6">
                <Loader2 className="animate-spin w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="text-white flex justify-center p-6">
            <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-md relative">
                <div className="h-36 bg-gray-900 rounded-t-lg relative">
                    <div className="absolute inset-0 bg-gray-700 opacity-20"></div>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-600 border-4 border-indigo-700">
                            <Image
                                className="w-full h-full object-cover rounded-full"
                                src={userData.profileUrl ? userData.profileUrl : 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'}
                                alt="Profile"
                                width={1000}
                                height={1000}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <h1 className="text-3xl ml-2 font-semibold">
                                {userData.username}
                            </h1>
                            <p className="text-gray-400 ml-2">
                                {userData.bio ? userData.bio : "No bio."}
                            </p>
                        </div>
                    </div>
                    {session && String(userData.id) === session.userId && (
                        <button onClick={() => router.push('/editprofile')} className="flex items-center space-x-2 bg-indigo-600 text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-indigo-700">
                            <span>Edit Profile</span>
                            <Pencil className="w-4" />
                        </button>
                    )}
                </div>
                <div className="flex justify-around items-center border-t border-gray-700 py-4">
                    <div className="text-center">
                        <p className="text-xl font-bold text-indigo-500">
                            {userData.points}
                        </p>
                        <p className="text-gray-400 text-sm">Points</p>
                    </div>
                    <div className="text-center">
                        <p className="text-indigo-500 text-xl font-bold text-center">{userTriviaData.length}</p>
                        <p className="text-gray-400 text-sm">Trivias</p>
                    </div>
                </div>
                <hr className="border-gray-700"/>
                <div className="space-y-2 mt-2">
                    {loadingTrivias ? (
                    // Show loading spinner
                        <div className="flex justify-center p-6">
                            <Loader2 className="animate-spin w-10 h-10" />
                        </div>
                    ) : userTriviaData.length > 0 ? (
                        <>
                            <div className="p-3 space-y-2">
                                <h1 className="text-2xl text-center font-bold text-white">
                                    User Trivias
                                </h1>
                                <UserSpecificTrivias triviaData={userTriviaData} page={page} />
                            </div>
                            <div className="flex justify-between items-center mt-4 p-3">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={page === 1}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <MoveLeft/>
                                </button>
                                <div className="text-gray-400">
                                    Page {page}
                                </div>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={userTriviaData.length < 4}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <MoveRight/>
                                </button>
                            </div>
                        </>
                    ): (
                        <div className="flex justify-center items-center p-6">
                            <p className="text-gray-400 text-lg">No trivias found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client'
import { UserData } from "@/interfaces/user";
import { handleErrorToast } from "@/toastFunctions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Leaderboard = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [usersData, setUsersData] = useState<UserData[]>([]);
    useEffect(() => {
      
        const fetchUserData = async () => {
          setLoading(true)
            const response = await fetch('/api/getUsersData')
            if(response.status === 200){
                const result = await response.json()
                setUsersData(result['data'])
                
            }
        }
        
        try{
            fetchUserData()
        } catch(err){
            console.error(err)
            handleErrorToast("Couldn't get users!")
        }
        setLoading(false)
    }, [])
    
  if(loading){
    return (
        <div className="text-white flex h-screen justify-center p-6">
            <Loader2 className="animate-spin w-10 h-10" />
        </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold mb-6 text-white">Leaderboard</h1>
      <div className="w-full max-w-3xl bg-gray-700 rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-2 font-bold text-indigo-400 border-b border-gray-600 pb-2 mb-4">
          <div>Username</div>
          <div>Points</div>
        </div>
        {usersData.map((entry, index) => (
          <div
            key={index}
            className={`grid grid-cols-2 items-center p-2 rounded-lg ${
              index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
            }`}
          >
            <a onClick={() => router.push(`/profile/${entry.username}`)} className="text-indigo-300 hover:cursor-pointer hover:underline">{entry.username}</a>
            <div className="text-indigo-300">{entry.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trivia } from "@/interfaces/trivia";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { handleErrorToast } from "@/toastFunctions";
export default function PlayTrivia({ params }) {

  const [triviaId, setTriviaId] = useState<number | undefined>(undefined);
  const [triviaData, setTriviaData] = useState<Trivia | undefined>(undefined);
  const router = useRouter();
  const {data: session} = useSession();

  const handlePlayButton = () => {
    if(session){
      router.push(`/playtrivia/${triviaData.id}`)
    } else {
      handleErrorToast("You have to be logged in to play!")
    }
  }

  useEffect(() => {
    const fetchTriviaId = async () => {
      const { triviaId } = await params;
      setTriviaId(triviaId);
    };
    fetchTriviaId();
    console.log(triviaId)
  }, []);

  useEffect(() => {
    if(!triviaId){
      return
    }
    async function fetchTriviaData(){
      const response = await fetch('/api/getSingleTrivia', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({triviaId})
      })
      if(response.ok){
        const data = await response.json()
        setTriviaData(data['data'])
      } else {
        console.log("oh no")
      }
    }
    fetchTriviaData()
  }, [triviaId])

  useEffect(() => {
    console.log("ssssss", triviaData)
  }, [triviaData])

  return (
  <div className="flex flex-col justify-center mt-10 items-center max-w-lg mx-auto">
      <div className="bg-gray-900 p-8 shadow-xl rounded-lg max-w-2xl">
        {triviaData ? (
          <>
            <div className="bg-gray-500 w-full h-60">
                <Image width={1000} height={1000} alt="quizImage" src={triviaData.imageUrl} className="object-cover w-full h-full" />
            </div>
            <div className="p-6">
              <h1 className="text-4xl text-center text-white font-semibold mb-4">{triviaData.title}</h1>
              <p className="text-lg text-center text-gray-300 mb-4">{triviaData.description}</p>
              <p className="text-sm text-center text-gray-400 mb-4">Created by: {triviaData.username}</p>
              <p className="text-sm text-center text-gray-400 mb-4">Questions {triviaData.questions.length}</p>
              <p className="text-xs text-center text-gray-500">Created at: {new Date(triviaData.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => router.push('/browse?page=1')}
                className="bg-indigo-600 text-white py-2 px-4 rounded mt-4 transition-all duration-300 hover:bg-indigo-700"
              >
                Browse More
              </button>
              <button
                onClick={handlePlayButton}
                className="bg-indigo-600 relative  text-white py-2 px-4 rounded mt-4 transition-all duration-300 hover:bg-indigo-700"
              >
                Play
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

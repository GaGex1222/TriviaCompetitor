'use client'
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trivia } from "@/interfaces/trivia";
export default function PlayTrivia({ params }) {

  const [triviaId, setTriviaId] = useState<number | undefined>(undefined);
  const [triviaData, setTriviaData] = useState<Trivia | undefined>(undefined);
  const router = useRouter();

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
        console.log("OK")
      } else {
        console.log("oh no")
      }
    }
    fetchTriviaData()
  }, [triviaId])

  useEffect(() => {
    console.log(triviaData)
  }, [triviaData])

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-2xl">
        {triviaData ? (
          <>
            <div className="bg-gray-500 w-full h-96">
              <img alt="quizImage" src={triviaData.imageUrl} className="object-cover w-full h-full" />
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
                onClick={() => router.push(`/playtrivia/${triviaData.id}`)}
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

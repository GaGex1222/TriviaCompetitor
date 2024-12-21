'use client'
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trivia } from "@/interfaces/trivia";
export default function PlayTrivia({ params }) {

  const [triviaId, setTriviaId] = useState<number | undefined>(undefined);
  const [triviaData, setTriviaData] = useState<Trivia>();
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
    if(!triviaData){
      return
    }
    async function fetchTriviaData(){
      const response = await fetch('/api/getSingleTrivia', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(triviaId)
      })
      if(response.ok){
        const data = await response.json()
        setTriviaData(data)
        console.log("OK")
      } else {
        console.log("oh no")
      }
    }
    fetchTriviaData()
  }, [triviaId])

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-2xl">
        <div className="bg-gray-500 w-full h-64">
          <img alt="quizImage" src={"sdgags"} className="object-cover w-full h-full" />
        </div>
        <div className="p-6">
          <h1 className="text-4xl text-white font-semibold mb-4">hjkhgkkhg</h1>
          <p className="text-lg text-gray-300 mb-4">hjgjhgj</p>
          <p className="text-sm text-gray-400 mb-4">Created by: </p>
          <p className="text-xs text-gray-500">Created at: </p>
        </div>
        <button
          onClick={() => router.back()}
          className="bg-indigo-600 text-white py-2 px-4 rounded mt-4 transition-all duration-300 hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

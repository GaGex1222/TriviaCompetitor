'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import { Trivia } from '@/interfaces/trivia';
import { TriviaFormErrors } from './TriviaFormErrors';

export default function BrowseSection(){
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [triviasData, setTriviasData] = useState<Array<Trivia>>();
  const router = useRouter();
  let pageParam = parseInt(searchParams.get('page'))

  useEffect(() => {
    if(!pageParam){
      pageParam = 1
      setPage(pageParam)
      router.push(`/browse?page=${pageParam}`)
    }
    setPage(pageParam)
  }, [])

  useEffect(() => {
    const getTrivias = async () => {

      try{
        const reponse = await fetch('/api/getTrivias', {
          method: "POST",
          body: JSON.stringify(page),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await reponse.json()
        const trivias = data['data']
        setTriviasData(trivias)
      } catch (error){
        console.log("ERRORR", error)
      }
    }
    getTrivias()
  }, [page])

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber)
    router.push(`/browse?page=${pageNumber}`)
  }

  const handleNextPage = () => {
    handlePageChange(page + 1)
    console.log("PAGe", page)
  }

  const handlePreviousPage = () => {
    if(page > 1){
      handlePageChange(page - 1)
    }
  }

  return (
    <>
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-7xl">
      <h2 className="text-4xl text-indigo-400 font-semibold text-center mb-8">Browse Quizzes</h2>
      {triviasData ? (
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {triviasData.map((trivia) => (
            <div
              key={trivia.id}
              className="group bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg rounded-lg overflow-hidden transform transition duration-200 hover:scale-105"
            >
              <div className="bg-gray-500 w-full h-32">
                <img
                  alt="quizImage"
                  src={trivia.imageUrl}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl hover:text-gray-300 hover:cursor-pointer text-white font-semibold mb-4" onClick={() => router.push(`/triviapreview/${trivia.id}`)}>{trivia.title}</h3>
                <p className="text-sm text-gray-300 mb-4">
                  {trivia.description}
                </p>
                <p className="text-xs text-gray-200 font-semibold">
                  Created by: <span className="text-indigo-300 hover:text-indigo-400">{trivia.username}</span>
                </p>
                <p className="text-xs text-gray-200 font-semibold">
                  Questions: <span className="text-indigo-300 hover:text-indigo-400">{trivia.questions.length}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePreviousPage}
            className="bg-indigo-600 text-white py-2 px-4 rounded transition-all duration-300 hover:bg-indigo-700 disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <p className="text-center text-indigo-600 text-xl flex-grow mx-4">
            {page}
          </p>
          <button
            disabled={triviasData ? triviasData.length < 8 : false}
            onClick={handleNextPage}
            className="bg-indigo-600 text-white py-2 px-4 rounded transition-all duration-300 hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";

export default function BrowseSection(){
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [triviasData, setTriviasData] = useState();
  const router = useRouter();
  let pageParam = parseInt(searchParams.get('page'))
  console.log(pageParam)
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
        setTriviasData(trivias[0])
      } catch (error){
        console.log("ERRORR", error)
      }
    }
    getTrivias()
  }, [page])

  useEffect(() => {
    if(!pageParam){
      pageParam = 1
      router.push(`/browse?page=${pageParam}`)
    }
    setPage(pageParam)
  }, [pageParam])

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
  {triviasData ? (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-6xl">
          <h2 className="text-4xl text-indigo-400 font-semibold text-center mb-8">Browse Quizzes</h2>
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="group bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-gray-500 w-full h-48">
                <img
                  alt="quizImage"
                  src="https://trivia-competitors-image-storage.s3.eu-north-1.amazonaws.com/1734641502863_13.png"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl text-white font-semibold mb-4">General Knowledge Quiz</h3>
                <p className="text-sm text-gray-300 text-center mb-4">
                  Test your knowledge on various topics, from science to pop culture.
                </p>
                <p className="text-xs text-gray-200 font-semibold text-center">
                  Created by: <a href='' className="font-semibold text-indigo-300 hover:text-indigo-400">Username123</a>
                </p>
              </div>
            </div>
          </div>
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
              onClick={handleNextPage}
              className="bg-indigo-600 text-white py-2 px-4 rounded transition-all duration-300 hover:bg-indigo-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <p>Loading</p>
  )}
}
'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import { Trivia } from '@/interfaces/trivia';
import { TriviaCard } from './TriviaCard';
import { Loader2 } from "lucide-react"

function BrowseSectionInner() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [triviasData, setTriviasData] = useState<Array<Trivia>>();
  const router = useRouter();
  let pageParam = parseInt(searchParams.get('page') || '1'); 

  useEffect(() => {
    if (!pageParam) {
      pageParam = 1;
      setPage(pageParam);
      router.push(`/browse?page=${pageParam}`);
    }
    setPage(pageParam);
  }, []);

  useEffect(() => {
    const getTrivias = async () => {
      try {
        const response = await fetch('/api/getTrivias', {
          method: "POST",
          body: JSON.stringify(page),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        const trivias = result['triviasWithQuestions'];
        setTriviasData(trivias);
      } catch (error) {
        console.log("ERRORR", error);
      }
    };
    getTrivias();
  }, [page]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    router.push(`/browse?page=${pageNumber}`);
  };

  const handleNextPage = () => {
    handlePageChange(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-auto mt-3">
      <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-7xl">
        <h2 className="text-4xl text-indigo-400 font-semibold text-center mb-8">Browse Quizzes</h2>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-h-[20rem]">
          {triviasData ? (
            triviasData.map((trivia) => (
              <TriviaCard key={trivia.id} trivia={trivia} />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center">
              <Loader2 className="animate-spin w-12 h-12 text-indigo-400" />
            </div>
          )}
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
            {triviasData ? page : ''}
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
  );
}

export default function BrowseSection() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading Data...</div>}>
      <BrowseSectionInner />
    </Suspense>
  );
}

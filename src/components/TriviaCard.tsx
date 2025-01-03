
import { TriviaCardProps } from '@/interfaces/props'
import { useRouter } from 'next/navigation'
import React from 'react'

export const TriviaCard: React.FC<TriviaCardProps> = ({trivia}) => {
    console.log("TRIVIA AT CARD", trivia)
    const router = useRouter();
  return (
        <div
        onClick={() => router.push(`/triviapreview/${trivia.id}`)}
        className="group bg-gradient-to-tr hover:cursor-pointer from-blue-500 to-indigo-600 text-white shadow-lg rounded-lg overflow-hidden transform transition duration-200 hover:scale-105"
        >
            <div className="bg-gray-500 w-full h-36">
            <img
                alt="quizImage"
                src={trivia.imageUrl}
                className="object-cover w-full h-full"
            />
        </div>
        <div className="p-6">
            <h3 className="text-xl text-white font-semibold mb-4">{trivia.title}</h3>
            <p className="text-sm text-gray-300 mb-4">
                {trivia.description}
            </p>
            <p className="text-xs text-gray-200 font-semibold">
                Created by: <span onClick={(e) => {e.stopPropagation(); router.push(`/profile/${trivia.username}`)}} className="text-indigo-300 hover:text-indigo-400 hover:underline">{trivia.username}</span>
            </p>
            <p className="text-xs text-gray-200 font-semibold">
                Questions: <span className="text-indigo-300">{trivia.questions.length}</span>
            </p>
        </div>
    </div>
  )
}

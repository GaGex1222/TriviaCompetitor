'use client'
import { UserSpecificTriviasProps } from '@/interfaces/props'
import React from 'react'
import { useRouter } from 'next/navigation'

export const UserSpecificTrivias: React.FC<UserSpecificTriviasProps> = ({triviaData, page}) => {
    const router = useRouter();
    const startIndex = (page - 1) * 4
    const endIndex = startIndex + 4
    const triviasToShow = triviaData.slice(startIndex, endIndex)

  return (
    <div className='space-y-4'>
        {triviasToShow.map((trivia) => (
            <div key={trivia.id} onClick={() => router.push(`/triviapreview/${trivia.id}`)} className="flex items-start space-x-4 bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transform transition duration-200 hover:scale-105 hover:cursor-pointer">
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img
                        className="w-full h-full object-cover"
                        src={trivia.imageUrl}
                        alt="Trivia image"
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">{trivia.title}</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {trivia.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-gray-300 text-sm">
                        <p>
                            <span className="font-bold">{trivia.questions.length}</span> {trivia.questions.length > 1 ? "Questions" : "Question"}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

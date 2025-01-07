'use client'
import { TrviaiResultsProps } from '@/interfaces/props';
import { MousePointerClick } from 'lucide-react';
import React, { useEffect } from 'react';

export const TriviaResults: React.FC<TrviaiResultsProps> = ({ userAnswers, questionsAndOptions, score, userId }) => {
    useEffect(() => {
        const incrementUserPoints = async () => {
            try{
                const input = {
                    userId: userId,
                    score: score
                }
                await fetch('/api/incrementUserPoints', {
                    method: "POST",
                    body: JSON.stringify(input)
                })
            } catch(err){
                console.log("Error occured when tried fetching the increment user points endpoint", err)
                return
            }
        }
        incrementUserPoints()
    })
    const handleOptionStyle = (index: number, option: string) => {
        let optionStyle = 'p-4 text-white rounded-lg bg-gray-700';

        if (userAnswers[index] !== null) {
            const isCorrect = questionsAndOptions[index].questionOptions[option]
            if (isCorrect) {
                optionStyle = 'text-white p-4 rounded-lg bg-green-600'
            }
            if (!isCorrect) {
                if (userAnswers[index] === option) {
                    optionStyle = 'bg-red-600 text-white p-4 rounded-lg'
                }
            }
        }

        return optionStyle
    }

    return (
        <div className="flex flex-col justify-center items-center top-0 min-h-screen mt-10 mb-10">
            <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-4xl">
                <div className="text-white text-center text-2xl font-semibold mb-6">
                    <h1 className='text-4xl text-indigo-400'>Nice work! You scored {`${score}/${questionsAndOptions.length}`} points</h1>
                    {score !== 0 && (
                        <h2 className='text-indigo-400 mt-2'>{score}  {score > 1 ? "points have" : "point has"} added been to your profile!</h2>
                    )}
                    <p className='mt-2 text-indigo-400'>Results overview:</p>
                </div>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-1 mb-6">
                    {questionsAndOptions.map((question, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <div className="text-white text-xl font-semibold mb-4">
                                <p>{question.title}</p>
                            </div>
                            <div className="space-y-4">
                                {Object.keys(question.questionOptions).map((option, optionIndex) => (
                                    <div
                                        key={optionIndex}
                                        className={`flex justify-between items-center ${handleOptionStyle(index, option)}`}
                                    >
                                        <p>{option}</p>
                                        {option === userAnswers[index] && <MousePointerClick />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

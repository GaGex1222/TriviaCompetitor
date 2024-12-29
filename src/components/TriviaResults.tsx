import { TrviaiResultsProps } from '@/interfaces/props';
import React from 'react';

export const TriviaResults: React.FC<TrviaiResultsProps> = ({ userAnswers, questionsAndOptions }) => {
    console.log("ARRRRR", questionsAndOptions);
    const handleOptionStyle = (index: number, option: string) => {
        console.log(questionsAndOptions[index].questionOptions)
        let optionStyle = 'p-4 text-white rounded-lg bg-gray-700';

        if (userAnswers[index] !== null) {
            const isCorrect = questionsAndOptions[index].questionOptions[option]
            if (isCorrect) {
                optionStyle = 'text-white p-4 rounded-lg bg-green-700'
            }
            if (!isCorrect) {
                if (userAnswers[index] === option) {
                    optionStyle = 'bg-red-400 text-white p-4 rounded-lg'
                }
            }
        }

        return optionStyle
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen mt-10 mb-10">
            <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-4xl">
                <div className="text-white text-2xl font-semibold mb-6">
                    <p className='text-center'>Trivia Results</p>
                </div>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-1 mb-6">
                    {questionsAndOptions.map((question, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            {/* Question Title */}
                            <div className="text-white text-xl font-semibold mb-4">
                                <p>{question.title}</p>
                            </div>
                            <div className="space-y-4">
                                {Object.keys(question.questionOptions).map((option, optionIndex) => (
                                    <div
                                        key={optionIndex}
                                        className={handleOptionStyle(index, option)}
                                    >
                                        <p>{option}</p>
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

'use client'
import { handleErrorToast, handleSuccesToast } from '@/toastFunctions';
import { useSession } from 'next-auth/react'
import React, { use, useEffect, useState } from 'react'

export const CreateTriviaForm = () => {
    interface Question {
        questionTitle: string;
        option1: string;
        option2: string;
        option3: string;
        option4: string;
    }
    const buttonStyle = "border-2 hover:shadow-lg hover:-translate-y-1 rounded-md transition duration-300 hover:bg-black hover:border-black hover:text-white text-black border-white p-2 bg-white active:translate-y-0"
    const [canCreateQuestion, setCanCreateQuestion] = useState(true);
    const {data: session} = useSession();
    const [questionsData, setQuestionsData] = useState<{ [key: number]: Question }>({
        1: {
            "questionTitle":"", 
            "option1": "", 
            "option2":"", 
            "option3":"", 
            "option4": ""
        },
    });
    const [questionDataArray, setQuestionDataArray] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(1);
    useEffect(() => {
        const questionsKeysArray = Object.keys(questionsData[questionIndex])
        const questionKeysArrayFiltered = questionsKeysArray.filter((key) => key.startsWith('option'))
        setQuestionDataArray((prevState) => prevState = questionKeysArrayFiltered)
    }, [questionsData, questionIndex])

    const handleQuestionChange = (event: React.FormEvent<HTMLInputElement>) => {
        const currentInputName = event.currentTarget.name as keyof Question;
        const currentInputValue = event.currentTarget.value;
        setQuestionsData((prevState) => ({
            ...prevState,
            [questionIndex]: {
                ...prevState[questionIndex],
                [currentInputName]: currentInputValue
            }
        }))
    }
    const handleNextButton = () => {
        if(questionIndex + 1 <= Object.keys(questionsData).length){
            setQuestionIndex((prevState) => prevState + 1)
        } else {
            handleErrorToast("That is the last question!")
        }
    }

    const handleOptionDelete = (keyName: string) => {
        if(Object.keys(questionsData[questionIndex]).length == 3){
            handleErrorToast("2 are the minimum options for a question!")
            return
        } else {
            const updatedQuestionsData = { ...questionsData }
            delete questionsData[questionIndex][keyName]
            setQuestionsData((prevState) => prevState = updatedQuestionsData)
        }
    }
    const handleQuestionCreation = () => {
        if(canCreateQuestion){
            const questionIndexToCreate = Object.keys(questionsData).length + 1
            setQuestionsData((prevState) => ({
                ...prevState,
                [questionIndexToCreate]: {
                    "questionTitle":"", 
                    "option1": "", 
                    "option2":"", 
                    "option3":"", 
                    "option4": ""
                }
            }))
            handleSuccesToast("Question Created Successfully!")
        } else {
            handleErrorToast('Wait before creating another question!')
            return
        }
        setCanCreateQuestion((prevState) => prevState = false)
        setTimeout(() => {
            setCanCreateQuestion((prevState) => prevState = true)
        }, 3000);

        
    }
    const handlePreviosQuestion = () => {
        if (questionIndex - 1 == 0){
            handleErrorToast("That is the first question!")
            return
        } else {
            setQuestionIndex((prevState) => prevState - 1)
        }
    }
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const questionsDataJSON = JSON.stringify(questionsData)
        formData.append('questionsData', questionsDataJSON)
        formData.append('userId', session?.userId as string)
        const fileUploaded: FormDataEntryValue | null = formData.get('fileInput')
        if (fileUploaded){
            if(fileUploaded instanceof File){
                const fileSize = fileUploaded.size
                const fileKbSize = fileSize / 1024
                const fileType: string = fileUploaded.type
                if(fileType.startsWith('image')){
                    if(fileKbSize < 3000){
                        try{
                            const response = await fetch('/api/createTrivia', {
                                method: "POST",
                                body: formData
                            })
                            const data = await response.json()
                        } catch (Exception) {
                            handleErrorToast("Couldn't create trivia, try again later!")
                            return
                        }
                    } else {
                        handleErrorToast("File is too large, maximum is 3MB")
                        return
                    }
                } else {
                    handleErrorToast("File is not an image.")
                    return
                }
            }
        } else {
            handleErrorToast("Couldn't get file from submission of form, try again later")
            return
        }

    }
    return(
        <>
            <div className="mt-12 flex justify-center">
                <div className="w-[1000px] h-auto p-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex flex-col text-white font-semibold">
                    <form onSubmit={handleFormSubmit} className='space-y-4 text-center'>
                        <label className='text-3xl'>Trivia Overview</label>
                        <br/>
                        <div className='mt-4'>
                            <label htmlFor="titleInput" className="block text-sm font-medium">Title</label>
                            <input 
                                type="text" 
                                name="titleInput" 
                                className="mt-1 p-2 w-full rounded-md text-black border-gray-300"
                                placeholder="Enter title"
                                required 
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="categoryInput" className="block text-sm font-medium">Category</label>
                            <input 
                                type="text"  
                                name="categoryInput" 
                                className="mt-1 p-2 w-full text-black rounded-md border-gray-300"
                                placeholder="Enter category"
                                required 
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="fileInput" className="block text-sm font-medium">Select Image</label>
                            <input 
                                type="file" 
                                id="fileInput" 
                                name="fileInput" 
                                className="mt-1 p-2 w-full rounded-md border-gray-300 border-2 bg-white text-black hover:bg-gray-100"
                                required 
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="questionInput" className="font-semibold block text-xl mb-2 text-center">
                                Question {`${questionIndex}/${Object.keys(questionsData).length}`}
                            </label>
                            <input
                                type="text" 
                                id="questionInput" 
                                name="questionTitle"
                                onChange={handleQuestionChange}
                                value={questionsData[questionIndex].questionTitle} 
                                className="mt-1 p-2 w-full rounded-md border-gray-300 text-black"
                                placeholder="Enter question"
                                required
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-5">
                            {questionDataArray.map((optionNumber, index) => {
                                return(
                                    <div className="relative mb-4" key={optionNumber}>
                                    <input
                                        type="text"
                                        name={optionNumber}
                                        onChange={handleQuestionChange}
                                        value={questionsData[questionIndex][optionNumber] || ''}
                                        className="p-2 w-full rounded-md text-black border-gray-300 pr-10" // Add padding-right for space for the button
                                        placeholder={`Enter Option ${index + 1}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleOptionDelete(optionNumber)}
                                        className="absolute right-2 top-1/2 transform transition-all -translate-y-1/2 text-red-500 hover:text-red-700"
                                    >
                                        🗑️ 
                                    </button>
                                </div>
                                );
                        })}
                        </div>
                        <div className="flex flex-col items-center mt-6">
                            <div className="flex space-x-4 mb-4"> 
                                <button type='button' onClick={handleQuestionCreation} className={buttonStyle}>
                                    Create Question
                                </button>
                                <button type='button' onClick={handleQuestionCreation} className={buttonStyle}>
                                    Create Option
                                </button>
                            </div>
                            <div className="flex justify-between w-full max-w-lg space-x-20 mt-5">
                                <button 
                                    type="button" 
                                    onClick={handlePreviosQuestion} 
                                    className={`flex-1 ${buttonStyle}`}>
                                    Previous Question
                                </button>
                                <button 
                                    type="submit" 
                                    className={`flex-1 ${buttonStyle}`}>
                                    Upload Trivia
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleNextButton} 
                                    className={`flex-1 ${buttonStyle}`}>
                                    Next Question
                                </button>
                            </div>
                        </div>

                    </form>
                    
                </div>
            </div>
        </>
    );
}


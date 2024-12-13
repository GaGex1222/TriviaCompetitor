'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

export const CreateTriviaForm = () => {
    const [fileError, setFileError] = useState('')
    const {data: session} = useSession();
    useEffect(() => {
        if(fileError){
            setTimeout(() => {
                setFileError('')
            }, 3000);
        }
    }, [fileError])
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const fileUploaded: FormDataEntryValue | null = formData.get('fileInput')
        if (fileUploaded){
            if(fileUploaded instanceof File){
                const fileSize = fileUploaded.size
                const fileKbSize = fileSize / 1024
                console.log(fileKbSize)
                const fileType: string = fileUploaded.type
                if(fileType.startsWith('image')){
                    if(fileKbSize < 3000){
                        try{
                            const inputBody = {
                                "formData": formData,
                                "userId": session?.userId
                            }
                            const response = await fetch('/api/createTrivia', {
                                method: "POST",
                                body: formData
                            })
                            const data = await response.json()
                            console.log(data)
                        } catch (Exception) {
                            setFileError("Couldn't create trivia, try again later!")
                            console.log(Exception)
                            return
                        }
                    } else {
                        setFileError("File is too large, maximum is 3MB")
                        return
                    }
                } else {
                    setFileError("File is not an image.")
                    return
                }
            }
        } else {
            setFileError("Couldn't get file from submission of form, try again later")
            return
        }

    }
    return(
        <>
            <div className="mt-40 flex justify-center">
                <div className="w-96 h-auto p-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex flex-col text-white font-semibold">
                    <form onSubmit={handleFormSubmit} className='space-y-3 text-center'>
                        <label className='text-3xl'>Trivia Overview</label>
                        <br/>
                        <div>
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
                                className="mt-1 p-2 w-full rounded-md border-gray-300 border-2"
                                required 
                            />
                        </div>
                        {fileError && <p className='text-red-'>{fileError}</p>}
                        <button type="submit" className="border-2 hover:shadow-lg hover:-translate-y-1 rounded-md transition duration-300 hover:bg-black hover:border-black hover:text-white text-black mt-4 border-white p-2 bg-white">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}


'use client'
import React from 'react'
import * as fs from "fs"

export const CreateTriviaForm = () => {
    const handleFileSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const fileUploaded = formData.get('fileInput')
        console.log(fs.createReadStream(fileUploaded))
    }
    return(
        <>
            <div className="mt-40 flex justify-center">
                <div className="w-96 h-auto p-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex flex-col text-white font-semibold">
                    <form onSubmit={handleFileSubmit} className='space-y-3 text-center'>
                        <label className=''>select image for trivia</label>
                        <br/>
                        <input type='file' name='fileInput'/>
                        <button type='submit' className='border-2 rounded-md text-black mt-2 border-white p-1 bg-white'>Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}


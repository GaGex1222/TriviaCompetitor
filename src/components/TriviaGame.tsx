import React from "react";



export default function TriviaGame(){
    return (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-indigo-600 text-white py-2 px-4 rounded transition-all duration-300">
                Timer: 60s
              </div>
            </div>
            <div className="bg-gray-500 w-full h-64 mb-6">
              <img
                alt="mainImage"
                src="https://via.placeholder.com/300"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
              <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <p>Question 1?</p>
              </div>
              <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <p>Question 2?</p>
              </div>
              <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <p>Question 3?</p>
              </div>
              <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <p>Question 4?</p>
              </div>
            </div>
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded transition-all duration-300 hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </div>
      );
}
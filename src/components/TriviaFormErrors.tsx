import { TriviaFormErrorsProps } from '@/interfaces/props'
import React from 'react'

export const TriviaFormErrors: React.FC<TriviaFormErrorsProps> = ({errors, onClose}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Validation Errors</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-red-500">
                {errors.map((error) => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
            <button onClick={onClose} className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
            Close
            </button>
        </div>
    </div>

  )
}

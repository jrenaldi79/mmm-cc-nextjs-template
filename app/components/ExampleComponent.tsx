'use client'

import React, { useState } from 'react'

export default function ExampleComponent() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  const handleIncrement = () => {
    setCount(count + 1)
    if (count + 1 === 10) {
      setMessage('🎉 You reached 10!')
    } else if (count + 1 === 20) {
      setMessage('🚀 Amazing! 20 clicks!')
    } else {
      setMessage('')
    }
  }

  const handleReset = () => {
    setCount(0)
    setMessage('')
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          This is an example interactive component. Click the button to see it in action!
        </p>
        
        {/* Counter Display */}
        <div className="mb-6">
          <p className="text-4xl font-bold text-purple-600 mb-2">
            {count}
          </p>
          {message && (
            <p className="text-lg text-blue-600 font-semibold animate-pulse">
              {message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={handleIncrement}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105"
          >
            Click Me! 
          </button>
          <button 
            onClick={handleReset}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all hover:scale-105"
          >
            Reset
          </button>
        </div>

        {/* Educational Note */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>💡 Student Note:</strong> This component uses React hooks (useState) and Tailwind CSS for styling. 
            Check out <code className="bg-gray-100 px-1 rounded text-purple-600">app/components/ExampleComponent.tsx</code> to see the code!
          </p>
        </div>
      </div>
    </div>
  )
}
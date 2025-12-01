'use client';

import { useState } from 'react';

export default function HealthChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-lg border">
          <div className="p-4 bg-green-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Health Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="p-4 h-80 flex items-center justify-center text-gray-500">
            Chatbot coming soon...
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        💬
      </button>
    </div>
  );
}
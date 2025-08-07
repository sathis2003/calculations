import React from 'react';

export default function Card({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-60 cursor-pointer border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-lg p-6 text-center shadow-md"
    >
      <h2 className="text-xl font-semibold">{title} Calculator</h2>
    </div>
  );
}
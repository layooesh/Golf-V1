import React from 'react';

interface HeaderProps {
  gameName: string;
  location: string;
  date: string;
  onGameNameChange: (name: string) => void;
  onLocationChange: (location: string) => void;
}

const Header: React.FC<HeaderProps> = ({ gameName, location, date, onGameNameChange, onLocationChange }) => {
  return (
    <header className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-golf-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 014 10zm11.5 0a.75.75 0 00-.75-.75h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 00.75-.75zM10 4a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 4zm0 9.5a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75z" clipRule="evenodd" />
                <path d="M10 11a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                Golf Score <span className="text-golf-green-500">Free</span>
            </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <input
            type="text"
            value={gameName}
            onChange={(e) => onGameNameChange(e.target.value)}
            placeholder="Game Name"
            className="w-full sm:w-auto px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-golf-green-500 transition"
          />
           <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Location"
            className="w-full sm:w-auto px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-golf-green-500 transition"
          />
          <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
            {date}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
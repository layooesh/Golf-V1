import React from 'react';
import { GameState } from '../types';

interface SavedGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedGames: GameState[];
  onSave: () => void;
  onLoad: (gameId: string) => void;
  onDelete: (gameId: string) => void;
}

const SavedGamesModal: React.FC<SavedGamesModalProps> = ({ isOpen, onClose, savedGames, onSave, onLoad, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="saved-games-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 id="saved-games-title" className="text-xl font-bold">Manage Saved Games</h2>
            <button onClick={onClose} aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <button onClick={onSave} className="w-full mb-4 bg-golf-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-golf-green-600 transition">Save Current Game</button>
        <div className="flex-grow overflow-y-auto -mr-2 pr-2">
          {savedGames.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No saved games yet.</p>
          ) : (
            <ul className="space-y-3">
              {savedGames.map(game => (
                <li key={game.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-grow mb-2 sm:mb-0 sm:pr-4">
                    <p className="font-semibold">
                      {game.gameName || 'Untitled Game'}
                      {game.location && <span className="font-normal text-gray-600 dark:text-gray-400"> at {game.location}</span>}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{game.date} - {game.players.length} players - {game.holes} holes</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => onLoad(game.id!)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition">Load</button>
                    <button onClick={() => onDelete(game.id!)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedGamesModal;
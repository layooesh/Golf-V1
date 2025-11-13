
import React from 'react';

interface ActionsProps {
  onAddPlayer: () => void;
  onOpenNewGameModal: () => void;
  onOpenSavedGamesModal: () => void;
  onSaveGame: () => void;
  onShare: () => void;
  canShare: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode; 'aria-label'?: string; disabled?: boolean; }> = ({ onClick, className, children, 'aria-label': ariaLabel, disabled = false }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : 'transform hover:scale-105'} ${className}`}
        aria-label={ariaLabel}
    >
        {children}
    </button>
);


const Actions: React.FC<ActionsProps> = ({ onAddPlayer, onOpenNewGameModal, onOpenSavedGamesModal, onSaveGame, onShare, canShare }) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <ActionButton onClick={onAddPlayer} className="bg-golf-green-500 text-white hover:bg-golf-green-600 focus:ring-golf-green-500" aria-label="Add a new player">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Player</span>
            </ActionButton>

            <ActionButton onClick={onSaveGame} className="bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500" aria-label="Save current game">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H7a3 3 0 00-3 3v1.586A2 2 0 013 10V6a2 2 0 012-2zm10 4H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" />
                </svg>
                <span>Save</span>
            </ActionButton>

            <ActionButton onClick={onOpenSavedGamesModal} className="bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500" aria-label="Manage saved games">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm0 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6zM8.5 6a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-3z" />
                </svg>
                <span>Games</span>
            </ActionButton>

            {canShare && (
                 <ActionButton onClick={onShare} className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500" aria-label="Share scorecard">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <span>Share</span>
                </ActionButton>
            )}
            
            <ActionButton onClick={onOpenNewGameModal} className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500" aria-label="Start a new game">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>New Game</span>
            </ActionButton>
        </div>
    </div>
  );
};

export default Actions;
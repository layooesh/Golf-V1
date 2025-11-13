
import React from 'react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (holes: 9 | 18) => void;
}

const NewGameModal: React.FC<NewGameModalProps> = ({ isOpen, onClose, onStart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="new-game-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 id="new-game-title" className="text-xl font-bold mb-4">Start a new game?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Choose the number of holes. Your current scorecard will be cleared.</p>
        <div className="flex justify-between gap-4">
          <button onClick={() => onStart(9)} className="flex-1 bg-golf-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-golf-green-600 transition">9 Holes</button>
          <button onClick={() => onStart(18)} className="flex-1 bg-golf-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-golf-green-600 transition">18 Holes</button>
        </div>
        <button onClick={onClose} className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancel</button>
      </div>
    </div>
  );
};

export default NewGameModal;

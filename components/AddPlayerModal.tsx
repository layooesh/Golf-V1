import React, { useState } from 'react';
import { SavedPlayer } from '../types';

interface AddPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    savedPlayers: SavedPlayer[];
    onAddFromSaved: (player: SavedPlayer) => void;
    onAddNew: (playerName: string) => void;
    onDeleteSaved: (playerId: string) => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, savedPlayers, onAddFromSaved, onAddNew, onDeleteSaved }) => {
    const [newPlayerName, setNewPlayerName] = useState('');

    if (!isOpen) return null;

    const handleAddNewPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlayerName.trim()) {
            onAddNew(newPlayerName.trim());
            setNewPlayerName('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-player-title">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 id="add-player-title" className="text-xl font-bold">Add Player</h2>
                    <button onClick={onClose} aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Add New Player</h3>
                    <form onSubmit={handleAddNewPlayer} className="flex gap-2">
                        <input
                            type="text"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            placeholder="Enter player name"
                            className="flex-grow px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-golf-green-500 transition"
                            aria-label="New player name"
                        />
                        <button type="submit" className="bg-golf-green-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-golf-green-600 transition disabled:opacity-50" disabled={!newPlayerName.trim()}>Add</button>
                    </form>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">To save a player for future games, add them to the scorecard and click the save icon that appears next to their name.</p>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Add from Saved Players</h3>
                    {savedPlayers.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No saved players yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {savedPlayers.map(player => (
                                <li key={player.id} className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg flex items-center justify-between">
                                    <span className="font-medium">{player.name}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => onAddFromSaved(player)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition">Add</button>
                                        <button onClick={() => onDeleteSaved(player.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition" aria-label={`Delete ${player.name} from saved players`}>Delete</button>
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

export default AddPlayerModal;

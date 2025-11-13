
import React from 'react';
import { Player } from '../types';
import PlayerRow from './PlayerRow';

interface ScorecardProps {
  players: Player[];
  onNameChange: (id: string, newName: string) => void;
  onScoreChange: (playerId: string, holeIndex: number, score: number | null) => void;
  onRemovePlayer: (playerId: string) => void;
  movePlayer: (dragIndex: number, hoverIndex: number) => void;
}

const ScorecardHeader: React.FC = () => (
    <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
        <tr>
            <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wider w-1/4 min-w-[150px]">Player</th>
            {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                <th key={hole} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wider min-w-[45px] sm:min-w-[50px]">{hole}</th>
            ))}
            <th className="p-2 sm:p-3 text-center text-xs sm:text-sm font-bold text-golf-green-700 dark:text-golf-green-400 bg-golf-green-100 dark:bg-golf-green-900/50 tracking-wider min-w-[45px] sm:min-w-[50px]">OUT</th>
            {Array.from({ length: 9 }, (_, i) => i + 10).map(hole => (
                <th key={hole} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wider min-w-[45px] sm:min-w-[50px]">{hole}</th>
            ))}
            <th className="p-2 sm:p-3 text-center text-xs sm:text-sm font-bold text-golf-green-700 dark:text-golf-green-400 bg-golf-green-100 dark:bg-golf-green-900/50 tracking-wider min-w-[45px] sm:min-w-[50px]">IN</th>
            <th className="p-2 sm:p-3 text-center text-xs sm:text-sm font-bold text-golf-green-700 dark:text-golf-green-400 bg-golf-green-100 dark:bg-golf-green-900/50 tracking-wider min-w-[45px] sm:min-w-[50px]">TOT</th>
        </tr>
    </thead>
);

const Scorecard: React.FC<ScorecardProps> = ({ players, onNameChange, onScoreChange, onRemovePlayer, movePlayer }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <ScorecardHeader />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {players.map((player, index) => (
            <PlayerRow
              key={player.id}
              index={index}
              player={player}
              onNameChange={onNameChange}
              onScoreChange={onScoreChange}
              onRemove={onRemovePlayer}
              movePlayer={movePlayer}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scorecard;

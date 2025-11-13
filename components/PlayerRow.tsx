import React, { useRef } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { Player } from '../types';
import { calculateTotals } from '../utils/score';

const ItemTypes = {
  PLAYER: 'player',
};

interface PlayerRowProps {
  player: Player;
  index: number;
  holes: 9 | 18;
  onNameChange: (id: string, newName: string) => void;
  onScoreChange: (playerId: string, holeIndex: number, score: number | null) => void;
  onRemove: (playerId: string) => void;
  movePlayer: (dragIndex: number, hoverIndex: number) => void;
  onSave: (player: Player) => void;
  isSaved: boolean;
}

interface ScoreCellProps {
    score: number | null;
    playerId: string;
    holeIndex: number;
    onScoreChange: (playerId: string, holeIndex: number, score: number | null) => void;
}

const ScoreCell: React.FC<ScoreCellProps> = ({ score, playerId, holeIndex, onScoreChange }) => {
    const isHoleInOne = score === 1;
    return (
        <td 
            className={`relative transition-colors ${
                holeIndex === 8 ? 'border-r-2 border-golf-green-200 dark:border-golf-green-800' : ''
            } ${
                isHoleInOne ? 'bg-yellow-200/75 dark:bg-yellow-900/50' : ''
            }`}
        >
            {isHoleInOne && (
                <span className="absolute top-1 right-1 text-yellow-500 dark:text-yellow-400" title="Hole in one!">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </span>
            )}
            <input
                type="number"
                min="1"
                value={score ?? ''}
                onChange={(e) => {
                    const value = e.target.value;
                    onScoreChange(playerId, holeIndex, value === '' ? null : parseInt(value, 10))
                }}
                className={`w-full h-10 text-center bg-transparent focus:outline-none focus:bg-golf-green-50 dark:focus:bg-golf-green-900/50 rounded ${
                    isHoleInOne ? 'font-extrabold text-yellow-700 dark:text-yellow-200' : ''
                }`}
                aria-label={`Score for hole ${holeIndex + 1}`}
            />
        </td>
    );
};


const PlayerRow: React.FC<PlayerRowProps> = ({ player, index, holes, onNameChange, onScoreChange, onRemove, movePlayer, onSave, isSaved }) => {
  const totals = calculateTotals(player.scores);
  const ref = useRef<HTMLTableRowElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.PLAYER,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      movePlayer(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.PLAYER,
    item: () => ({ id: player.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  return (
    <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="p-2 sm:p-3 whitespace-nowrap">
        <div className="flex items-center">
            <div ref={drag} className="cursor-move pr-2 text-gray-400 hover:text-gray-600" aria-label={`Drag to reorder ${player.name}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 10a1 1 0 11-2 0 1 1 0 012 0zM11 10a1 1 0 11-2 0 1 1 0 012 0zM15 11a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
            </div>
            <input
                type="text"
                value={player.name}
                onChange={(e) => onNameChange(player.id, e.target.value)}
                className="w-full bg-transparent font-medium focus:outline-none focus:ring-1 focus:ring-golf-green-500 rounded px-1 -mx-1"
                aria-label={`Player name for ${player.name}`}
            />
            <button
                onClick={() => onSave(player)}
                disabled={isSaved}
                className="ml-2 text-gray-400 disabled:text-golf-green-500 hover:text-blue-500 disabled:hover:text-golf-green-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                aria-label={isSaved ? `${player.name} is saved` : `Save ${player.name} to list`}
                title={isSaved ? `${player.name} is saved` : `Save ${player.name} to list`}
            >
                {isSaved ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H7a3 3 0 00-3 3v1.586A2 2 0 013 10V6a2 2 0 012-2zm10 4H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" />
                    </svg>
                )}
            </button>
             <button
                onClick={() => onRemove(player.id)}
                className="ml-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${player.name}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
      </td>
      
      {/* Front 9 */}
      {player.scores.slice(0, 9).map((score, holeIndex) => (
          <ScoreCell key={holeIndex} score={score} playerId={player.id} holeIndex={holeIndex} onScoreChange={onScoreChange} />
      ))}

      {/* OUT */}
      <td className="p-2 sm:p-3 text-center font-bold text-golf-green-800 dark:text-golf-green-300 bg-golf-green-50 dark:bg-golf-green-900/30">{totals.out || '-'}</td>
      
      {/* Back 9 */}
      {holes === 18 && player.scores.slice(9, 18).map((score, holeIndexOffset) => {
          const holeIndex = holeIndexOffset + 9;
          return <ScoreCell key={holeIndex} score={score} playerId={player.id} holeIndex={holeIndex} onScoreChange={onScoreChange} />
      })}

      {/* IN */}
      {holes === 18 && (
        <td className="p-2 sm:p-3 text-center font-bold text-golf-green-800 dark:text-golf-green-300 bg-golf-green-50 dark:bg-golf-green-900/30">{totals.in || '-'}</td>
      )}

      {/* TOTAL */}
      <td className="p-2 sm:p-3 text-center font-bold text-golf-green-800 dark:text-golf-green-300 bg-golf-green-50 dark:bg-golf-green-900/30">{totals.total || '-'}</td>
    </tr>
  );
};

export default PlayerRow;

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
  onNameChange: (id: string, newName: string) => void;
  onScoreChange: (playerId: string, holeIndex: number, score: number | null) => void;
  onRemove: (playerId: string) => void;
  movePlayer: (dragIndex: number, hoverIndex: number) => void;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, index, onNameChange, onScoreChange, onRemove, movePlayer }) => {
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
            <div ref={drag} className="cursor-move pr-2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 10a1 1 0 11-2 0 1 1 0 012 0zM11 10a1 1 0 11-2 0 1 1 0 012 0zM15 11a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
            </div>
            <input
                type="text"
                value={player.name}
                onChange={(e) => onNameChange(player.id, e.target.value)}
                className="w-full bg-transparent font-medium focus:outline-none focus:ring-1 focus:ring-golf-green-500 rounded px-1 -mx-1"
            />
             <button
                onClick={() => onRemove(player.id)}
                className="ml-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${player.name}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
      </td>
      {player.scores.map((score, holeIndex) => {
        const isHoleInOne = score === 1;
        return (
            <td 
                key={holeIndex} 
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
                        onScoreChange(player.id, holeIndex, value === '' ? null : parseInt(value, 10))
                    }}
                    className={`w-full h-10 text-center bg-transparent focus:outline-none focus:bg-golf-green-50 dark:focus:bg-golf-green-900/50 rounded ${
                        isHoleInOne ? 'font-extrabold text-yellow-700 dark:text-yellow-200' : ''
                    }`}
                />
            </td>
        )
      })}
      <td className="p-2 sm:p-3 text-center font-bold text-golf-green-800 dark:text-golf-green-300 bg-golf-green-50 dark:bg-golf-green-900/30 border-r-2 border-golf-green-200 dark:border-golf-green-800">{totals.out || '-'}</td>
      <td className="p-2 sm:p-3 text-center font-bold text-golf-green-800 dark:text-golf-green-300 bg-golf-green-50 dark:bg-golf-green-900/30 border-r-2 border-golf-green-200 dark:border-golf-green-800">{totals.in || '-'}</td>
      <td className="p-2 sm:p-3 text-center font-bold text-golf-green-800 dark:text-golf-green-300 bg-golf-green-50 dark:bg-golf-green-900/30">{totals.total || '-'}</td>
    </tr>
  );
};

export default PlayerRow;
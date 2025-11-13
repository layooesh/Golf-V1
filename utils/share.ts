
import { GameState } from '../types';
import { calculateTotals } from './score';

export const generateShareText = (gameState: GameState): string => {
  let text = `⛳ Golf Scorecard ⛳\n\n`;
  text += `Club: ${gameState.clubName || 'N/A'}\n`;
  text += `Date: ${gameState.date}\n`;
  text += `------------------------------------\n`;

  gameState.players.forEach(player => {
    const totals = calculateTotals(player.scores);
    text += `${player.name}:\n`;
    const outScores = player.scores.slice(0, 9).map(s => s ?? '-').join(', ');
    const inScores = player.scores.slice(9, 18).map(s => s ?? '-').join(', ');

    text += `  Front 9: ${outScores}  (OUT: ${totals.out})\n`;
    text += `  Back 9:  ${inScores}  (IN: ${totals.in})\n`;
    text += `  Total Score: ${totals.total}\n\n`;
  });
  
  text += `Shared from Golf Score Free!`;

  return text;
};

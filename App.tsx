
import React, { useState, useCallback, useMemo } from 'react';
import { GameState, Player } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateShareText } from './utils/share';
import Header from './components/Header';
import Scorecard from './components/Scorecard';
import Actions from './components/Actions';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const createNewPlayer = (playerNumber: number): Player => ({
  id: crypto.randomUUID(),
  name: `Player ${playerNumber}`,
  scores: Array(18).fill(null),
});

const getInitialState = (): GameState => ({
  clubName: '',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  players: [createNewPlayer(1)],
});

const App: React.FC = () => {
  const [gameState, setGameState] = useLocalStorage<GameState>('golfScorecard', getInitialState());
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  
  const handleClubNameChange = useCallback((name: string) => {
    setGameState(prev => ({ ...prev, clubName: name }));
  }, [setGameState]);

  const handleAddPlayer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, createNewPlayer(prev.players.length + 1)],
    }));
  }, [setGameState]);
  
  const handleRemovePlayer = useCallback((playerId: string) => {
    setGameState(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== playerId),
    }));
  }, [setGameState]);


  const handlePlayerNameChange = useCallback((id: string, newName: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === id ? { ...p, name: newName } : p),
    }));
  }, [setGameState]);

  const handleScoreChange = useCallback((playerId: string, holeIndex: number, score: number | null) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => {
        if (p.id === playerId) {
          const newScores = [...p.scores];
          newScores[holeIndex] = score;
          return { ...p, scores: newScores };
        }
        return p;
      }),
    }));
  }, [setGameState]);

  const handleResetGame = useCallback(() => {
    if (window.confirm("Are you sure you want to start a new game? All current data will be lost.")) {
      setGameState(getInitialState());
    }
  }, [setGameState]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Golf Scorecard',
      text: generateShareText(gameState),
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 3000);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 3000);
      } catch (err) {
        alert("Sharing not supported. Scorecard copied to clipboard.");
      }
    }
  }, [gameState]);
  
  const movePlayer = useCallback((dragIndex: number, hoverIndex: number) => {
    setGameState(prev => {
      const draggedPlayer = prev.players[dragIndex];
      const newPlayers = [...prev.players];
      newPlayers.splice(dragIndex, 1);
      newPlayers.splice(hoverIndex, 0, draggedPlayer);
      return {...prev, players: newPlayers};
    });
  }, [setGameState]);

  const canShare = useMemo(() => navigator.share || navigator.clipboard, []);

  return (
    <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
        <main className="container mx-auto p-2 sm:p-4">
            <Header
            clubName={gameState.clubName}
            date={gameState.date}
            onClubNameChange={handleClubNameChange}
            />

            <div className="mt-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                <Scorecard 
                    players={gameState.players}
                    onNameChange={handlePlayerNameChange}
                    onScoreChange={handleScoreChange}
                    onRemovePlayer={handleRemovePlayer}
                    movePlayer={movePlayer}
                />
            </div>

            <Actions
            onAddPlayer={handleAddPlayer}
            onResetGame={handleResetGame}
            onShare={handleShare}
            canShare={canShare}
            />
            {showShareSuccess && (
            <div className="fixed bottom-5 right-5 bg-golf-green-600 text-white py-2 px-4 rounded-lg shadow-xl animate-bounce">
                {navigator.share ? 'Scorecard shared!' : 'Scorecard copied to clipboard!'}
            </div>
            )}
        </main>
        </div>
    </DndProvider>
  );
};

export default App;


import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameState, Player, SavedPlayer } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateShareText } from './utils/share';
import Header from './components/Header';
import Scorecard from './components/Scorecard';
import Actions from './components/Actions';
import NewGameModal from './components/NewGameModal';
import SavedGamesModal from './components/SavedGamesModal';
import AddPlayerModal from './components/AddPlayerModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const createNewPlayer = (playerNumber: number, holes: 9 | 18): Player => ({
  id: crypto.randomUUID(),
  name: `Player ${playerNumber}`,
  scores: Array(holes).fill(null),
});

const getInitialState = (holes: 9 | 18 = 18): GameState => ({
  id: crypto.randomUUID(),
  gameName: '',
  location: '',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  players: [createNewPlayer(1, holes)],
  holes,
});

const App: React.FC = () => {
  const [gameState, setGameState] = useLocalStorage<GameState>('golfScorecard', getInitialState());
  const [savedGames, setSavedGames] = useLocalStorage<GameState[]>('golf-saved-games', []);
  const [savedPlayers, setSavedPlayers] = useLocalStorage<SavedPlayer[]>('golf-saved-players', []);
  
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [isSavedGamesModalOpen, setIsSavedGamesModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  
  useEffect(() => {
    const gamesFromStorage: GameState[] = JSON.parse(localStorage.getItem('golf-saved-games') || '[]');
    let hasChanges = false;
    const migratedGames = gamesFromStorage.map(game => {
      if (!game.id) {
        hasChanges = true;
        return { ...game, id: crypto.randomUUID() };
      }
      return game;
    });

    if (hasChanges) {
      setSavedGames(migratedGames);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleGameNameChange = useCallback((name: string) => {
    setGameState(prev => ({ ...prev, gameName: name }));
  }, [setGameState]);

  const handleLocationChange = useCallback((location: string) => {
    setGameState(prev => ({ ...prev, location: location }));
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

  const startNewGame = useCallback((holes: 9 | 18) => {
    const newGame = getInitialState(holes);
    let maxGameNum = 0;
    savedGames.forEach(game => {
        const match = game.gameName.match(/^Game #(\d+)/);
        if (match && parseInt(match[1]) > maxGameNum) {
            maxGameNum = parseInt(match[1]);
        }
    });
    const newGameNum = maxGameNum + 1;
    newGame.gameName = `Game #${newGameNum.toString().padStart(2, '0')}`;

    setGameState(newGame);
    setIsNewGameModalOpen(false);
  }, [setGameState, savedGames]);

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

  const handleSaveGame = useCallback(() => {
    setSavedGames(prev => {
        const existingIndex = prev.findIndex(g => g.id === gameState.id);
        if (existingIndex > -1) {
            const newSavedGames = [...prev];
            newSavedGames[existingIndex] = gameState;
            return newSavedGames;
        }
        return [...prev, gameState];
    });
    alert("Game saved!");
  }, [gameState, setSavedGames]);

  const handleLoadGame = useCallback((gameId: string) => {
    if (window.confirm("Loading this game will overwrite your current scorecard. Are you sure you want to continue?")) {
        const gameToLoad = savedGames.find(g => g.id === gameId);
        if (gameToLoad) {
            setGameState(gameToLoad);
            setIsSavedGamesModalOpen(false);
        }
    }
  }, [savedGames, setGameState]);

  const handleDeleteGame = useCallback((gameId: string) => {
      if (window.confirm("Are you sure you want to delete this saved game? This action cannot be undone.")) {
          setSavedGames(prev => prev.filter(g => g.id !== gameId));
      }
  }, [setSavedGames]);

  const handleSavePlayer = useCallback((player: Player) => {
    const trimmedName = player.name.trim();
    if (!trimmedName) {
        alert("Player name cannot be empty.");
        return;
    }
    if (savedPlayers.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
        return;
    }
    setSavedPlayers(prev => [...prev, { id: crypto.randomUUID(), name: trimmedName }]);
  }, [savedPlayers, setSavedPlayers]);

  const isPlayerSaved = useCallback((playerName: string) => {
      return savedPlayers.some(p => p.name.toLowerCase() === playerName.trim().toLowerCase());
  }, [savedPlayers]);

  const handleAddPlayerFromSaved = useCallback((player: SavedPlayer) => {
    if (gameState.players.some(p => p.name.toLowerCase() === player.name.toLowerCase())) {
        alert(`${player.name} is already in the game.`);
        return;
    }
    setGameState(prev => ({
        ...prev,
        players: [...prev.players, {
            id: crypto.randomUUID(),
            name: player.name,
            scores: Array(prev.holes).fill(null),
        }],
    }));
    setIsAddPlayerModalOpen(false);
  }, [gameState.players, setGameState]);

  const handleAddNewPlayerToGame = useCallback((playerName: string) => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;
    if (gameState.players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
        alert(`${trimmedName} is already in the game.`);
        return;
    }
    setGameState(prev => ({
        ...prev,
        players: [...prev.players, {
            id: crypto.randomUUID(),
            name: trimmedName,
            scores: Array(prev.holes).fill(null),
        }]
    }));
    setIsAddPlayerModalOpen(false);
  }, [gameState.players, setGameState]);

  const handleDeleteSavedPlayer = useCallback((playerId: string) => {
    if (window.confirm("Are you sure you want to remove this player from your saved list?")) {
        setSavedPlayers(prev => prev.filter(p => p.id !== playerId));
    }
  }, [setSavedPlayers]);

  const canShare = useMemo(() => !!(navigator.share || navigator.clipboard), []);

  return (
    <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
            <main className="container mx-auto p-2 sm:p-4">
                <Header
                gameName={gameState.gameName}
                location={gameState.location}
                date={gameState.date}
                onGameNameChange={handleGameNameChange}
                onLocationChange={handleLocationChange}
                />

                <div className="mt-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                    <Scorecard 
                        players={gameState.players}
                        holes={gameState.holes}
                        onNameChange={handlePlayerNameChange}
                        onScoreChange={handleScoreChange}
                        onRemovePlayer={handleRemovePlayer}
                        movePlayer={movePlayer}
                        onSavePlayer={handleSavePlayer}
                        isPlayerSaved={isPlayerSaved}
                    />
                </div>

                <Actions
                    onAddPlayer={() => setIsAddPlayerModalOpen(true)}
                    onOpenNewGameModal={() => setIsNewGameModalOpen(true)}
                    onOpenSavedGamesModal={() => setIsSavedGamesModalOpen(true)}
                    onSaveGame={handleSaveGame}
                    onShare={handleShare}
                    canShare={canShare}
                />
                {showShareSuccess && (
                <div className="fixed bottom-5 right-5 bg-golf-green-600 text-white py-2 px-4 rounded-lg shadow-xl animate-bounce">
                    {navigator.share ? 'Scorecard shared!' : 'Scorecard copied to clipboard!'}
                </div>
                )}
            </main>
            <NewGameModal
                isOpen={isNewGameModalOpen}
                onClose={() => setIsNewGameModalOpen(false)}
                onStart={startNewGame}
            />
            <SavedGamesModal
                isOpen={isSavedGamesModalOpen}
                onClose={() => setIsSavedGamesModalOpen(false)}
                savedGames={savedGames}
                onSave={handleSaveGame}
                onLoad={handleLoadGame}
                onDelete={handleDeleteGame}
            />
            <AddPlayerModal
                isOpen={isAddPlayerModalOpen}
                onClose={() => setIsAddPlayerModalOpen(false)}
                savedPlayers={savedPlayers}
                onAddFromSaved={handleAddPlayerFromSaved}
                onAddNew={handleAddNewPlayerToGame}
                onDeleteSaved={handleDeleteSavedPlayer}
            />
        </div>
    </DndProvider>
  );
};

export default App;
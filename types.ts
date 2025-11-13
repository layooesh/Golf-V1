export interface Player {
  id: string;
  name: string;
  scores: (number | null)[];
}

export interface SavedPlayer {
  id: string;
  name: string;
}

export interface GameState {
  id: string;
  gameName: string;
  location: string;
  date: string;
  players: Player[];
  holes: 9 | 18;
}

export interface Player {
  id: string;
  name: string;
  scores: (number | null)[];
}

export interface GameState {
  clubName: string;
  date: string;
  players: Player[];
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Team {
  name: string;
  flag: string;
  players: Player[];
}

interface Player {
  id: string;
  name: string;
  role: string;
  battingStats: {
    matches: number;
    runs: number;
    average: number;
    strikeRate: number;
  };
  bowlingStats: {
    matches: number;
    wickets: number;
    economy: number;
    average: number;
  };
  fantasyPoints: number[];
  recentForm: string;
}

interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  date: string;
  time: string;
  venue: string;
  league: string;
  status: 'upcoming' | 'live' | 'completed';
  liveScore?: {
    teamAScore: string;
    teamBScore: string;
  };
  result?: {
    winner: string;
    margin: string;
  };
  prediction?: {
    winnerPrediction: string;
    winProbability: number;
    dream11Team: {
      captain: Player;
      viceCaptain: Player;
      players: Player[];
    };
  };
}

interface MatchState {
  matches: Match[];
  selectedMatch: Match | null;
  loading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  matches: [],
  selectedMatch: null,
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
    },
    setSelectedMatch: (state, action: PayloadAction<Match>) => {
      state.selectedMatch = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMatches, setSelectedMatch, setLoading, setError } = matchSlice.actions;
export default matchSlice.reducer;
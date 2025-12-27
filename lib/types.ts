export type Team = {
  id: number;
  name: string;
  logo?: string;
  country?: string;
  founded?: number;
};

export type Fixture = {
  fixture: {
    id: number;
    date: string;
    venue?: { name?: string };
  };
  teams: {
    home: { id: number; name: string; logo?: string; winner?: boolean | null };
    away: { id: number; name: string; logo?: string; winner?: boolean | null };
  };
  goals: { home: number | null; away: number | null };
};

export type LineupPlayer = {
  id: number;
  name: string;
  number?: number;
  position?: string;
  pos?: string;
  grid?: string | null;
};

export type Lineup = {
  team: {
    id: number;
    name: string;
    logo?: string;
    colors?: {
      goalkeeper?: { primary?: string };
      player?: { primary?: string };
    };
  };
  formation: string;
  startXI: { player: LineupPlayer }[];
};

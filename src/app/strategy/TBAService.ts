import { key } from "@/app/globalVars";

const TBA_AUTH_KEY = "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO";
const BASE_URL = "https://www.thebluealliance.com/api/v3";

export interface TBATeam {
  team_number: number;
  nickname: string;
  key: string;
}

export interface TBAMatch {
  key: string;
  comp_level: string;
  match_number: number;
  alliances: {
    blue: {
      team_keys: string[];
      score: number;
    };
    red: {
      team_keys: string[];
      score: number;
    };
  };
}

export interface TBARanking {
  rankings: Array<{
    rank: number;
    team_key: string;
    matches_played: number;
    qual_average: number;
    extra_stats: number[];
    sort_orders: number[];
  }>;
  sort_order_info: Array<{
    name: string;
    precision: number;
  }>;
}

export interface TeamRankingData {
  rank: number;
  teamNumber: number;
  matchesPlayed: number;
  rp: number;
  autoRP: number;
  coralRP: number;
  bargeRP: number;
}

const fetchWithTBA = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "X-TBA-Auth-Key": TBA_AUTH_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from TBA API: ${endpoint}`, error);
    throw error;
  }
};

export const getTeams = async (): Promise<TBATeam[]> => {
  return fetchWithTBA(`/event/${key}/teams`);
};

export const getMatches = async (): Promise<TBAMatch[]> => {
  return fetchWithTBA(`/event/${key}/matches`);
};

export const getQualificationMatches = async (): Promise<TBAMatch[]> => {
  const matches = await getMatches();
  return matches.filter(match => match.comp_level === "qm").sort((a, b) => a.match_number - b.match_number);
};

export const getRankings = async (): Promise<TeamRankingData[]> => {
  const data: TBARanking = await fetchWithTBA(`/event/${key}/rankings`);
  
  return data.rankings.map(ranking => {
    const rp = ranking.extra_stats[0];
    const sortOrders = ranking.sort_orders;
    
    return {
      rank: ranking.rank,
      teamNumber: parseInt(ranking.team_key.substring(3)),
      matchesPlayed: ranking.matches_played,
      rp: rp,
      // These are estimates as TBA doesn't directly provide these breakdowns
      autoRP: Math.round(ranking.matches_played * (sortOrders[0] || 0)),
      coralRP: Math.round(ranking.matches_played * (sortOrders[1] || 0)),
      bargeRP: Math.round(ranking.matches_played * (sortOrders[2] || 0))
    };
  });
}; 
"use client";
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps
} from 'recharts';

interface MatchData {
  start: {
    match: number;
    [key: string]: any;
  };
  auto: {
    coral: number;
    algae: number;
    mobility: boolean;
    leave: number;
    l4: number;
    l3: number;
    l2: number;
    l1: number;
    processor: number;
    barge: number;
    [key: string]: any;
  };
  teleop: {
    coral: number;
    algae: number;
    l4Scored: number;
    l3Scored: number;
    l2Scored: number;
    l1Scored: number;
    processorScored: number;
    bargeScored: number;
    deep: number;
    shallow: number;
    park: number;
    [key: string]: any;
  };
  endgame: {
    climb: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export function Last5Matches({ matches }: { matches: MatchData[] }) {
  // Sort matches by match number
  const sortedMatches = [...matches].sort((a, b) => 
    (a.start?.match || 0) - (b.start?.match || 0)
  );
  
  // Get the last 5 matches
  const last5 = sortedMatches.slice(-5);
  
  // Calculate scores for each match using the official scoring system
  const matchScores = last5.map(match => {
    // Calculate auto points using the official scoring
    const autoPoints = 
      (match.auto?.l4 || 0) * 7 +
      (match.auto?.l3 || 0) * 6 +
      (match.auto?.l2 || 0) * 4 +
      (match.auto?.l1 || 0) * 3 +
      (match.auto?.leave || 0) * 3 +
      (match.auto?.processor || 0) * 6 +
      (match.auto?.barge || 0) * 4;
    
    // Calculate teleop points using the official scoring
    const teleopPoints = 
      (match.teleop?.l4Scored || 0) * 5 +
      (match.teleop?.l3Scored || 0) * 4 +
      (match.teleop?.l2Scored || 0) * 3 +
      (match.teleop?.l1Scored || 0) * 2 +
      (match.teleop?.processorScored || 0) * 6 +
      (match.teleop?.bargeScored || 0) * 4;
    
    // Calculate endgame points using the official scoring
    const endgamePoints = 
      (match.teleop?.deep || 0) * 12 +
      (match.teleop?.shallow || 0) * 6 +
      (match.teleop?.park || 0) * 2;
    
    const totalScore = autoPoints + teleopPoints + endgamePoints;
    
    return {
      match: match.start?.match.toString() || "0",
      total: totalScore,
      auto: autoPoints,
      teleop: teleopPoints,
      endgame: endgamePoints
    };
  });
  
  // Calculate average PPG
  const avgPPG = matchScores.length > 0 
    ? matchScores.reduce((sum, match) => sum + match.total, 0) / matchScores.length 
    : 0;
  
  if (matchScores.length === 0) {
    return <div className="text-gray-500 italic">No match data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold mb-4">PPG Trend (Last 5 Matches)</h2>
        <div className="text-xl font-bold">
          Avg: {avgPPG.toFixed(1)} pts
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={matchScores}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="match" label={{ value: 'Match Number', position: 'insideBottomRight', offset: -10 }} />
            <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              labelClassName="text-gray-500"
              labelFormatter={(label) => `Match ${label}`}
              formatter={(value, name, props) => {
                let displayName = name;
                if (name === "total") displayName = "Total";
                if (name === "auto") displayName = "Auto";
                if (name === "teleop") displayName = "Teleop";
                if (name === "endgame") displayName = "Endgame";
                
                return [`${value} points`, displayName];
              }}
              itemSorter={(item) => {
                // Sort items in tooltip: Total first, then Auto, Teleop, Endgame
                const order = { total: 1, auto: 2, teleop: 3, endgame: 4 };
                return order[item.dataKey as keyof typeof order] || 5;
              }}
            />
            <Legend />
            <ReferenceLine y={avgPPG} stroke="#ff7300" strokeDasharray="3 3" label="Average" />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#8884d8" 
              name="Total" 
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="auto" stroke="#82ca9d" name="Auto" />
            <Line type="monotone" dataKey="teleop" stroke="#ffc658" name="Teleop" />
            <Line type="monotone" dataKey="endgame" stroke="#ff8042" name="Endgame" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {matchScores.map((score, index) => (
          <div key={index} className="text-center p-2 border rounded">
            <div className="font-bold">Match {score.match}</div>
            <div className={`text-lg ${score.total > avgPPG ? 'text-green-500' : 'text-red-500'}`}>
              {score.total} pts
            </div>
            <div className="text-xs text-gray-400">
              {score.total > avgPPG ? '+' : ''}{(score.total - avgPPG).toFixed(1)} from avg
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { AggregateData } from "@/app/interfaces";
import { setCookie } from "@/app/cookies/cookies";
import { ArrowUpDown, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/app/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

interface TeamPPGStats {
  team: number;
  avgPPG: number;
  topPPG: number;
  lowestPPG: number;
  matchCount: number;
}

/**
 * @param teamData an AggregateData array of all the teams data
 * @returns a sortable table showing PPG statistics
 */
export default function PPGTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [ppgStats, setPPGStats] = useState<TeamPPGStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'avgPPG', direction: 'desc' });

  useEffect(() => {
    const fetchPPGStats = async () => {
      setLoading(true);
      
      try {
        const statsPromises = teamData.map(async (teamDataItem) => {
          try {
            const team = teamDataItem.team;
            const teamCollectionRef = collection(db, team.toString());
            const querySnapshot = await getDocs(teamCollectionRef);
            
            if (querySnapshot.empty) {
              return {
                team,
                avgPPG: 0,
                topPPG: 0,
                lowestPPG: 0,
                matchCount: 0
              };
            }
            
            let totalPoints = 0;
            let maxPoints = 0;
            let minPoints = Infinity;
            let matchCount = 0;
            
            querySnapshot.forEach((doc) => {
              if (doc.id !== "aggregate") {
                const matchData = doc.data().matchData;
                if (!matchData) return;
                
                // Calculate points using the same logic as in calculateAggregate.tsx
                const autoPoints = 
                  (matchData.auto.l4 || 0) * 7 +
                  (matchData.auto.l3 || 0) * 6 +
                  (matchData.auto.l2 || 0) * 4 +
                  (matchData.auto.l1 || 0) * 3 +
                  (matchData.auto.leave || 0) * 3 +
                  (matchData.auto.processor || 0) * 6 +
                  (matchData.auto.barge || 0) * 4;
                
                const teleopPoints = 
                  (matchData.teleop.l4Scored || 0) * 5 +
                  (matchData.teleop.l3Scored || 0) * 4 +
                  (matchData.teleop.l2Scored || 0) * 3 +
                  (matchData.teleop.l1Scored || 0) * 2 +
                  (matchData.teleop.processorScored || 0) * 6 +
                  (matchData.teleop.bargeScored || 0) * 4;
                
                const endgamePoints = 
                  (matchData.teleop.deep || 0) * 12 +
                  (matchData.teleop.shallow || 0) * 6 +
                  (matchData.teleop.park || 0) * 2;
                
                const totalMatchPoints = autoPoints + teleopPoints + endgamePoints;
                
                totalPoints += totalMatchPoints;
                maxPoints = Math.max(maxPoints, totalMatchPoints);
                minPoints = Math.min(minPoints, totalMatchPoints);
                matchCount++;
              }
            });
            
            return {
              team,
              avgPPG: matchCount > 0 ? totalPoints / matchCount : 0,
              topPPG: maxPoints,
              lowestPPG: minPoints === Infinity ? 0 : minPoints,
              matchCount
            };
          } catch (error) {
            console.error(`Error calculating PPG stats for team ${teamDataItem.team}:`, error);
            return {
              team: teamDataItem.team,
              avgPPG: 0,
              topPPG: 0,
              lowestPPG: 0,
              matchCount: 0
            };
          }
        });
        
        const results = await Promise.all(statsPromises);
        setPPGStats(results);
      } catch (error) {
        console.error("Error fetching PPG stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPPGStats();
  }, []);

  const sortKeys = {
    team: (data: TeamPPGStats) => data.team,
    avgPPG: (data: TeamPPGStats) => data.avgPPG,
    topPPG: (data: TeamPPGStats) => data.topPPG,
    lowestPPG: (data: TeamPPGStats) => data.lowestPPG,
    matchCount: (data: TeamPPGStats) => data.matchCount,
  };

  const sortData = (key: keyof typeof sortKeys) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...ppgStats].sort((a, b) => {
    const getValue = sortKeys[sortConfig.key];
    const aValue = getValue(a);
    const bValue = getValue(b);
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  if (loading) {
    return <div>Loading PPG statistics...</div>;
  }

  return (
    <div className="rounded-md border border-gray-700 bg-[#121212]">
      <Table>
        <TableHeader>
          <TableRow>
            {Object.entries(sortKeys).map(([key, _]) => (
              <TableHead key={key} className="p-0">
                <Button 
                  className="bg-[#004d40] hover:bg-[#00695c] text-white w-full rounded-none h-full" 
                  onClick={() => sortData(key as keyof typeof sortKeys)}
                >
                  {key === 'avgPPG' ? 'Avg PPG' : 
                   key === 'topPPG' ? 'Top Points' : 
                   key === 'lowestPPG' ? 'Lowest Points' : 
                   key === 'matchCount' ? 'Matches' : 
                   'Team'}
                  {sortConfig.key === key ? (
                    sortConfig.direction === 'asc' 
                      ? <ArrowUpIcon className="ml-2 h-4 w-4" />
                      : <ArrowDownIcon className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((data) => (
            <TableRow 
              key={data.team}
              className="cursor-pointer hover:bg-gray-800 text-gray-200"
              onClick={() => {
                router.push("/stats/teams");
                setCookie("Team", data.team.toString());
              }}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.avgPPG.toFixed(2)}</TableCell>
              <TableCell>{data.topPPG}</TableCell>
              <TableCell>{data.lowestPPG === Infinity ? 'N/A' : data.lowestPPG}</TableCell>
              <TableCell>{data.matchCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 
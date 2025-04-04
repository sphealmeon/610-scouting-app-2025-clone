"use client";

import { getTeamCoralCyclesArray } from "@/app/firebase/generateArrayOfDataGivenTeam";
import { useState, useEffect } from "react";
import { key, teams, useApi } from "@/app/globalVars";
import BoxPlotChart from "./BoxPlotChart";

export default function BoxPlotPage() {
  const [allTeamsData, setAllTeamsData] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teamsList, setTeamsList] = useState<string[]>([]);

  // First, fetch the list of teams
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      
      try {
        if (useApi) {
          const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${key}/teams`, {
            method: "GET",
            headers: {
              "X-TBA-Auth-Key": "x3Sqnzlw0RuZZ4LcGbByIaHC5bpxa11X3YDA6NknR1VhFzYwcIyJsrAhNGh2cTcW",
            },
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch teams: ${response.status}`);
          }
          
          const data = await response.json();
          const allTeams: string[] = [];
          
          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              allTeams.push(data[index].team_number + "");
            }
          } else {
            allTeams.push(data.team_number + "");
          }
          
          setTeamsList(allTeams);
        } else {
          setTeamsList(teams);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to fetch teams");
        setTeamsList(teams); // Fallback to static teams list
      }
    };
    
    fetchTeams();
  }, []);

  // Then, fetch coral cycles data for each team
  useEffect(() => {
    const fetchAllTeamsData = async () => {
      if (teamsList.length === 0) return;
      
      try {
        const teamsData: Record<string, string[]> = {};
        let completedRequests = 0;
        const totalTeams = teamsList.length;
        
        // Process teams in batches to avoid overwhelming Firebase
        const batchSize = 5;
        const batches = [];
        
        for (let i = 0; i < totalTeams; i += batchSize) {
          batches.push(teamsList.slice(i, i + batchSize));
        }
        
        for (const batch of batches) {
          await Promise.all(
            batch.map(async (team) => {
              try {
                const cycles = await getTeamCoralCyclesArray(Number(team));
                if (cycles && cycles.length > 0) {
                  teamsData[team] = cycles;
                }
                completedRequests++;
                
                // Update loading message every 5 teams
                if (completedRequests % 5 === 0) {
                  setLoading(true); // Keep loading state active
                }
              } catch (err) {
                console.error(`Error fetching data for team ${team}:`, err);
              }
            })
          );
          
          // Small delay between batches to be nice to Firebase
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        setAllTeamsData(teamsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to fetch team data");
        setLoading(false);
      }
    };
    
    if (teamsList.length > 0) {
      fetchAllTeamsData();
    }
  }, [teamsList]);

  if (loading && Object.keys(allTeamsData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Loading Team Data</h1>
        <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
        <p>Fetching coral cycles data for all teams. This may take a moment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const teamCount = Object.keys(allTeamsData).length;
  
  if (teamCount === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">No Data Available</h1>
        <p>No teams have coral cycle data available.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Team Coral Cycles Boxplot</h1>
      <p className="mb-4">Showing data for {teamCount} teams</p>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <BoxPlotChart teamsData={allTeamsData} title="Team Coral Cycles Distribution" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(allTeamsData)
          .sort(([_, cyclesA], [__, cyclesB]) => {
            // Sort by average coral cycles (descending)
            const avgA = cyclesA.reduce((sum, val) => sum + Number(val), 0) / cyclesA.length;
            const avgB = cyclesB.reduce((sum, val) => sum + Number(val), 0) / cyclesB.length;
            return avgB - avgA;
          })
          .map(([team, cycles]) => (
            <div key={team} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-2">Team {team}</h2>
              <p>Matches: {cycles.length}</p>
              <p>Average Cycles: {(cycles.reduce((sum, val) => sum + Number(val), 0) / cycles.length).toFixed(2)}</p>
              <p>Max Cycles: {Math.max(...cycles.map(Number))}</p>
              <p className="mt-2 text-sm text-gray-600">
                Cycles by match: {cycles.join(", ")}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
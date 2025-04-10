"use client";

import { getTeamCoralCyclesArray } from "@/app/firebase/generateArrayOfCoralDataGivenTeam";
import { getTeamAlgaeCyclesArray } from "@/app/firebase/generateArrayOfAlgaeDataGivenTeam";
import { useState, useEffect } from "react";
import { key, teams, useApi } from "@/app/globalVars";
import BoxPlotChart from "./BoxPlotChart";
import AlgaeBoxPlotChart from "./AlgaeBoxPlotChart";

export default function BoxPlotPage() {
  const [allTeamsCoralData, setAllTeamsCoralData] = useState<Record<string, string[]>>({});
  const [allTeamsAlgaeData, setAllTeamsAlgaeData] = useState<Record<string, string[]>>({});
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

  // Then, fetch coral and algae cycles data for each team
  useEffect(() => {
    const fetchAllTeamsData = async () => {
      if (teamsList.length === 0) return;
      
      try {
        const coralData: Record<string, string[]> = {};
        const algaeData: Record<string, string[]> = {};
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
                // Fetch coral cycles
                const coralCycles = await getTeamCoralCyclesArray(Number(team));
                if (coralCycles && coralCycles.length > 0) {
                  coralData[team] = coralCycles;
                }
                
                // Fetch algae cycles
                const algaeCycles = await getTeamAlgaeCyclesArray(Number(team));
                if (algaeCycles && algaeCycles.length > 0) {
                  algaeData[team] = algaeCycles;
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
        
        setAllTeamsCoralData(coralData);
        setAllTeamsAlgaeData(algaeData);
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

  if (loading && Object.keys(allTeamsCoralData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Loading Team Data</h1>
        <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
        <p>Fetching coral and algae cycles data for all teams. This may take a moment...</p>
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

  const coralTeamCount = Object.keys(allTeamsCoralData).length;
  const algaeTeamCount = Object.keys(allTeamsAlgaeData).length;
  
  if (coralTeamCount === 0 && algaeTeamCount === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">No Data Available</h1>
        <p>No teams have cycle data available.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {coralTeamCount > 0 && (
        <>
          <h1 className="text-2xl font-bold mb-2">Team Coral Cycles Boxplot</h1>
          <p className="mb-4">Showing data for {coralTeamCount} teams</p>
          
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <BoxPlotChart teamsData={allTeamsCoralData} title="Team Coral Cycles Distribution" />
          </div>
        </>
      )}
      
      {algaeTeamCount > 0 && (
        <>
          <h1 className="text-2xl font-bold mb-2">Team Algae Cycles Boxplot</h1>
          <p className="mb-4">Showing data for {algaeTeamCount} teams</p>
          
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <AlgaeBoxPlotChart teamsData={allTeamsAlgaeData} title="Team Algae Cycles Distribution" />
          </div>
        </>
      )}
    </div>
  );
}
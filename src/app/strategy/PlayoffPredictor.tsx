"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTeams } from "./TBAService";
import {
  TeamCapabilities,
  AllianceCapabilities,
  convertToTeamCapabilities
} from "./RPPredictor";
import {
  Alliance,
  PlayoffBracket,
  simulatePlayoffs,
} from "./PlayoffBracket";
import { db } from "@/app/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AggregateData } from "@/app/interfaces";

interface AllianceInputs {
  [key: string]: {
    teams: [number, number, number];
  };
}

// Function to fetch team data from Firebase
const fetchTeamData = async (teamNumber: number): Promise<TeamCapabilities> => {
  try {
    // Fetch actual data from Firebase
    const docRef = doc(db, teamNumber.toString(), "aggregate");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().aggregateData) {
      const teamData = docSnap.data().aggregateData as AggregateData;
      console.log(`Fetched data for team ${teamNumber}:`, teamData);
      return convertToTeamCapabilities(teamData);
    }
    
    // Fallback to random data if no data exists
    console.log(`No data found for team ${teamNumber}, using default values`);
    return {
      teamNumber,
      autoPPG: Math.random() * 15,
      teleopPPG: Math.random() * 30,
      endgamePPG: Math.random() * 15,
      autoCoralPieces: Math.random() * 4,
      teleopCoralPieces: Math.random() * 8,
      autoAlgaePieces: Math.random() * 2,
      teleopAlgaePieces: Math.random() * 4,
      maxAutoCoralPieces: Math.random() * 5,
      maxTeleopCoralPieces: Math.random() * 10,
      hasProcessor: Math.random() > 0.5, // 50% chance of having processor
      hasBarge: Math.random() > 0.5, // 50% chance of having a barge
      reliability: 0.8 + Math.random() * 0.2, // 80-100% reliability
      coralCyclesScored: Math.random() * 8,
      algaeCyclesScored: Math.random() * 3,
      autoL1Accuracy: Math.random() * 0.9,
      autoL2Accuracy: Math.random() * 0.8,
      autoL3Accuracy: Math.random() * 0.7,
      autoL4Accuracy: Math.random() * 0.6,
      teleopL1Accuracy: Math.random() * 0.9,
      teleopL2Accuracy: Math.random() * 0.8,
      teleopL3Accuracy: Math.random() * 0.7,
      teleopL4Accuracy: Math.random() * 0.6,
      teleopBargeAccuracy: Math.random() * 0.8,
      teleopProcessorAccuracy: Math.random() * 0.8,
      shallowAccuracy: Math.random() * 0.7,
      deepAccuracy: Math.random() * 0.6
    };
  } catch (error) {
    console.error(`Error fetching data for team ${teamNumber}:`, error);
    return {
      teamNumber,
      autoPPG: 0,
      teleopPPG: 0,
      endgamePPG: 0,
      autoCoralPieces: 0,
      teleopCoralPieces: 0,
      autoAlgaePieces: 0,
      teleopAlgaePieces: 0,
      maxAutoCoralPieces: 0,
      maxTeleopCoralPieces: 0,
      hasProcessor: false,
      hasBarge: false,
      reliability: 1,
      coralCyclesScored: 0,
      algaeCyclesScored: 0,
      autoL1Accuracy: 0,
      autoL2Accuracy: 0,
      autoL3Accuracy: 0,
      autoL4Accuracy: 0,
      teleopL1Accuracy: 0,
      teleopL2Accuracy: 0,
      teleopL3Accuracy: 0,
      teleopL4Accuracy: 0,
      teleopBargeAccuracy: 0,
      teleopProcessorAccuracy: 0,
      shallowAccuracy: 0,
      deepAccuracy: 0
    };
  }
};

const PlayoffPredictor = () => {
  const [teams, setTeams] = useState<number[]>([]);
  const [allianceInputs, setAllianceInputs] = useState<AllianceInputs>({
    "1": { teams: [0, 0, 0] },
    "2": { teams: [0, 0, 0] },
    "3": { teams: [0, 0, 0] },
    "4": { teams: [0, 0, 0] },
    "5": { teams: [0, 0, 0] },
    "6": { teams: [0, 0, 0] },
    "7": { teams: [0, 0, 0] },
    "8": { teams: [0, 0, 0] },
  });
  const [playoffResults, setPlayoffResults] = useState<PlayoffBracket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await getTeams();
        const teamNumbers = teamsData.map((team) => team.team_number);
        setTeams(teamNumbers);
      } catch (error) {
        console.error("Error loading teams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handleTeamChange = (allianceNumber: string, position: number, value: string) => {
    const teamNumber = parseInt(value) || 0;
    setAllianceInputs((prev) => {
      const newInputs = { ...prev };
      newInputs[allianceNumber].teams[position] = teamNumber;
      return newInputs;
    });
  };

  const handleSimulatePlayoffs = async () => {
    try {
      setLoading(true);

      // Convert alliance inputs to Alliance objects with capabilities
      const alliances: Alliance[] = await Promise.all(
        Object.entries(allianceInputs).map(async ([allianceNumber, data]) => {
          // Fetch team capabilities for each team in the alliance
          const teamCapabilities = await Promise.all(
            data.teams.map((teamNumber) => fetchTeamData(teamNumber))
          );

          return {
            allianceNumber: parseInt(allianceNumber),
            teams: data.teams as number[],
            capabilities: {
              teams: teamCapabilities,
            },
          };
        })
      );

      // Simulate playoffs
      const bracket = simulatePlayoffs(alliances);
      setPlayoffResults(bracket);
    } catch (error) {
      console.error("Error simulating playoffs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get alliance display name
  const getAllianceDisplay = (alliance: Alliance) => {
    return `Alliance ${alliance.allianceNumber} (${alliance.teams.join(", ")})`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Playoff Predictor</CardTitle>
          <CardDescription>
            Enter the 8 alliances to simulate playoff matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alliances 1-4 */}
            <div>
              {["1", "2", "3", "4"].map((allianceNumber) => (
                <div key={`alliance-${allianceNumber}`} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Alliance {allianceNumber}
                  </h3>
                  <div className="space-y-2">
                    {[0, 1, 2].map((position) => (
                      <div key={`alliance-${allianceNumber}-${position}`} className="flex items-center gap-2">
                        <Label htmlFor={`alliance-${allianceNumber}-${position}`} className="w-24">
                          Captain {position === 0 ? "(C)" : position === 1 ? "(1)" : "(2)"}
                        </Label>
                        <Select
                          value={allianceInputs[allianceNumber].teams[position].toString()}
                          onValueChange={(value) => handleTeamChange(allianceNumber, position, value)}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Team" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Select Team</SelectItem>
                            {teams.map((team) => (
                              <SelectItem key={`alliance-${allianceNumber}-${position}-${team}`} value={team.toString()}>
                                {team}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Alliances 5-8 */}
            <div>
              {["5", "6", "7", "8"].map((allianceNumber) => (
                <div key={`alliance-${allianceNumber}`} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Alliance {allianceNumber}
                  </h3>
                  <div className="space-y-2">
                    {[0, 1, 2].map((position) => (
                      <div key={`alliance-${allianceNumber}-${position}`} className="flex items-center gap-2">
                        <Label htmlFor={`alliance-${allianceNumber}-${position}`} className="w-24">
                          Captain {position === 0 ? "(C)" : position === 1 ? "(1)" : "(2)"}
                        </Label>
                        <Select
                          value={allianceInputs[allianceNumber].teams[position].toString()}
                          onValueChange={(value) => handleTeamChange(allianceNumber, position, value)}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Team" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Select Team</SelectItem>
                            {teams.map((team) => (
                              <SelectItem key={`alliance-${allianceNumber}-${position}-${team}`} value={team.toString()}>
                                {team}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSimulatePlayoffs}
              disabled={
                loading ||
                Object.values(allianceInputs).some((alliance) =>
                  alliance.teams.some((team) => !team)
                )
              }
              className="w-full"
            >
              {loading ? "Loading..." : "Simulate Playoffs"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {playoffResults && (
        <div className="space-y-6">
          {/* Display Quarterfinals */}
          <Card>
            <CardHeader>
              <CardTitle>Quarterfinals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playoffResults.rounds[0].matches.map((match) => (
                  <Card key={`qf-${match.matchNumber}`}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">QF Match {match.matchNumber}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between">
                        <div 
                          className={`font-medium ${match.prediction?.winner === 'red' ? 'font-bold' : ''}`}
                        >
                          {getAllianceDisplay(match.redAlliance)} 
                          {match.prediction && ` (${match.prediction.redScore})`}
                        </div>
                        <div 
                          className={`font-medium ${match.prediction?.winner === 'blue' ? 'font-bold' : ''}`}
                        >
                          {getAllianceDisplay(match.blueAlliance)}
                          {match.prediction && ` (${match.prediction.blueScore})`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Display Semifinals */}
          <Card>
            <CardHeader>
              <CardTitle>Semifinals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playoffResults.rounds[1].matches.map((match) => (
                  <Card key={`sf-${match.matchNumber}`}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">SF Match {match.matchNumber - 4}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between">
                        <div 
                          className={`font-medium ${match.prediction?.winner === 'red' ? 'font-bold' : ''}`}
                        >
                          {getAllianceDisplay(match.redAlliance)} 
                          {match.prediction && ` (${match.prediction.redScore})`}
                        </div>
                        <div 
                          className={`font-medium ${match.prediction?.winner === 'blue' ? 'font-bold' : ''}`}
                        >
                          {getAllianceDisplay(match.blueAlliance)}
                          {match.prediction && ` (${match.prediction.blueScore})`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Display Finals */}
          <Card>
            <CardHeader>
              <CardTitle>Finals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto max-w-md">
                {playoffResults.rounds[2].matches.map((match) => (
                  <Card key={`f-${match.matchNumber}`}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Finals</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between">
                        <div 
                          className={`font-medium ${match.prediction?.winner === 'red' ? 'font-bold' : ''}`}
                        >
                          {getAllianceDisplay(match.redAlliance)} 
                          {match.prediction && ` (${match.prediction.redScore})`}
                        </div>
                        <div 
                          className={`font-medium ${match.prediction?.winner === 'blue' ? 'font-bold' : ''}`}
                        >
                          {getAllianceDisplay(match.blueAlliance)}
                          {match.prediction && ` (${match.prediction.blueScore})`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Champion */}
          {playoffResults.winner && (
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300">
              <CardHeader>
                <CardTitle className="text-center">Event Champion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-xl font-bold">
                  {getAllianceDisplay(playoffResults.winner)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayoffPredictor; 
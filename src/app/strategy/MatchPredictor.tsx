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
import { getTeams, getQualificationMatches, getRankings, TeamRankingData, TBAMatch } from "@/app/strategy/TBAService";
import {
  TeamCapabilities,
  AllianceCapabilities,
  predictMatch,
  convertToTeamCapabilities,
  calculateEnhancedScore,
  predictAutoRP,
  predictCoralRP,
  predictBargeRP
} from "@/app/strategy/RPPredictor";
import { AggregateData } from "@/app/interfaces";
import { db } from "@/app/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

interface TeamSelection {
  red1: number;
  red2: number;
  red3: number;
  blue1: number;
  blue2: number;
  blue3: number;
}

interface PredictionResults {
  matchNumber: number;
  redTeams: number[];
  blueTeams: number[];
  prediction: any;
}

// Function to fetch team aggregate data from Firebase
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

const MatchPredictor = () => {
  const [teams, setTeams] = useState<number[]>([]);
  const [qualMatches, setQualMatches] = useState<TBAMatch[]>([]);
  const [rankings, setRankings] = useState<TeamRankingData[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<TeamSelection>({
    red1: 0,
    red2: 0,
    red3: 0,
    blue1: 0,
    blue2: 0,
    blue3: 0,
  });
  const [selectedMatchIndex, setSelectedMatchIndex] = useState<number>(0);
  const [predictions, setPredictions] = useState<PredictionResults[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load teams, matches and rankings
        const teamsData = await getTeams();
        const teamNumbers = teamsData.map((team) => team.team_number);
        setTeams(teamNumbers);

        const qualMatchesData = await getQualificationMatches();
        setQualMatches(qualMatchesData);

        const rankingsData = await getRankings();
        setRankings(rankingsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to handle selecting a match from dropdown
  const handleMatchChange = (value: string) => {
    const matchIndex = parseInt(value);
    setSelectedMatchIndex(matchIndex);
    
    if (matchIndex < qualMatches.length) {
      const match = qualMatches[matchIndex];
      
      // Extract team numbers from team keys (format: frc####)
      const redTeams = match.alliances.red.team_keys.map(key => parseInt(key.substring(3)));
      const blueTeams = match.alliances.blue.team_keys.map(key => parseInt(key.substring(3)));
      
      // Update the selected teams
      setSelectedTeams({
        red1: redTeams[0] || 0,
        red2: redTeams[1] || 0,
        red3: redTeams[2] || 0,
        blue1: blueTeams[0] || 0,
        blue2: blueTeams[1] || 0,
        blue3: blueTeams[2] || 0,
      });
    }
  };

  // Handle manual team selection
  const handleTeamChange = (alliance: string, position: number, value: string) => {
    const teamNumber = parseInt(value) || 0;
    setSelectedTeams((prev) => ({
      ...prev,
      [`${alliance}${position}`]: teamNumber,
    }));
  };

  // Function to predict single match
  const predictSingleMatch = async () => {
    try {
      setLoading(true);

      // Fetch team capabilities
      const redTeams = [
        await fetchTeamData(selectedTeams.red1),
        await fetchTeamData(selectedTeams.red2),
        await fetchTeamData(selectedTeams.red3),
      ];

      const blueTeams = [
        await fetchTeamData(selectedTeams.blue1),
        await fetchTeamData(selectedTeams.blue2),
        await fetchTeamData(selectedTeams.blue3),
      ];

      const redAlliance: AllianceCapabilities = { teams: redTeams };
      const blueAlliance: AllianceCapabilities = { teams: blueTeams };

      // Use prediction with branch filling logic
      const matchPrediction = predictMatch(redAlliance, blueAlliance);
      
      // Create a single prediction result
      const predictionResult: PredictionResults = {
        matchNumber: qualMatches[selectedMatchIndex]?.match_number || 0,
        redTeams: redTeams.map(t => t.teamNumber),
        blueTeams: blueTeams.map(t => t.teamNumber),
        prediction: matchPrediction,
      };
      
      // Clear predictions and set the single result
      setPredictions([predictionResult]);
    } catch (error) {
      console.error("Error predicting match:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to predict matches starting from the selected match
  const predictFromMatch = async () => {
    try {
      setLoading(true);
      
      // Get matches from the selected match to the end
      const remainingMatches = qualMatches.slice(selectedMatchIndex);
      const results: PredictionResults[] = [];
      
      // Predict each match
      for (const match of remainingMatches) {
        // Extract team numbers from team keys (format: frc####)
        const redTeamNumbers = match.alliances.red.team_keys.map(key => parseInt(key.substring(3)));
        const blueTeamNumbers = match.alliances.blue.team_keys.map(key => parseInt(key.substring(3)));
        
        // Fetch team capabilities
        const redTeams = await Promise.all(redTeamNumbers.map(fetchTeamData));
        const blueTeams = await Promise.all(blueTeamNumbers.map(fetchTeamData));
        
        const redAlliance: AllianceCapabilities = { teams: redTeams };
        const blueAlliance: AllianceCapabilities = { teams: blueTeams };
        
        // Use prediction
        const matchPrediction = predictMatch(redAlliance, blueAlliance);
        
        // Add to results
        results.push({
          matchNumber: match.match_number,
          redTeams: redTeamNumbers,
          blueTeams: blueTeamNumbers,
          prediction: matchPrediction,
        });
      }
      
      setPredictions(results);
    } catch (error) {
      console.error("Error predicting matches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Match Predictor</CardTitle>
          <CardDescription>
            Select a qualification match to start prediction from
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="match-selector" className="block mb-2">Select Qualification Match</Label>
            <div className="flex gap-4">
              <Select 
                value={selectedMatchIndex.toString()} 
                onValueChange={handleMatchChange}
                disabled={loading || qualMatches.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a match" />
                </SelectTrigger>
                <SelectContent>
                  {qualMatches.length === 0 ? (
                    <SelectItem value="0">No matches available</SelectItem>
                  ) : (
                    qualMatches.map((match, index) => (
                      <SelectItem key={match.key} value={index.toString()}>
                        Qualification {match.match_number}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button 
                onClick={predictFromMatch} 
                disabled={loading || qualMatches.length === 0}
                variant="outline"
              >
                Predict All Matches
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Red Alliance */}
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">Red Alliance</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((position) => (
                  <div key={`red-${position}`} className="flex items-center gap-2">
                    <Label htmlFor={`red-${position}`} className="w-24">
                      Red {position}
                    </Label>
                    <Select
                      value={selectedTeams[`red${position}` as keyof TeamSelection].toString()}
                      onValueChange={(value) => handleTeamChange("red", position, value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Select Team</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={`red-${position}-${team}`} value={team.toString()}>
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Blue Alliance */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Blue Alliance</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((position) => (
                  <div key={`blue-${position}`} className="flex items-center gap-2">
                    <Label htmlFor={`blue-${position}`} className="w-24">
                      Blue {position}
                    </Label>
                    <Select
                      value={selectedTeams[`blue${position}` as keyof TeamSelection].toString()}
                      onValueChange={(value) => handleTeamChange("blue", position, value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Select Team</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={`blue-${position}-${team}`} value={team.toString()}>
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={predictSingleMatch}
              disabled={
                loading ||
                !selectedTeams.red1 ||
                !selectedTeams.red2 ||
                !selectedTeams.red3 ||
                !selectedTeams.blue1 ||
                !selectedTeams.blue2 ||
                !selectedTeams.blue3
              }
              className="w-full"
            >
              Predict Selected Match
            </Button>
          </div>
        </CardContent>
      </Card>

      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Red Alliance</TableHead>
                  <TableHead>Blue Alliance</TableHead>
                  <TableHead>Predicted Score</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead>Ranking Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((result) => (
                  <TableRow key={`prediction-${result.matchNumber}`}>
                    <TableCell>Qual {result.matchNumber}</TableCell>
                    <TableCell>
                      {result.redTeams.map((team) => {
                        const ranking = rankings.find((r) => r.teamNumber === team);
                        return (
                          <div key={`red-team-${team}`} className="flex items-center gap-1 mb-1">
                            <span className="font-medium">{team}</span>
                            {ranking && (
                              <Badge variant="outline" className="text-xs">
                                Rank {ranking.rank}
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      {result.blueTeams.map((team) => {
                        const ranking = rankings.find((r) => r.teamNumber === team);
                        return (
                          <div key={`blue-team-${team}`} className="flex items-center gap-1 mb-1">
                            <span className="font-medium">{team}</span>
                            {ranking && (
                              <Badge variant="outline" className="text-xs">
                                Rank {ranking.rank}
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-red-600 font-bold">{result.prediction.redScore}</span>
                        {" - "}
                        <span className="text-blue-600 font-bold">{result.prediction.blueScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {result.prediction.winner === "red" ? (
                        <Badge className="bg-red-600">Red</Badge>
                      ) : result.prediction.winner === "blue" ? (
                        <Badge className="bg-blue-600">Blue</Badge>
                      ) : (
                        <Badge variant="outline">Tie</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge className="bg-red-600">
                          Red: {result.prediction.redRP}
                        </Badge>
                        <Badge className="bg-blue-600">
                          Blue: {result.prediction.blueRP}
                        </Badge>
                      </div>
                      <div className="text-xs mt-1">
                        {result.prediction.redAutoRP && (
                          <Badge variant="outline" className="text-xs mr-1">
                            Red Auto
                          </Badge>
                        )}
                        {result.prediction.redCoralRP && (
                          <Badge variant="outline" className="text-xs mr-1">
                            Red Coral
                          </Badge>
                        )}
                        {result.prediction.redBargeRP && (
                          <Badge variant="outline" className="text-xs">
                            Red Barge
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs mt-1">
                        {result.prediction.blueAutoRP && (
                          <Badge variant="outline" className="text-xs mr-1">
                            Blue Auto
                          </Badge>
                        )}
                        {result.prediction.blueCoralRP && (
                          <Badge variant="outline" className="text-xs mr-1">
                            Blue Coral
                          </Badge>
                        )}
                        {result.prediction.blueBargeRP && (
                          <Badge variant="outline" className="text-xs">
                            Blue Barge
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchPredictor; 
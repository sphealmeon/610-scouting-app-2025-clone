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
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  getTeams,
  getQualificationMatches,
  getRankings,
  TeamRankingData,
  TBAMatch
} from "@/app/strategy/TBAService";
import {
  TeamCapabilities,
  AllianceCapabilities,
  predictMatch,
  convertToTeamCapabilities,
  MatchPrediction
} from "@/app/strategy/RPPredictor";
import { AggregateData } from "@/app/interfaces";
import { db } from "@/app/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

// Interface for team rankings with RP breakdown
interface TeamRankingPrediction {
  teamNumber: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  rp: number; // Total RP
  autoRP: number; // Auto RP
  coralRP: number; // Coral RP  
  bargeRP: number; // Barge RP
  predictedRank?: number; // Calculated rank
  currentRank?: number; // Current TBA rank
}

const RankingsPredictor = () => {
  // State for all data
  const [teams, setTeams] = useState<number[]>([]);
  const [qualMatches, setQualMatches] = useState<TBAMatch[]>([]);
  const [tbaRankings, setTbaRankings] = useState<TeamRankingData[]>([]);
  const [teamCapabilities, setTeamCapabilities] = useState<Record<number, TeamCapabilities>>({});
  const [predictedRankings, setPredictedRankings] = useState<TeamRankingPrediction[]>([]);
  
  // State for match slider
  const [startingMatchNumber, setStartingMatchNumber] = useState<number>(1);
  const [maxMatchNumber, setMaxMatchNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get teams, qualification matches, and current rankings
        const fetchedTeams = await getTeams();
        const teamNumbers = fetchedTeams.map(team => team.team_number);
        setTeams(teamNumbers);
        
        const fetchedMatches = await getQualificationMatches();
        setQualMatches(fetchedMatches);
        
        if (fetchedMatches.length > 0) {
          setMaxMatchNumber(fetchedMatches[fetchedMatches.length - 1].match_number);
          setStartingMatchNumber(1);
        }
        
        const fetchedRankings = await getRankings();
        setTbaRankings(fetchedRankings);
        
        // Fetch team capabilities
        const capabilities: Record<number, TeamCapabilities> = {};
        for (const teamNumber of teamNumbers) {
          const teamData = await fetchTeamData(teamNumber);
          capabilities[teamNumber] = teamData;
        }
        setTeamCapabilities(capabilities);
        
        // Calculate initial rankings
        const beforeMatches = fetchedMatches.filter(match => match.match_number < startingMatchNumber);
        const futureMatches = fetchedMatches.filter(match => match.match_number >= startingMatchNumber);

        // Initialize rankings data with 0 values for all teams
        const rankings: Record<number, TeamRankingPrediction> = {};
        teamNumbers.forEach(team => {
          // Find current ranking for this team
          const currentRanking = fetchedRankings.find(r => r.teamNumber === team);
          
          rankings[team] = {
            teamNumber: team,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            ties: 0,
            rp: 0,
            autoRP: 0,
            coralRP: 0,
            bargeRP: 0,
            currentRank: currentRanking?.rank
          };
        });
        
        // Process previous matches
        processPreviousMatches(beforeMatches, rankings, fetchedRankings);
        
        // Process future matches with predictions
        processFutureMatches(futureMatches, rankings, capabilities);
        
        // Convert to array and sort by ranking points
        const rankingsArray = Object.values(rankings).filter(r => r.matchesPlayed > 0);
        rankingsArray.sort((a, b) => {
          // Sort by RP first (Ranking Score)
          if (b.rp !== a.rp) return b.rp - a.rp;
          
          // 2nd: Average Coopertition Bonus points
          // We estimate Coopertition from coralRP since it's often related
          const aCoopBonus = a.coralRP / a.matchesPlayed;
          const bCoopBonus = b.coralRP / b.matchesPlayed;
          if (bCoopBonus !== aCoopBonus) return bCoopBonus - aCoopBonus;
          
          // 3rd: Average ALLIANCE MATCH points (not including fouls)
          // We can estimate this from our prediction score capability
          const aMatchPoints = (capabilities[a.teamNumber]?.autoPPG || 0) + 
                              (capabilities[a.teamNumber]?.teleopPPG || 0) + 
                              (capabilities[a.teamNumber]?.endgamePPG || 0);
          const bMatchPoints = (capabilities[b.teamNumber]?.autoPPG || 0) + 
                              (capabilities[b.teamNumber]?.teleopPPG || 0) + 
                              (capabilities[b.teamNumber]?.endgamePPG || 0);
          if (bMatchPoints !== aMatchPoints) return bMatchPoints - aMatchPoints;
          
          // 4th: Average ALLIANCE LEAVE + AUTO CORAL points
          // We can estimate this from autoRP and autoCoralPieces
          const aAutoPoints = (capabilities[a.teamNumber]?.autoCoralPieces || 0) * 3 + 
                             ((a.autoRP / a.matchesPlayed) * 3);
          const bAutoPoints = (capabilities[b.teamNumber]?.autoCoralPieces || 0) * 3 + 
                             ((b.autoRP / b.matchesPlayed) * 3);
          if (bAutoPoints !== aAutoPoints) return bAutoPoints - aAutoPoints;
          
          // 5th: Average ALLIANCE BARGE points
          // We can estimate this from bargeRP
          const aBargePoints = a.bargeRP / a.matchesPlayed;
          const bBargePoints = b.bargeRP / b.matchesPlayed;
          if (bBargePoints !== aBargePoints) return bBargePoints - aBargePoints;
          
          // Finally, team number as last tiebreaker
          return a.teamNumber - b.teamNumber;
        });
        
        // Assign ranks
        rankingsArray.forEach((team, index) => {
          team.predictedRank = index + 1;
        });
        
        setPredictedRankings(rankingsArray);
      } catch (error) {
        console.error("Error calculating rankings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Recalculate rankings when starting match changes
  useEffect(() => {
    if (!loading && qualMatches.length > 0 && teams.length > 0) {
      calculateRankings(startingMatchNumber, qualMatches, teams, teamCapabilities, tbaRankings);
    }
  }, [startingMatchNumber]);
  
  // Fetch team data from Firebase
  const fetchTeamData = async (teamNumber: number): Promise<TeamCapabilities> => {
    try {
      // Try to get the team's data from Firebase
      const docRef = doc(db, teamNumber.toString(), "aggregate");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().aggregateData) {
        const teamData = docSnap.data().aggregateData as AggregateData;
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
  
  // Calculate rankings based on match predictions
  const calculateRankings = async (
    startMatch: number, 
    matches: TBAMatch[], 
    allTeams: number[], 
    capabilities: Record<number, TeamCapabilities>,
    currentRankings: TeamRankingData[]
  ) => {
    setIsCalculating(true);
    
    try {
      // Initialize rankings data with 0 values for all teams
      const rankings: Record<number, TeamRankingPrediction> = {};
      allTeams.forEach(team => {
        // Find current ranking for this team
        const currentRanking = currentRankings.find(r => r.teamNumber === team);
        
        rankings[team] = {
          teamNumber: team,
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          ties: 0,
          rp: 0,
          autoRP: 0,
          coralRP: 0,
          bargeRP: 0,
          currentRank: currentRanking?.rank
        };
      });
      
      // Calculate initial rankings
      const beforeMatches = matches.filter(match => match.match_number < startMatch);
      const futureMatches = matches.filter(match => match.match_number >= startMatch);

      // Process previous matches
      processPreviousMatches(beforeMatches, rankings, currentRankings);
      
      // Process future matches with predictions
      processFutureMatches(futureMatches, rankings, capabilities);
      
      // Convert to array and sort by ranking points
      const rankingsArray = Object.values(rankings).filter(r => r.matchesPlayed > 0);
      rankingsArray.sort((a, b) => {
        // Sort by RP first (Ranking Score)
        if (b.rp !== a.rp) return b.rp - a.rp;
        
        // 2nd: Average Coopertition Bonus points
        // We estimate Coopertition from coralRP since it's often related
        const aCoopBonus = a.coralRP / a.matchesPlayed;
        const bCoopBonus = b.coralRP / b.matchesPlayed;
        if (bCoopBonus !== aCoopBonus) return bCoopBonus - aCoopBonus;
        
        // 3rd: Average ALLIANCE MATCH points (not including fouls)
        // We can estimate this from our prediction score capability
        const aMatchPoints = (capabilities[a.teamNumber]?.autoPPG || 0) + 
                            (capabilities[a.teamNumber]?.teleopPPG || 0) + 
                            (capabilities[a.teamNumber]?.endgamePPG || 0);
        const bMatchPoints = (capabilities[b.teamNumber]?.autoPPG || 0) + 
                            (capabilities[b.teamNumber]?.teleopPPG || 0) + 
                            (capabilities[b.teamNumber]?.endgamePPG || 0);
        if (bMatchPoints !== aMatchPoints) return bMatchPoints - aMatchPoints;
        
        // 4th: Average ALLIANCE LEAVE + AUTO CORAL points
        // We can estimate this from autoRP and autoCoralPieces
        const aAutoPoints = (capabilities[a.teamNumber]?.autoCoralPieces || 0) * 3 + 
                           ((a.autoRP / a.matchesPlayed) * 3);
        const bAutoPoints = (capabilities[b.teamNumber]?.autoCoralPieces || 0) * 3 + 
                           ((b.autoRP / b.matchesPlayed) * 3);
        if (bAutoPoints !== aAutoPoints) return bAutoPoints - aAutoPoints;
        
        // 5th: Average ALLIANCE BARGE points
        // We can estimate this from bargeRP
        const aBargePoints = a.bargeRP / a.matchesPlayed;
        const bBargePoints = b.bargeRP / b.matchesPlayed;
        if (bBargePoints !== aBargePoints) return bBargePoints - aBargePoints;
        
        // Finally, team number as last tiebreaker
        return a.teamNumber - b.teamNumber;
      });
      
      // Assign ranks
      rankingsArray.forEach((team, index) => {
        team.predictedRank = index + 1;
      });
      
      setPredictedRankings(rankingsArray);
    } catch (error) {
      console.error("Error calculating rankings:", error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setStartingMatchNumber(value[0]);
  };
  
  // Process previous matches using TBA data
  const processPreviousMatches = (
    matches: TBAMatch[],
    rankings: Record<number, TeamRankingPrediction>,
    currentRankings: TeamRankingData[]
  ) => {
    // Use TBA data for matches before the slider position
    for (const match of matches) {
      const redTeams = match.alliances.red.team_keys.map(key => parseInt(key.substring(3)));
      const blueTeams = match.alliances.blue.team_keys.map(key => parseInt(key.substring(3)));
      
      const redWin = match.alliances.red.score > match.alliances.blue.score;
      const blueWin = match.alliances.blue.score > match.alliances.red.score;
      const tie = match.alliances.red.score === match.alliances.blue.score;
      
      // Update teams with their current TBA rankings
      redTeams.forEach(team => {
        rankings[team].matchesPlayed += 1;
        if (redWin) rankings[team].wins += 1;
        if (blueWin) rankings[team].losses += 1;
        if (tie) rankings[team].ties += 1;
        
        // Use TBA data to calculate the RP - fully based on history for past matches
        const currentTeamRanking = currentRankings.find(r => r.teamNumber === team);
        if (currentTeamRanking && currentTeamRanking.matchesPlayed > 0) {
          const rpPerMatch = currentTeamRanking.rp / currentTeamRanking.matchesPlayed;
          rankings[team].rp += rpPerMatch;
          
          // Use current ranking data to distribute RP across categories
          if (currentTeamRanking.autoRP > 0) {
            const autoRpFrequency = Math.min(1, currentTeamRanking.autoRP / currentTeamRanking.matchesPlayed);
            if (Math.random() < autoRpFrequency) rankings[team].autoRP += 1;
          }
          
          if (currentTeamRanking.coralRP > 0) {
            const coralRpFrequency = Math.min(1, currentTeamRanking.coralRP / currentTeamRanking.matchesPlayed);
            if (Math.random() < coralRpFrequency) rankings[team].coralRP += 1;
          }
          
          if (currentTeamRanking.bargeRP > 0) {
            const bargeRpFrequency = Math.min(1, currentTeamRanking.bargeRP / currentTeamRanking.matchesPlayed);
            if (Math.random() < bargeRpFrequency) rankings[team].bargeRP += 1;
          }
        } else if (redWin) {
          // If no ranking data exists but we know the outcome, use basic calculation
          rankings[team].rp += 3; // Win is 3 RP
        } else if (tie) {
          rankings[team].rp += 1; // Tie is 1 RP
        }
      });
      
      blueTeams.forEach(team => {
        rankings[team].matchesPlayed += 1;
        if (blueWin) rankings[team].wins += 1;
        if (redWin) rankings[team].losses += 1;
        if (tie) rankings[team].ties += 1;
        
        // Use TBA data to calculate the RP - fully based on history for past matches
        const currentTeamRanking = currentRankings.find(r => r.teamNumber === team);
        if (currentTeamRanking && currentTeamRanking.matchesPlayed > 0) {
          const rpPerMatch = currentTeamRanking.rp / currentTeamRanking.matchesPlayed;
          rankings[team].rp += rpPerMatch;
          
          // Use current ranking data to distribute RP across categories
          if (currentTeamRanking.autoRP > 0) {
            const autoRpFrequency = Math.min(1, currentTeamRanking.autoRP / currentTeamRanking.matchesPlayed);
            if (Math.random() < autoRpFrequency) rankings[team].autoRP += 1;
          }
          
          if (currentTeamRanking.coralRP > 0) {
            const coralRpFrequency = Math.min(1, currentTeamRanking.coralRP / currentTeamRanking.matchesPlayed);
            if (Math.random() < coralRpFrequency) rankings[team].coralRP += 1;
          }
          
          if (currentTeamRanking.bargeRP > 0) {
            const bargeRpFrequency = Math.min(1, currentTeamRanking.bargeRP / currentTeamRanking.matchesPlayed);
            if (Math.random() < bargeRpFrequency) rankings[team].bargeRP += 1;
          }
        } else if (blueWin) {
          // If no ranking data exists but we know the outcome, use basic calculation
          rankings[team].rp += 3; // Win is 3 RP
        } else if (tie) {
          rankings[team].rp += 1; // Tie is 1 RP
        }
      });
    }
  };
  
  // Process future matches using our prediction model
  const processFutureMatches = (
    matches: TBAMatch[],
    rankings: Record<number, TeamRankingPrediction>,
    capabilities: Record<number, TeamCapabilities>
  ) => {
    for (const match of matches) {
      const redTeams = match.alliances.red.team_keys.map(key => parseInt(key.substring(3)));
      const blueTeams = match.alliances.blue.team_keys.map(key => parseInt(key.substring(3)));
      
      // Create alliance capabilities for prediction
      const redAlliance: AllianceCapabilities = {
        teams: redTeams.map(team => capabilities[team] || {
          teamNumber: team,
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
        })
      };
      
      const blueAlliance: AllianceCapabilities = {
        teams: blueTeams.map(team => capabilities[team] || {
          teamNumber: team,
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
        })
      };
      
      // Predict match outcome
      const prediction = predictMatch(redAlliance, blueAlliance);
      
      // Update rankings based on prediction
      redTeams.forEach(team => {
        rankings[team].matchesPlayed += 1;
        if (prediction.winner === 'red') rankings[team].wins += 1;
        if (prediction.winner === 'blue') rankings[team].losses += 1;
        if (prediction.winner === 'tie') rankings[team].ties += 1;
        rankings[team].rp += prediction.redRP;
        if (prediction.redAutoRP) rankings[team].autoRP += 1;
        if (prediction.redCoralRP) rankings[team].coralRP += 1;
        if (prediction.redBargeRP) rankings[team].bargeRP += 1;
      });
      
      blueTeams.forEach(team => {
        rankings[team].matchesPlayed += 1;
        if (prediction.winner === 'blue') rankings[team].wins += 1;
        if (prediction.winner === 'red') rankings[team].losses += 1;
        if (prediction.winner === 'tie') rankings[team].ties += 1;
        rankings[team].rp += prediction.blueRP;
        if (prediction.blueAutoRP) rankings[team].autoRP += 1;
        if (prediction.blueCoralRP) rankings[team].coralRP += 1;
        if (prediction.blueBargeRP) rankings[team].bargeRP += 1;
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rankings Predictor</CardTitle>
          <CardDescription>
            Predict event rankings based on future match predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="match-slider">Start Predicting from Match</Label>
                <span className="text-sm font-medium">
                  Match {startingMatchNumber} of {maxMatchNumber}
                </span>
              </div>
              <Slider
                id="match-slider"
                min={1}
                max={maxMatchNumber}
                step={1}
                value={[startingMatchNumber]}
                onValueChange={handleSliderChange}
                disabled={loading || isCalculating}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Rankings will use TBA data for matches before Match {startingMatchNumber} and predictions for matches {startingMatchNumber} and after.
              </p>
            </div>
            
            {isCalculating && <div className="py-4 text-center">Calculating rankings...</div>}
            
            {!loading && !isCalculating && predictedRankings.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">W-L-T</TableHead>
                      <TableHead className="text-right">Matches</TableHead>
                      <TableHead className="text-right">RP</TableHead>
                      <TableHead className="text-right">Auto RP</TableHead>
                      <TableHead className="text-right">Coral RP</TableHead>
                      <TableHead className="text-right">Barge RP</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {predictedRankings.map((team) => (
                      <TableRow key={team.teamNumber}>
                        <TableCell className="font-medium">{team.predictedRank}</TableCell>
                        <TableCell>{team.teamNumber}</TableCell>
                        <TableCell className="text-right">
                          {team.wins}-{team.losses}-{team.ties}
                        </TableCell>
                        <TableCell className="text-right">{team.matchesPlayed}</TableCell>
                        <TableCell className="text-right">{Math.round(team.rp)}</TableCell>
                        <TableCell className="text-right">{team.autoRP}</TableCell>
                        <TableCell className="text-right">{team.coralRP}</TableCell>
                        <TableCell className="text-right">{team.bargeRP}</TableCell>
                        <TableCell className="text-right">
                          {team.currentRank && team.predictedRank && (
                            <Badge 
                              className={
                                team.currentRank > team.predictedRank 
                                  ? "bg-green-500" 
                                  : team.currentRank < team.predictedRank 
                                    ? "bg-red-500" 
                                    : "bg-gray-500"
                              }
                            >
                              {team.currentRank > team.predictedRank 
                                ? `↑${team.currentRank - team.predictedRank}`
                                : team.currentRank < team.predictedRank 
                                  ? `↓${team.predictedRank - team.currentRank}`
                                  : "−"
                              }
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {loading && <div className="py-8 text-center">Loading data...</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingsPredictor; 
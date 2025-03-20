"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/MainHeader"
import { db } from "@/app/firebase/firebase"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { useApi, key } from "@/app/globalVars"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RadarChart from "@/app/compare/radarchart"
import { AggregateData, BrokenTeam, Data, PitData } from "../interfaces"
import { TeamAggregate } from "@/app/firebase/TeamAggregate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FetchTeams } from "../blueAlliance/fetchTeams"
import { Badge } from "@/components/ui/badge"
import { PitData as PitDataInterface } from "@/app/firebase/pitData"
// Interface for match data
interface MatchData {
    teamNumber: string;
    matches: {
        matchNumber: string;
        reason?: string; // Optional for broken matches
    }[];
}



export default function ThirdBotPage() {
    const [teams, setTeams] = useState<string[]>([]);
    const [brokenTeams, setBrokenTeams] = useState<string[]>([]);
    const [defenseTeams, setDefenseTeams] = useState<string[]>([]);
    const [brokenMatchesData, setBrokenMatchesData] = useState<MatchData[]>([]);
    const [defenseMatchesData, setDefenseMatchesData] = useState<MatchData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [teamBreakCounts, setTeamBreakCounts] = useState<Map<number, number>>(new Map())
    const [pitData, setPitData] = useState<PitData[] | null>(null);

    useEffect(() => {
        const fetchTeamsData = async () => {
            setLoading(true);
            try {
                // First get the teams
                const teamsFetched = await new Promise<string[]>((resolve) => {
                    const teamsArray: string[] = [];
                    FetchTeams({
                        setTeams: (newTeams: string[]) => {
                            resolve(newTeams);
                        }
                    });
                });
                
                setTeams(teamsFetched);
                console.log("Teams fetched:", teamsFetched);
                
                // Then check each team for breaks and defense
                const brokenTeamsArray: string[] = [];
                const defenseTeamsArray: string[] = [];
                const brokenMatchesArray: MatchData[] = [];
                const defenseMatchesArray: MatchData[] = [];
                const pitDataArray: PitData[] = [];
                
                for (const team of teamsFetched) { 
                    const data = await TeamAggregate({team: parseInt(team)});
                    console.log(`Team ${team} - broke percentage: ${data?.brokePercentage}, defense matches: ${data?.playedDefenseMatches}`);
                    
                    if(data && data.brokePercentage > 0) {
                        brokenTeamsArray.push(team);
                        
                        // Fetch match data for broken teams
                        const brokenMatches = await fetchBrokenMatches(team);
                        if (brokenMatches.matches.length > 0) {
                            brokenMatchesArray.push(brokenMatches);
                        }
                    }
                    
                    if(data && data.playedDefenseMatches > 0) {
                        defenseTeamsArray.push(team);
                        
                        // Fetch matches where defense was played
                        const defenseMatches = await fetchDefenseMatches(team);
                        if (defenseMatches.matches.length > 0) {
                            defenseMatchesArray.push(defenseMatches);
                        }
                    }                    
                }

                for (const team of teamsFetched) { 
                    const data = await PitDataInterface({team: parseInt(team)});
                    console.log(`Team ${team} - pit data: ${pitData}`);
                    
                    pitDataArray.push(data as PitData);
                }
                
                // Update state once with all teams
                console.log("Broken teams collected:", brokenTeamsArray);
                console.log("Defense teams collected:", defenseTeamsArray);
                console.log("Broken matches data:", brokenMatchesArray);
                console.log("Defense matches data:", defenseMatchesArray);
                console.log("Pit data:", pitDataArray);
                setBrokenTeams(brokenTeamsArray);
                setDefenseTeams(defenseTeamsArray);
                setBrokenMatchesData(brokenMatchesArray);
                setDefenseMatchesData(defenseMatchesArray);
                setPitData(pitDataArray);
            } catch (error) {
                console.error("Error fetching teams data:", error);
            } finally {
                setLoading(false);
            }
        };

        

        fetchTeamsData();
    }, []);

    const fetchPitData = async (team: number): Promise<PitData> => {
        const pitData: PitData = {
            team,
            drivetrainType: "",
            robotSpeed: 0,
            robotWeight: 0,
            bumperClearance: 0,
            centerOfGravity: "",
            defenseComfort: 0,
            algaeCapability: 0,
            coralCapability: 0,
            climbAbility: "",
            pickupLocation: "",
            notes: ""
        };

        try {
            const querySnapshot = await getDocs(collection(db, team.toString()));
            querySnapshot.forEach((document) => {
                if (document.id === "pitscout") {
                    const pitData = document.data();
                    pitData.drivetrainType = pitData.drivetrainType;
                    pitData.robotSpeed = pitData.robotSpeed;
                    pitData.robotWeight = pitData.robotWeight;
                    pitData.bumperClearance = pitData.bumperClearance;
                    pitData.centerOfGravity = pitData.centerOfGravity;
                    pitData.defenseComfort = pitData.defenseComfort;
                    pitData.algaeCapability = pitData.algaeCapability;
                    pitData.coralCapability = pitData.coralCapability;
                    pitData.climbAbility = pitData.climbAbility;
                    pitData.pickupLocation = pitData.pickupLocation;
                    pitData.notes = pitData.notes;
                }
            });
        } catch (error) {
            console.error(`Error fetching pit data for team ${team}:`, error);
        }

        return pitData;
    };
    
    // Function to fetch broken matches for a team
    const fetchBrokenMatches = async (teamNumber: string): Promise<MatchData> => {
        const brokenMatches: MatchData = {
            teamNumber,
            matches: []
        };
        
        try {
            const querySnapshot = await getDocs(collection(db, teamNumber));
            
            querySnapshot.forEach((document) => {
                // Skip the aggregate document
                if (document.id !== "aggregate") {
                    const matchData = document.data().matchData;
                    
                    // Check if this match was broken
                    if (matchData && matchData.teleop && matchData.teleop.reason && matchData.teleop.reason !== "") {
                        brokenMatches.matches.push({
                            matchNumber: document.id,
                            reason: matchData.teleop.reason
                        });
                    }
                }
            });
            
            // Sort matches by match number (assuming match numbers are numeric)
            brokenMatches.matches.sort((a, b) => {
                const matchA = parseInt(a.matchNumber);
                const matchB = parseInt(b.matchNumber);
                return matchA - matchB;
            });
            
        } catch (error) {
            console.error(`Error fetching broken matches for team ${teamNumber}:`, error);
        }
        
        return brokenMatches;
    };
    
    // Function to fetch defense matches for a team
    const fetchDefenseMatches = async (teamNumber: string): Promise<MatchData> => {
        const defenseMatches: MatchData = {
            teamNumber,
            matches: []
        };
        
        try {
            const querySnapshot = await getDocs(collection(db, teamNumber));
            
            querySnapshot.forEach((document) => {
                // Skip the aggregate document
                if (document.id !== "aggregate") {
                    const matchData = document.data().matchData;
                    
                    // Check if defense was played in this match
                    if (matchData && matchData.teleop && matchData.teleop.playedDefense === 1) {
                        defenseMatches.matches.push({
                            matchNumber: document.id
                        });
                    }
                }
            });
            
            // Sort matches by match number (assuming match numbers are numeric)
            defenseMatches.matches.sort((a, b) => {
                const matchA = parseInt(a.matchNumber);
                const matchB = parseInt(b.matchNumber);
                return matchA - matchB;
            });
            
        } catch (error) {
            console.error(`Error fetching defense matches for team ${teamNumber}:`, error);
        }
        
        return defenseMatches;
    };
    
    // Helper function to get broken match data for a team
    const getTeamBrokenMatches = (teamNumber: string) => {
        return brokenMatchesData.find(data => data.teamNumber === teamNumber);
    };
    
    // Helper function to get defense match data for a team
    const getTeamDefenseMatches = (teamNumber: string) => {
        return defenseMatchesData.find(data => data.teamNumber === teamNumber);
    };

    const getPitData = (team: string) => {
        if(pitData!== null) {
        return pitData.find(data => data.team === parseInt(team));
        }
        return null;
    };
    
    return (
        <div>
            <MainHeader />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Third Bot Analysis</h1>

                <Tabs defaultValue="broken" className="mb-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All Third Picks</TabsTrigger>
                        <TabsTrigger value="broken">Broken Teams</TabsTrigger>
                        <TabsTrigger value="defense">Defense Teams</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                        <h2 className="text-2xl font-semibold mb-4">All Third Picks</h2>
                            <div className="grid gap-4">
                                {teams.map((team) => (
                                    <Card key={team}>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center text-xl font-bold">
                                            <span>Team {team}</span>
                                                    <Badge className="ml-2" variant="default">
                                                        {getPitData(team)===null?"Not Pit Scouted":"Pit Scouted"}
                                                    </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2"> 
                                                <div className="grid grid-cols-2 gap-5">
                                                    <div>
                                                        <p className="text-lg font-bold">Drivetrain</p> 
                                                        <p className="font-medium">{getPitData(team)?.drivetrainType}</p>
                                                        <p className="font-medium">{getPitData(team)?.robotSpeed} ft/s</p>
                                                        
                                                        {/* <p>Type: Tank Drive</p>
                                                        <p>Speed: 12 ft/s</p> */}
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-bold">Robot Specs:</p>
                                                        <p className="font-medium">{getPitData(team)?.robotWeight} lbs</p>
                                                        <p className="font-medium">{getPitData(team)?.bumperClearance} in</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold">Defense Stats:</p>
                                                    {/*// TODO Add Foul Count, add bumper clearance to expert scouting */ }
                                                    <p>Average Fouls per Match: 2.5</p>
                                                </div>
                                            </div> 
                                        </CardContent>
                                    </Card>
                                    ))}
                                </div>
                    </TabsContent>

                    <TabsContent value="broken">
                        <h2 className="text-2xl font-semibold mb-4">Broken Teams</h2>
                        <div className="grid gap-4">
                            {loading ? (
                                <p className="text-center text-gray-400 text-lg">Loading teams data...</p>
                            ) : brokenTeams.length === 0 ? (
                                <p className="text-center text-gray-400 text-lg">No teams have broken in matches yet.</p>
                            ) : (
                                brokenTeams.map((team) => {
                                    const brokenMatches = getTeamBrokenMatches(team);
                                    const matches = brokenMatches?.matches || [];
                                    
                                    return (
                                        <Card key={team} className="overflow-hidden">
                                            <CardHeader className="bg-gray-800 p-4">
                                                <CardTitle className="flex justify-between items-center">
                                                    <span>Team {team}</span>
                                                    <Badge variant="destructive">
                                                        {matches.length} Broken Matches
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                {matches.length > 0 ? (
                                                    <div className="space-y-2">
                                                        <p className="font-medium mb-2">Broken in matches:</p>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {matches.map((match, index) => (
                                                                <div 
                                                                    key={match.matchNumber}
                                                                    className={`p-3 rounded-md ${index === matches.length - 1 
                                                                        ? 'bg-red-900/20 border border-red-700' 
                                                                        : 'bg-gray-800'}`}
                                                                >
                                                                    <div className="flex justify-between mb-1">
                                                                        <span className="font-medium">
                                                                            Match {match.matchNumber}
                                                                            {index === matches.length - 1 && (
                                                                                <span className="ml-2 text-red-400">← Most Recent</span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-300">
                                                                        Reason: {match.reason}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-400">No match data available</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="defense">
                        <h2 className="text-2xl font-semibold mb-4">Teams That Played Defense</h2>
                        <div className="grid gap-4">
                            {loading ? (
                                <p className="text-center text-gray-400 text-lg">Loading teams data...</p>
                            ) : defenseTeams.length === 0 ? (
                                <p className="text-center text-gray-400 text-lg">No teams have played defense in matches yet.</p>
                            ) : (
                                defenseTeams.map((team) => {
                                    const defenseMatches = getTeamDefenseMatches(team);
                                    const matches = defenseMatches?.matches || [];
                                    
                                    return (
                                        <Card key={team} className="overflow-hidden">
                                            <CardHeader className="bg-gray-800 p-4">
                                                <CardTitle className="flex justify-between items-center">
                                                    <span>Team {team}</span>
                                                    <Badge variant="secondary">
                                                        {matches.length} Defense Matches
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                {matches.length > 0 ? (
                                                    <div className="space-y-2">
                                                        <p className="font-medium mb-2">Played defense in matches:</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                            {matches.map((match, index) => (
                                                                <div 
                                                                    key={match.matchNumber}
                                                                    className={`p-3 rounded-md ${index === matches.length - 1 
                                                                        ? 'bg-blue-900/20 border border-blue-700' 
                                                                        : 'bg-gray-800'}`}
                                                                >
                                                                    <div className="flex justify-between mb-1">
                                                                        <span className="font-medium">
                                                                            Match {match.matchNumber}
                                                                            {index === matches.length - 1 && (
                                                                                <span className="ml-2 text-blue-400">← Most Recent</span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-400">No match data available</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

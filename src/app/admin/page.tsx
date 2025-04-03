"use client"

import { useState, useEffect } from "react"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs } from "firebase/firestore"
import { MainHeader } from "@/components/MainHeader"
import { teams } from "@/app/globalVars"
import { key, useApi } from "@/app/globalVars"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MatchData {
    teams: string[];
    totalScouted: number;
}

interface ScoutAssignment {
    [matchNum: string]: {
        [position: string]: string; // position (like "Red 1") -> scout name
    }
}

interface PositionMapping {
    [matchNum: string]: {
        [position: string]: string; // position (like "Red 1") -> team number
    }
}

interface ScoutStats {
    name: string;
    missed: number;
    completed: number;
}

// New interfaces for scout accuracy comparison
interface ScoutAccuracy {
    name: string;
    autoAccuracy: number;
    teleopAccuracy: number;
    endgameAccuracy: number;
    overallAccuracy: number;
    matchesScored: number;
    totalDifference: number;
}

interface MatchComparison {
    matchNumber: string;
    tbaData: {
        auto: {
            leave: number;
            coral: number;
            algae: number;
        };
        teleop: {
            l1Scored: number;
            l2Scored: number;
            l3Scored: number;
            l4Scored: number;
            processorScored: number;
            bargeScored: number;
            coral: number;
            algae: number;
        };
        endgame: {
            parked: number;
            shallow: number;
            deep: number;
        };
    };
    scoutingData: {
        auto: {
            leave: number;
            coral: number;
            algae: number;
        };
        teleop: {
            l1Scored: number;
            l2Scored: number;
            l3Scored: number;
            l4Scored: number;
            processorScored: number;
            bargeScored: number;
            coral: number;
            algae: number;
        };
        endgame: {
            parked: number;
            shallow: number;
            deep: number;
        };
    };
}

export default function MatchSummary() {
    const [matchSummaries, setMatchSummaries] = useState<Record<string, MatchData>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scoutAssignments, setScoutAssignments] = useState<ScoutAssignment>({});
    const [positionMappings, setPositionMappings] = useState<PositionMapping>({});
    const [csvLoaded, setCsvLoaded] = useState(false);
    const [tbaLoaded, setTbaLoaded] = useState(false);
    const [scoutStats, setScoutStats] = useState<Record<string, ScoutStats>>({});
    const [showMissedLeaderboard, setShowMissedLeaderboard] = useState(false);
    const [accessCode, setAccessCode] = useState("");
    const [codeError, setCodeError] = useState(false);

    // New state variables for scout accuracy
    const [activeTab, setActiveTab] = useState<string>("missing");
    const [scoutAccuracy, setScoutAccuracy] = useState<ScoutAccuracy[]>([]);
    const [matchComparisons, setMatchComparisons] = useState<MatchComparison[]>([]);
    const [loadingTBAComparison, setLoadingTBAComparison] = useState<boolean>(false);
    const [totalQualMatches, setTotalQualMatches] = useState<number>(0);

    // Load the CSV file from public directory on component mount
    useEffect(() => {
        const loadDefaultCSV = async () => {
            try {
                const response = await fetch('/Provincials Scouting Schedule - ScoutingAppCSV.csv');
                const text = await response.text();
                parseCSV(text);
                setCsvLoaded(true);
            } catch (error) {
                console.error("Error loading default CSV:", error);
            }
        };

        loadDefaultCSV();
    }, []);

    // Fetch TBA data to map positions to team numbers
    useEffect(() => {
        const fetchTBAData = async () => {
            if (!useApi) {
                setTbaLoaded(true);
                return;
            }

            try {
                const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${key}/matches`, {
                    headers: {
                        "X-TBA-Auth-Key": "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO"
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`TBA API error: ${response.status}`);
                }
                
                const data = await response.json();
                const mappings: PositionMapping = {};
                
                // Process qualification matches
                data.filter((match: any) => match.comp_level === "qm").forEach((match: any) => {
                    const matchNum = match.match_number.toString();
                    mappings[matchNum] = {};
                    
                    // Map Red alliance positions
                    match.alliances.red.team_keys.forEach((teamKey: string, index: number) => {
                        const teamNum = teamKey.replace('frc', '');
                        mappings[matchNum][`Red ${index + 1}`] = teamNum;
                    });
                    
                    // Map Blue alliance positions
                    match.alliances.blue.team_keys.forEach((teamKey: string, index: number) => {
                        const teamNum = teamKey.replace('frc', '');
                        mappings[matchNum][`Blue ${index + 1}`] = teamNum;
                    });
                });
                
                setPositionMappings(mappings);
                console.log("TBA position mappings:", mappings);
                setTbaLoaded(true);
            } catch (error) {
                console.error("Error fetching TBA data:", error);
                setTbaLoaded(true); // Still mark as loaded so we don't block the UI
            }
        };
        
        fetchTBAData();
    }, []);

    // Function to parse CSV
    const parseCSV = (text: string) => {
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Find position columns (Red 1, Red 2, etc)
        const positionCols: {[index: number]: string} = {};
        headers.forEach((header, index) => {
            if (index > 0) { // Skip the first column (match number)
                positionCols[index] = header.trim();
            }
        });

        // Parse assignments
        const assignments: ScoutAssignment = {};
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            const matchNum = values[0].trim(); // First column is match number
            
            if (!matchNum || isNaN(parseInt(matchNum))) continue;
            
            if (!assignments[matchNum]) {
                assignments[matchNum] = {};
            }
            
            // Add each position's scout
            Object.entries(positionCols).forEach(([colIndex, position]) => {
                const scoutName = values[parseInt(colIndex)].trim();
                if (scoutName) {
                    assignments[matchNum][position] = scoutName;
                }
            });
        }
        
        setScoutAssignments(assignments);
        console.log("Imported scout assignments:", assignments);
    };

    // Fetch match data
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Starting data fetch");
                const allMatchData: Record<string, string[]> = {};
                
                // Go through each team
                for (const team of teams) {
                    try {
                        console.log(`Checking team ${team}`);
                        // Get all match documents for this team
                        const teamCollectionRef = collection(db, team.toString());
                        const teamSnapshot = await getDocs(teamCollectionRef);
                        
                        teamSnapshot.forEach(doc => {
                            // The document ID is the match number
                            const matchNum = doc.id;
                            if (!allMatchData[matchNum]) {
                                allMatchData[matchNum] = [];
                            }
                            
                            // Add this team to the list of teams for this match
                            allMatchData[matchNum].push(team.toString());
                            console.log(`Found data for team ${team} in match ${matchNum}`);
                        });
                    } catch (teamError) {
                        console.error(`Error fetching data for team ${team}:`, teamError);
                    }
                }
                
                // Process the collected data
                Object.entries(allMatchData).forEach(([matchNum, teamsWithData]) => {
                    setMatchSummaries(prev => ({
                        ...prev,
                        [matchNum]: {
                            teams: teamsWithData,
                            totalScouted: teamsWithData.length
                        }
                    }));
                });
                
                console.log("Finished processing data:", allMatchData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load match data. See console for details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to determine missing scouts with exact position mapping
    const getMissingScouts = (matchNum: string): {position: string, scout: string, team: string}[] => {
        const assignments = scoutAssignments[matchNum];
        const mappings = positionMappings[matchNum];
        
        if (!assignments || !mappings) return [];
        
        const matchData = matchSummaries[matchNum];
        if (!matchData || matchData.totalScouted === 6) return [];
        
        const missingScouts: {position: string, scout: string, team: string}[] = [];
        
        // Check each position
        Object.entries(assignments).forEach(([position, scout]) => {
            const teamNumber = mappings[position];
            
            // If this team's data is missing, add the scout to missing list
            if (teamNumber && !matchData.teams.includes(teamNumber)) {
                missingScouts.push({
                    position,
                    scout,
                    team: teamNumber
                });
            }
        });
        
        return missingScouts;
    };

    // Add this function to calculate scout statistics
    const calculateScoutStats = () => {
        const stats: Record<string, ScoutStats> = {};
        
        // Process all matches
        Object.entries(matchSummaries).forEach(([matchNum, matchData]) => {
            const assignments = scoutAssignments[matchNum];
            const mappings = positionMappings[matchNum];
            
            if (!assignments || !mappings) return;
            
            // Check each position assignment
            Object.entries(assignments).forEach(([position, scoutName]) => {
                // Initialize scout stats if needed
                if (!stats[scoutName]) {
                    stats[scoutName] = { name: scoutName, missed: 0, completed: 0 };
                }
                
                const teamNumber = mappings[position];
                
                // If team exists and was scouted, mark as completed
                if (teamNumber && matchData.teams.includes(teamNumber)) {
                    stats[scoutName].completed++;
                } 
                // If team exists but wasn't scouted, mark as missed
                else if (teamNumber) {
                    stats[scoutName].missed++;
                }
            });
        });
        
        setScoutStats(stats);
    };

    // Call this in useEffect after data is loaded
    useEffect(() => {
        if (!loading && csvLoaded && tbaLoaded && Object.keys(matchSummaries).length > 0) {
            calculateScoutStats();
        }
    }, [loading, csvLoaded, tbaLoaded, matchSummaries]);

    // Add this function to verify the access code
    const verifyAccessCode = () => {
        // Simple hardcoded access code
        if (accessCode === "remyisthebestscoutingappdev") {
            setShowMissedLeaderboard(true);
            setCodeError(false);
        } else {
            setCodeError(true);
        }
    };

    // Add this function to fetch TBA match data for comparison
    const fetchTBAMatchData = async () => {
        if (!useApi) return;
        
        setLoadingTBAComparison(true);
        
        try {
            const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${key}/matches`, {
                headers: {
                    "X-TBA-Auth-Key": "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO"
                }
            });
            
            if (!response.ok) {
                throw new Error(`TBA API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Process qualification matches for comparison
            console.log("TBA match data fetched:", data);
            
            // After fetching data, compare with scouting data
            await compareScoutingData(data);
            
        } catch (error) {
            console.error("Error fetching TBA qualification match data:", error);
        } finally {
            setLoadingTBAComparison(false);
        }
    };
    
    // Function to compare scouting data with TBA data
    const compareScoutingData = async (tbaMatches: any[]) => {
        try {
            console.log("Comparing qualification scouting data with TBA data");
            
            // Filter for qualification matches only
            const qualMatches = tbaMatches.filter(match => match.comp_level === "qm");
            
            // Store the total number of qualification matches for display
            const totalQualificationMatches = qualMatches.length;
            setTotalQualMatches(totalQualificationMatches);
            
            console.log(`Found ${qualMatches.length} qualification matches to compare`);
            
            // Scout accuracy tracking
            const scoutAccuracyMap: Record<string, {
                autoTotalDifference: number,
                autoTotalPossible: number,
                teleopTotalDifference: number,
                teleopTotalPossible: number,
                endgameTotalDifference: number,
                endgameTotalPossible: number,
                matchesScored: number,
                totalDifference: number,
                matches: { matchNum: string, teamNum: string, diffPercentage: number }[]
            }> = {};
            
            const comparisons: MatchComparison[] = [];
            
            // Process each qualification match
            for (const match of qualMatches) {
                const matchNumber = match.match_number.toString();
                const matchLabel = `Qualification ${matchNumber}`;
                
                console.log(`Processing ${matchLabel}`);
                
                // Extract TBA match data, excluding foul points
                const redScore = match.alliances.red.score - (match.score_breakdown?.red?.foul || 0);
                const blueScore = match.alliances.blue.score - (match.score_breakdown?.blue?.foul || 0);
                
                // Check each team in the match
                for (const alliance of ['red', 'blue']) {
                    for (let i = 0; i < 3; i++) {
                        const teamKey = match.alliances[alliance].team_keys[i];
                        const teamNumber = teamKey.replace('frc', '');
                        
                        // Find position in the match
                        const position = `${alliance.charAt(0).toUpperCase() + alliance.slice(1)} ${i + 1}`;
                        
                        // Find the scout assigned to this team
                        const scoutName = scoutAssignments[matchNumber]?.[position];
                        if (!scoutName) {
                            console.log(`No scout assigned to ${position} in match ${matchNumber}`);
                            continue;
                        }
                        
                        // Initialize scout record if not exists
                        if (!scoutAccuracyMap[scoutName]) {
                            scoutAccuracyMap[scoutName] = {
                                autoTotalDifference: 0,
                                autoTotalPossible: 0,
                                teleopTotalDifference: 0,
                                teleopTotalPossible: 0,
                                endgameTotalDifference: 0,
                                endgameTotalPossible: 0,
                                matchesScored: 0,
                                totalDifference: 0,
                                matches: []
                            };
                        }
                        
                        // Get scoring data from TBA
                        const scoreBreakdown = match.score_breakdown?.[alliance];
                        if (!scoreBreakdown) {
                            console.log(`No score breakdown for ${alliance} in match ${matchNumber}`);
                            continue;
                        }
                        
                        // Extract TBA data for auto and teleop
                        const tbaData = extractTBAData(scoreBreakdown, alliance, i);
                        
                        // Get our scouting data for this team and match
                        try {
                            // Check if we have scouting data for this team and match
                            const teamScoutingData = await fetchTeamMatchData(teamNumber, matchNumber);
                            
                            if (!teamScoutingData) {
                                console.log(`No scouting data for team ${teamNumber} in match ${matchNumber}`);
                                continue;
                            }
                            
                            // Calculate differences and accuracy for each phase
                            const differences = calculateDifference(tbaData, teamScoutingData);
                            const possiblePoints = calculateTotalPossiblePoints(tbaData);
                            
                            // Calculate accuracy percentages (higher is better)
                            const autoAccuracy = (possiblePoints.autoTotal - differences.autoDiff) / possiblePoints.autoTotal;
                            const teleopAccuracy = (possiblePoints.teleopTotal - differences.teleopDiff) / possiblePoints.teleopTotal;
                            const endgameAccuracy = (possiblePoints.endgameTotal - differences.endgameDiff) / possiblePoints.endgameTotal;
                            const overallAccuracy = (possiblePoints.overallTotal - differences.totalDiff) / possiblePoints.overallTotal;
                            
                            // Update scout's record
                            const scout = scoutAccuracyMap[scoutName];
                            scout.autoTotalDifference += differences.autoDiff;
                            scout.autoTotalPossible += possiblePoints.autoTotal;
                            scout.teleopTotalDifference += differences.teleopDiff;
                            scout.teleopTotalPossible += possiblePoints.teleopTotal;
                            scout.endgameTotalDifference += differences.endgameDiff;
                            scout.endgameTotalPossible += possiblePoints.endgameTotal;
                            scout.totalDifference += differences.totalDiff;
                            scout.matchesScored += 1;
                            
                            // Store the match result
                            scout.matches.push({
                                matchNum: matchNumber,
                                teamNum: teamNumber,
                                diffPercentage: overallAccuracy
                            });
                            
                            // Add comparison record
                            comparisons.push({
                                matchNumber,
                                tbaData,
                                scoutingData: teamScoutingData
                            });
                            
                            console.log(`Processed data for team ${teamNumber} in match ${matchNumber} by ${scoutName}`);
                        } catch (error) {
                            console.error(`Error processing team ${teamNumber} in match ${matchNumber}:`, error);
                        }
                    }
                }
            }
            
            // Calculate overall accuracy for each scout
            const scoutAccuracyResults: ScoutAccuracy[] = Object.entries(scoutAccuracyMap).map(([name, data]) => {
                // Calculate accuracy percentages
                const autoAccuracy = data.autoTotalPossible > 0 
                    ? (data.autoTotalPossible - data.autoTotalDifference) / data.autoTotalPossible
                    : 0;
                    
                const teleopAccuracy = data.teleopTotalPossible > 0 
                    ? (data.teleopTotalPossible - data.teleopTotalDifference) / data.teleopTotalPossible
                    : 0;
                    
                const endgameAccuracy = data.endgameTotalPossible > 0 
                    ? (data.endgameTotalPossible - data.endgameTotalDifference) / data.endgameTotalPossible
                    : 0;
                
                // Calculate overall accuracy as weighted average of all phases
                const totalPossible = data.autoTotalPossible + data.teleopTotalPossible + data.endgameTotalPossible;
                const totalDifference = data.autoTotalDifference + data.teleopTotalDifference + data.endgameTotalDifference;
                
                const overallAccuracy = totalPossible > 0 
                    ? (totalPossible - totalDifference) / totalPossible
                    : 0;
                
                return {
                    name,
                    autoAccuracy,
                    teleopAccuracy,
                    endgameAccuracy,
                    overallAccuracy,
                    matchesScored: data.matchesScored,
                    totalDifference: data.totalDifference
                };
            });
            
            // Update state with results
            setScoutAccuracy(scoutAccuracyResults);
            setMatchComparisons(comparisons);
            // Store the total number of qualification matches
            sessionStorage.setItem('totalQualificationMatches', totalQualificationMatches.toString());
            console.log("Comparison completed with detailed accuracy metrics:", scoutAccuracyResults);
        } catch (error) {
            console.error("Error in compareScoutingData:", error);
        }
    };
    
    // Helper function to extract relevant data from TBA score breakdown
    const extractTBAData = (scoreBreakdown: any, alliance: string, robotIndex: number): MatchComparison['tbaData'] => {
        // Get robot-specific auto data (robotIndex is 0-based, but TBA indexes are 1-based)
        const robotNum = robotIndex + 1;
        
        // Extract auto data for this specific robot
        const autoLeave = scoreBreakdown[`autoLineRobot${robotNum}`] === "Yes" ? 1 : 0;
        
        // For game pieces, we need to estimate per-robot performance since TBA only provides alliance totals
        // Divide alliance totals evenly among robots as an estimate
        const autoCoral = Math.round((scoreBreakdown.autoCoralCount || 0) / 3);
        const teleopCoral = Math.round((scoreBreakdown.teleopCoralCount || 0) / 3);
        
        // Algae is split between wall and net in this game - estimate per robot
        const teleopAlgae = Math.round(((scoreBreakdown.netAlgaeCount || 0) + (scoreBreakdown.wallAlgaeCount || 0)) / 3);
        const autoAlgae = 0; // Auto algae information might not be directly available, use 0 as default
        
        // Extract endgame data for this specific robot
        const parked = scoreBreakdown[`endGameRobot${robotNum}`] === "Parked" ? 1 : 0;
        const shallow = scoreBreakdown[`endGameRobot${robotNum}`] === "ShallowCage" ? 1 : 0;
        const deep = scoreBreakdown[`endGameRobot${robotNum}`] === "DeepCage" ? 1 : 0;
        
        // Scoring locations - divide these evenly as an estimate since they are alliance totals
        const l1Scored = Math.round((countNodesInRow(scoreBreakdown.teleopReef?.botRow) || 0) / 3);
        const l2Scored = Math.round((countNodesInRow(scoreBreakdown.teleopReef?.midRow) || 0) / 3);
        const l3Scored = 0; // Not clearly defined in the example data
        const l4Scored = Math.round((countNodesInRow(scoreBreakdown.teleopReef?.topRow) || 0) / 3);
        
        // Processor and barge - divide these evenly among robots
        const processorScored = Math.round(Math.floor((scoreBreakdown.teleopPoints - 
            (l1Scored * 2 + l2Scored * 3 + l3Scored * 4 + l4Scored * 5 + scoreBreakdown.endGameBargePoints)) / 6) / 3) || 0;
        
        const bargeScored = Math.round(Math.floor(scoreBreakdown.endGameBargePoints / 4) / 3) || 0;
        
        return {
            auto: {
                leave: autoLeave,
                coral: autoCoral,
                algae: autoAlgae
            },
            teleop: {
                l1Scored,
                l2Scored,
                l3Scored,
                l4Scored,
                processorScored,
                bargeScored,
                coral: teleopCoral,
                algae: teleopAlgae
            },
            endgame: {
                parked,
                shallow,
                deep
            }
        };
    };
    
    // Helper function to count nodes in a row of the reef
    const countNodesInRow = (row: any): number => {
        if (!row) return 0;
        
        let count = 0;
        for (const key in row) {
            if (row[key] === true) count++;
        }
        return count;
    };
    
    // Helper function to fetch team match data from our database
    const fetchTeamMatchData = async (teamNumber: string, matchNumber: string): Promise<MatchComparison['scoutingData'] | null> => {
        try {
            // Get data from Firestore
            const docRef = await getDocs(collection(db, teamNumber));
            let matchData: any = null;
            
            docRef.forEach(doc => {
                if (doc.id === matchNumber) {
                    matchData = doc.data().matchData;
                }
            });
            
            if (!matchData) return null;
            
            // Map our data structure to the comparison format
            return {
                auto: {
                    leave: matchData.auto?.leave || 0,
                    coral: matchData.auto?.coral || 0,
                    algae: matchData.auto?.algae || 0
                },
                teleop: {
                    l1Scored: matchData.teleop?.l1Scored || 0,
                    l2Scored: matchData.teleop?.l2Scored || 0,
                    l3Scored: matchData.teleop?.l3Scored || 0,
                    l4Scored: matchData.teleop?.l4Scored || 0,
                    processorScored: matchData.teleop?.processorScored || 0,
                    bargeScored: matchData.teleop?.bargeScored || 0,
                    coral: matchData.teleop?.coralPickup + matchData.teleop?.coralPickupFromStation || 0,
                    algae: matchData.teleop?.pickupAlgae + matchData.teleop?.pickupAlgaeFromReef || 0
                },
                endgame: {
                    parked: matchData.teleop?.park ? 1 : 0,
                    shallow: matchData.teleop?.shallow ? 1 : 0,
                    deep: matchData.teleop?.deep ? 1 : 0
                }
            };
        } catch (error) {
            console.error(`Error fetching data for team ${teamNumber} match ${matchNumber}:`, error);
            return null;
        }
    };
    
    // Helper function to calculate difference between TBA and our data
    const calculateDifference = (tbaData: MatchComparison['tbaData'], scoutData: MatchComparison['scoutingData']) => {
        // Calculate differences for each category
        const autoDiff = calculateAutoDifference(tbaData.auto, scoutData.auto);
        const teleopDiff = calculateTeleopDifference(tbaData.teleop, scoutData.teleop);
        const endgameDiff = calculateEndgameDifference(tbaData.endgame, scoutData.endgame);
        
        return {
            autoDiff,
            teleopDiff,
            endgameDiff,
            totalDiff: autoDiff + teleopDiff + endgameDiff
        };
    };
    
    // Helper function to calculate auto differences
    const calculateAutoDifference = (tbaAuto: MatchComparison['tbaData']['auto'], scoutAuto: MatchComparison['scoutingData']['auto']) => {
        let autoDiff = 0;
        
        autoDiff += Math.abs(tbaAuto.leave - scoutAuto.leave);
        autoDiff += Math.abs(tbaAuto.coral - scoutAuto.coral);
        autoDiff += Math.abs(tbaAuto.algae - scoutAuto.algae);
        
        return autoDiff;
    };
    
    // Helper function to calculate teleop differences
    const calculateTeleopDifference = (tbaTeleop: MatchComparison['tbaData']['teleop'], scoutTeleop: MatchComparison['scoutingData']['teleop']) => {
        let teleopDiff = 0;
        
        teleopDiff += Math.abs(tbaTeleop.l1Scored - scoutTeleop.l1Scored);
        teleopDiff += Math.abs(tbaTeleop.l2Scored - scoutTeleop.l2Scored);
        teleopDiff += Math.abs(tbaTeleop.l3Scored - scoutTeleop.l3Scored);
        teleopDiff += Math.abs(tbaTeleop.l4Scored - scoutTeleop.l4Scored);
        teleopDiff += Math.abs(tbaTeleop.processorScored - scoutTeleop.processorScored);
        teleopDiff += Math.abs(tbaTeleop.bargeScored - scoutTeleop.bargeScored);
        teleopDiff += Math.abs(tbaTeleop.coral - scoutTeleop.coral);
        teleopDiff += Math.abs(tbaTeleop.algae - scoutTeleop.algae);
        
        return teleopDiff;
    };
    
    // Helper function to calculate endgame differences
    const calculateEndgameDifference = (tbaEndgame: MatchComparison['tbaData']['endgame'], scoutEndgame: MatchComparison['scoutingData']['endgame']) => {
        let endgameDiff = 0;
        
        endgameDiff += Math.abs(tbaEndgame.parked - scoutEndgame.parked);
        endgameDiff += Math.abs(tbaEndgame.shallow - scoutEndgame.shallow);
        endgameDiff += Math.abs(tbaEndgame.deep - scoutEndgame.deep);
        
        return endgameDiff;
    };
    
    // Helper function to calculate total possible points for normalization by phase
    const calculateTotalPossiblePoints = (tbaData: MatchComparison['tbaData']) => {
        // Calculate total points for each phase of the match
        const autoTotal = tbaData.auto.leave + tbaData.auto.coral + tbaData.auto.algae;
        const teleopTotal = tbaData.teleop.l1Scored + tbaData.teleop.l2Scored + 
                          tbaData.teleop.l3Scored + tbaData.teleop.l4Scored + 
                          tbaData.teleop.processorScored + tbaData.teleop.bargeScored +
                          tbaData.teleop.coral + tbaData.teleop.algae;
        const endgameTotal = tbaData.endgame.parked + tbaData.endgame.shallow + tbaData.endgame.deep;
        
        return {
            autoTotal: autoTotal > 0 ? autoTotal : 1,
            teleopTotal: teleopTotal > 0 ? teleopTotal : 1,
            endgameTotal: endgameTotal > 0 ? endgameTotal : 1,
            overallTotal: autoTotal + teleopTotal + endgameTotal > 0 ? autoTotal + teleopTotal + endgameTotal : 1
        };
    };

    if (loading || !csvLoaded || !tbaLoaded) return (
        <>
            <MainHeader />
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Match Summary</h1>
                <div>Loading data...</div>
            </div>
        </>
    );
    
    if (error) return (
        <>
            <MainHeader />
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Match Summary</h1>
                <div className="text-red-500">{error}</div>
            </div>
        </>
    );
    
    if (Object.keys(matchSummaries).length === 0) return (
        <>
            <MainHeader />
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Match Summary</h1>
                <div>No match data found in the database.</div>
            </div>
        </>
    );

    return (
        <>
            <MainHeader />
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                
                {!showMissedLeaderboard ? (
                    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Access Required</h2>
                        <p className="text-gray-400 mb-4">
                            Please enter the access code to continue.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="password"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="Enter access code"
                                className="w-full px-3 py-2 border rounded text-black"
                                onKeyDown={(e) => e.key === 'Enter' && verifyAccessCode()}
                            />
                            <button
                                onClick={verifyAccessCode}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Unlock Page
                            </button>
                            {codeError && (
                                <p className="text-red-500 text-sm">
                                    Invalid access code. Please try again.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Status */}
                        <div className="mb-8 p-4 border rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Data Status</h2>
                            <div className="flex gap-4">
                                <p className="text-green-500">
                                    ✓ Scout assignments loaded ({Object.keys(scoutAssignments).length} matches)
                                </p>
                                <p className="text-green-500">
                                    ✓ TBA position data loaded ({Object.keys(positionMappings).length} matches)
                                </p>
                            </div>
                        </div>
                        
                        {/* Tabs for different views */}
                        <Tabs defaultValue="missing" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
                            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                                <TabsTrigger value="missing">Missing Matches</TabsTrigger>
                                <TabsTrigger value="accuracy">Scout Accuracy</TabsTrigger>
                            </TabsList>
                            
                            {/* Missing Matches Tab Content */}
                            <TabsContent value="missing" className="mt-6">
                                {/* Leaderboards */}
                                <div className="mb-8 grid grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg">
                                        <h2 className="text-xl font-semibold mb-4">Most Missed Matches</h2>
                                        <div className="h-64 overflow-y-auto pr-2">
                                            <div className="space-y-2">
                                                {Object.values(scoutStats)
                                                    .sort((a, b) => b.missed - a.missed)
                                                    .map((scout, index) => (
                                                        <div key={scout.name} className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400 w-5">{index + 1}.</span>
                                                                <span className="font-medium">{scout.name}</span>
                                                            </div>
                                                            <span className="text-red-500 font-bold">{scout.missed} missed</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 border rounded-lg">
                                        <h2 className="text-xl font-semibold mb-4">Most Completed Matches</h2>
                                        <div className="h-64 overflow-y-auto pr-2">
                                            <div className="space-y-2">
                                                {Object.values(scoutStats)
                                                    .sort((a, b) => b.completed - a.completed)
                                                    .map((scout, index) => (
                                                        <div key={scout.name} className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400 w-5">{index + 1}.</span>
                                                                <span className="font-medium">{scout.name}</span>
                                                            </div>
                                                            <span className="text-green-500 font-bold">{scout.completed} completed</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Match Cards */}
                                <div className="space-y-4">
                                    {Object.entries(matchSummaries)
                                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                        .map(([matchNum, data]) => {
                                            const missingScouts = getMissingScouts(matchNum);
                                            
                                            return (
                                                <div 
                                                    key={matchNum}
                                                    className={`p-4 rounded-lg border ${
                                                        data.totalScouted === 6 
                                                            ? 'border-green-500 bg-green-500/10' 
                                                            : 'border-red-500 bg-red-500/10'
                                                    }`}
                                                >
                                                    <h2 className="text-xl font-semibold mb-2">
                                                        Match {matchNum}
                                                        <span className="ml-2 text-sm font-normal">
                                                            ({data.totalScouted}/6 robots scouted)
                                                        </span>
                                                    </h2>
                                                    <div className="text-green-400 mt-2">
                                                        Scouted teams: {data.teams.join(", ")}
                                                    </div>
                                                    {data.totalScouted < 6 && (
                                                        <div className="text-red-400 mt-2">
                                                            <div className="font-bold">Missing {6 - data.totalScouted} teams</div>
                                                            
                                                            {missingScouts.length > 0 && (
                                                                <div className="mt-1 text-sm">
                                                                    <span className="font-bold">Missing scouts:</span> 
                                                                    <ul className="list-disc pl-5 mt-1">
                                                                        {missingScouts.map((item) => (
                                                                            <li key={item.position}>
                                                                                <span className="font-medium">{item.scout}</span> - {item.position} (Team {item.team})
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </TabsContent>
                            
                            {/* Scout Accuracy Tab Content */}
                            <TabsContent value="accuracy" className="mt-6">
                                <div className="mb-6 p-4 border rounded-lg bg-gray-800">
                                    <h2 className="text-xl font-semibold mb-4">TBA Data Comparison</h2>
                                    <p className="text-gray-300 mb-4">
                                        Compare your scouting data with official match data from The Blue Alliance to 
                                        calculate scout accuracy scores.
                                    </p>
                                    <button
                                        onClick={fetchTBAMatchData}
                                        disabled={loadingTBAComparison}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loadingTBAComparison ? "Loading..." : "Fetch TBA Data & Calculate Qualification Accuracy"}
                                    </button>
                                </div>
                                
                                {scoutAccuracy.length > 0 ? (
                                    <>
                                        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
                                            {/* Scout Accuracy Leaderboard */}
                                            <div className="p-4 border rounded-lg">
                                                <h2 className="text-xl font-semibold mb-4">Scout Accuracy Scores</h2>
                                                <div className="space-y-3">
                                                    {scoutAccuracy
                                                        .sort((a, b) => b.overallAccuracy - a.overallAccuracy)
                                                        .map((scout, index) => (
                                                            <div key={scout.name} className="flex justify-between items-center p-2 border-b border-gray-700">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-gray-400 w-5">{index + 1}.</span>
                                                                    <span className="font-medium">{scout.name}</span>
                                                                    <span className="text-gray-400 text-xs">
                                                                        ({scout.matchesScored} matches)
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-3 items-center">
                                                                    <div className="flex flex-col items-end text-xs">
                                                                        <span className="text-gray-400">Auto</span>
                                                                        <span className={`${
                                                                            scout.autoAccuracy > 0.9 ? 'text-green-500' : 
                                                                            scout.autoAccuracy > 0.7 ? 'text-yellow-500' : 
                                                                            'text-red-500'
                                                                        }`}>
                                                                            {Math.round(scout.autoAccuracy * 100)}%
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col items-end text-xs">
                                                                        <span className="text-gray-400">Teleop</span>
                                                                        <span className={`${
                                                                            scout.teleopAccuracy > 0.9 ? 'text-green-500' : 
                                                                            scout.teleopAccuracy > 0.7 ? 'text-yellow-500' : 
                                                                            'text-red-500'
                                                                        }`}>
                                                                            {Math.round(scout.teleopAccuracy * 100)}%
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col items-end text-xs">
                                                                        <span className="text-gray-400">Endgame</span>
                                                                        <span className={`${
                                                                            scout.endgameAccuracy > 0.9 ? 'text-green-500' : 
                                                                            scout.endgameAccuracy > 0.7 ? 'text-yellow-500' : 
                                                                            'text-red-500'
                                                                        }`}>
                                                                            {Math.round(scout.endgameAccuracy * 100)}%
                                                                        </span>
                                                                    </div>
                                                                    <span className={`font-bold ${
                                                                        scout.overallAccuracy > 0.9 ? 'text-green-500' : 
                                                                        scout.overallAccuracy > 0.7 ? 'text-yellow-500' : 
                                                                        'text-red-500'
                                                                    }`}>
                                                                        {Math.round(scout.overallAccuracy * 100)}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                            
                                            {/* Summary Stats */}
                                            <div className="p-4 border rounded-lg">
                                                <h2 className="text-xl font-semibold mb-4">Data Comparison Summary</h2>
                                                <div className="grid grid-cols-4 gap-4">
                                                    <div>
                                                        <h3 className="font-medium mb-2">Overall Accuracy</h3>
                                                        <p className="text-xl">
                                                            {Math.round(scoutAccuracy.reduce((sum, scout) => sum + scout.overallAccuracy, 0) / scoutAccuracy.length * 100)}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium mb-2">Auto Accuracy</h3>
                                                        <p className="text-xl">
                                                            {Math.round(scoutAccuracy.reduce((sum, scout) => sum + scout.autoAccuracy, 0) / scoutAccuracy.length * 100)}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium mb-2">Teleop Accuracy</h3>
                                                        <p className="text-xl">
                                                            {Math.round(scoutAccuracy.reduce((sum, scout) => sum + scout.teleopAccuracy, 0) / scoutAccuracy.length * 100)}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium mb-2">Endgame Accuracy</h3>
                                                        <p className="text-xl">
                                                            {Math.round(scoutAccuracy.reduce((sum, scout) => sum + scout.endgameAccuracy, 0) / scoutAccuracy.length * 100)}%
                                                        </p>
                                                    </div>
                                                    <div className="col-span-4">
                                                        <h3 className="font-medium mb-2">Total Matches Compared</h3>
                                                        <p className="text-xl">
                                                            {scoutAccuracy.reduce((sum, scout) => sum + scout.matchesScored, 0)} 
                                                            <span className="text-sm text-gray-400 ml-2">
                                                                of {totalQualMatches * 6} possible robot-matches 
                                                                ({totalQualMatches} qualification matches × 6 robots)
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Detailed Match Comparison View */}
                                        <div className="border rounded-lg p-4 mb-6">
                                            <h2 className="text-xl font-semibold mb-4">
                                                Qualification Match Details
                                                <span className="ml-2 text-sm text-gray-400">
                                                    ({matchComparisons.length} of {totalQualMatches} total qual matches compared)
                                                </span>
                                            </h2>
                                            <div className="overflow-x-auto">
                                                {matchComparisons.length > 0 ? (
                                                    <table className="min-w-full text-sm">
                                                        <thead>
                                                            <tr className="border-b border-gray-700">
                                                                <th className="py-3 px-4 text-left">Match</th>
                                                                <th className="py-3 px-4 text-left">Phase</th>
                                                                <th className="py-3 px-4 text-left">Metric</th>
                                                                <th className="py-3 px-4 text-right">TBA Data</th>
                                                                <th className="py-3 px-4 text-right">Our Data</th>
                                                                <th className="py-3 px-4 text-right">Difference</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {matchComparisons.map((comparison, index) => {
                                                                // Helper to create rows for each data point in the comparison
                                                                const createDataRows = () => {
                                                                    const rows = [];
                                                                    
                                                                    // Auto Section
                                                                    rows.push(
                                                                        <tr key={`${index}-auto-header`} className="bg-gray-800/70">
                                                                            {index === 0 && <td rowSpan={12} className="py-2 px-4 align-top border-r border-gray-700">{comparison.matchNumber}</td>}
                                                                            <td rowSpan={3} className="py-2 px-4 font-semibold border-r border-gray-700 align-middle">Auto</td>
                                                                            <td className="py-2 px-4">Robot Mobility</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.auto.leave}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.auto.leave}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.auto.leave === comparison.scoutingData.auto.leave
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.auto.leave - comparison.scoutingData.auto.leave)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    rows.push(
                                                                        <tr key={`${index}-auto-coral`} className="bg-gray-800/70">
                                                                            <td className="py-2 px-4">Coral Pickup</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.auto.coral}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.auto.coral}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.auto.coral === comparison.scoutingData.auto.coral
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.auto.coral - comparison.scoutingData.auto.coral)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    rows.push(
                                                                        <tr key={`${index}-auto-algae`} className="bg-gray-800/70">
                                                                            <td className="py-2 px-4">Algae</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.auto.algae}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.auto.algae}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.auto.algae === comparison.scoutingData.auto.algae
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.auto.algae - comparison.scoutingData.auto.algae)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    // Teleop Section
                                                                    rows.push(
                                                                        <tr key={`${index}-teleop-header`}>
                                                                            <td rowSpan={6} className="py-2 px-4 font-semibold border-r border-gray-700 align-middle">Teleop</td>
                                                                            <td className="py-2 px-4">Coral</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.teleop.coral}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.teleop.coral}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.teleop.coral === comparison.scoutingData.teleop.coral
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.teleop.coral - comparison.scoutingData.teleop.coral)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    rows.push(
                                                                        <tr key={`${index}-teleop-algae`}>
                                                                            <td className="py-2 px-4">Algae</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.teleop.algae}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.teleop.algae}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.teleop.algae === comparison.scoutingData.teleop.algae
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.teleop.algae - comparison.scoutingData.teleop.algae)}
                                                                            </td>
                                                                        </tr>
                                                                    );

                                                                    // Scoring locations
                                                                    rows.push(
                                                                        <tr key={`${index}-teleop-l1Scored`}>
                                                                            <td className="py-2 px-4">L1 Scored</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.teleop.l1Scored}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.teleop.l1Scored}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.teleop.l1Scored === comparison.scoutingData.teleop.l1Scored
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.teleop.l1Scored - comparison.scoutingData.teleop.l1Scored)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    rows.push(
                                                                        <tr key={`${index}-teleop-l2Scored`}>
                                                                            <td className="py-2 px-4">L2 Scored</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.teleop.l2Scored}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.teleop.l2Scored}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.teleop.l2Scored === comparison.scoutingData.teleop.l2Scored
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.teleop.l2Scored - comparison.scoutingData.teleop.l2Scored)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    rows.push(
                                                                        <tr key={`${index}-teleop-otherScored`}>
                                                                            <td className="py-2 px-4">Processor</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.teleop.processorScored}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.teleop.processorScored}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.teleop.processorScored === comparison.scoutingData.teleop.processorScored
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.teleop.processorScored - comparison.scoutingData.teleop.processorScored)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    rows.push(
                                                                        <tr key={`${index}-teleop-barge`}>
                                                                            <td className="py-2 px-4">Barge</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.teleop.bargeScored}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.teleop.bargeScored}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.teleop.bargeScored === comparison.scoutingData.teleop.bargeScored
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.teleop.bargeScored - comparison.scoutingData.teleop.bargeScored)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    // Endgame Section
                                                                    rows.push(
                                                                        <tr key={`${index}-endgame-header`} className="bg-gray-800/70">
                                                                            <td rowSpan={3} className="py-2 px-4 font-semibold border-r border-gray-700 align-middle">Endgame</td>
                                                                            <td className="py-2 px-4">Parked</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.endgame.parked}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.endgame.parked}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.endgame.parked === comparison.scoutingData.endgame.parked
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.endgame.parked - comparison.scoutingData.endgame.parked)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    rows.push(
                                                                        <tr key={`${index}-endgame-shallow`} className="bg-gray-800/70">
                                                                            <td className="py-2 px-4">Shallow Cage</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.endgame.shallow}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.endgame.shallow}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.endgame.shallow === comparison.scoutingData.endgame.shallow
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.endgame.shallow - comparison.scoutingData.endgame.shallow)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    rows.push(
                                                                        <tr key={`${index}-endgame-deep`} className="bg-gray-800/70">
                                                                            <td className="py-2 px-4">Deep Cage</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.tbaData.endgame.deep}</td>
                                                                            <td className="py-2 px-4 text-right">{comparison.scoutingData.endgame.deep}</td>
                                                                            <td className={`py-2 px-4 text-right ${
                                                                                comparison.tbaData.endgame.deep === comparison.scoutingData.endgame.deep
                                                                                    ? 'text-green-500'
                                                                                    : 'text-red-500'
                                                                            }`}>
                                                                                {Math.abs(comparison.tbaData.endgame.deep - comparison.scoutingData.endgame.deep)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                    
                                                                    return rows;
                                                                };
                                                                
                                                                return createDataRows();
                                                            })}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div className="text-center p-8 border rounded-lg bg-gray-800/50">
                                                        <p className="text-gray-400 mb-2">
                                                            No comparison data available yet.
                                                        </p>
                                                        <p className="text-gray-500 text-sm">
                                                            Click the button above to fetch TBA data and calculate scout accuracy.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : loadingTBAComparison ? (
                                    <div className="text-center p-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
                                        <p className="text-gray-400">Fetching and comparing data...</p>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 border rounded-lg bg-gray-800/50">
                                        <p className="text-gray-400 mb-2">
                                            No comparison data available yet.
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Click the button above to fetch TBA data and calculate scout accuracy.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </div>
        </>
    );
}

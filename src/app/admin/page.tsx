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
    accuracy: number;
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

    // Load the CSV file from public directory on component mount
    useEffect(() => {
        const loadDefaultCSV = async () => {
            try {
                const response = await fetch('/Scouting Schedule Centenial 2025  - ScoutingAppCSV.csv');
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
            // This is a placeholder - actual implementation will be more complex
            console.log("TBA match data fetched:", data);
            
            // After fetching data, compare with scouting data
            await compareScoutingData(data);
            
        } catch (error) {
            console.error("Error fetching TBA match data for comparison:", error);
        } finally {
            setLoadingTBAComparison(false);
        }
    };
    
    // Function to compare scouting data with TBA data
    const compareScoutingData = async (tbaMatches: any[]) => {
        try {
            console.log("Comparing scouting data with TBA data");
            
            // Filter to qualification matches only
            const qualMatches = tbaMatches.filter(match => match.comp_level === "qm");
            
            // Scout accuracy tracking
            const scoutAccuracyMap: Record<string, {
                totalDifference: number,
                matchesScored: number,
                matches: { matchNum: string, teamNum: string, diffPercentage: number }[]
            }> = {};
            
            const comparisons: MatchComparison[] = [];
            
            // Process each qualification match
            for (const match of qualMatches) {
                const matchNumber = match.match_number.toString();
                console.log(`Processing match ${matchNumber}`);
                
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
                                totalDifference: 0,
                                matchesScored: 0,
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
                        const tbaData = extractTBAData(scoreBreakdown, i);
                        
                        // Get our scouting data for this team and match
                        try {
                            // Check if we have scouting data for this team and match
                            const teamScoutingData = await fetchTeamMatchData(teamNumber, matchNumber);
                            
                            if (!teamScoutingData) {
                                console.log(`No scouting data for team ${teamNumber} in match ${matchNumber}`);
                                continue;
                            }
                            
                            // Calculate difference between TBA and our data
                            const difference = calculateDifference(tbaData, teamScoutingData);
                            const totalPossiblePoints = calculateTotalPossiblePoints(tbaData);
                            const diffPercentage = totalPossiblePoints > 0 
                                ? (totalPossiblePoints - difference) / totalPossiblePoints 
                                : 1;
                            
                            // Add to scout's record
                            scoutAccuracyMap[scoutName].totalDifference += difference;
                            scoutAccuracyMap[scoutName].matchesScored += 1;
                            scoutAccuracyMap[scoutName].matches.push({
                                matchNum: matchNumber,
                                teamNum: teamNumber,
                                diffPercentage
                            });
                            
                            // Add comparison record
                            comparisons.push({
                                matchNumber,
                                tbaData: tbaData,
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
                const matchAccuracies = data.matches.map(m => m.diffPercentage);
                const averageAccuracy = matchAccuracies.length > 0 
                    ? matchAccuracies.reduce((sum, val) => sum + val, 0) / matchAccuracies.length
                    : 0;
                
                return {
                    name,
                    accuracy: averageAccuracy,
                    matchesScored: data.matchesScored,
                    totalDifference: data.totalDifference
                };
            });
            
            // Update state with results
            setScoutAccuracy(scoutAccuracyResults);
            setMatchComparisons(comparisons);
            console.log("Comparison completed:", scoutAccuracyResults);
        } catch (error) {
            console.error("Error in compareScoutingData:", error);
        }
    };
    
    // Helper function to extract relevant data from TBA score breakdown
    const extractTBAData = (scoreBreakdown: any, robotIndex: number): MatchComparison['tbaData'] => {
        // This is a simplified version - you'll need to map the actual TBA data structure
        // to your expected format based on the TBA API documentation
        
        // Auto scoring
        const autoLeave = scoreBreakdown.autoRobotsLeft || 0;
        const autoCoral = 0; // You'll need to extract this from TBA data
        const autoAlgae = 0; // You'll need to extract this from TBA data
        
        // Teleop scoring
        const l1Scored = 0; // Extract from TBA
        const l2Scored = 0; // Extract from TBA
        const l3Scored = 0; // Extract from TBA
        const l4Scored = 0; // Extract from TBA
        const processorScored = 0; // Extract from TBA
        const bargeScored = 0; // Extract from TBA
        
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
                bargeScored
            }
        };
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
                    leave: matchData.auto.leave || 0,
                    coral: matchData.auto.coral || 0,
                    algae: matchData.auto.algae || 0
                },
                teleop: {
                    l1Scored: matchData.teleop.l1Scored || 0,
                    l2Scored: matchData.teleop.l2Scored || 0,
                    l3Scored: matchData.teleop.l3Scored || 0,
                    l4Scored: matchData.teleop.l4Scored || 0,
                    processorScored: matchData.teleop.processorScored || 0,
                    bargeScored: matchData.teleop.bargeScored || 0
                }
            };
        } catch (error) {
            console.error(`Error fetching data for team ${teamNumber} match ${matchNumber}:`, error);
            return null;
        }
    };
    
    // Helper function to calculate difference between TBA and our data
    const calculateDifference = (tbaData: MatchComparison['tbaData'], scoutData: MatchComparison['scoutingData']) => {
        let totalDiff = 0;
        
        // Auto differences
        totalDiff += Math.abs(tbaData.auto.leave - scoutData.auto.leave);
        totalDiff += Math.abs(tbaData.auto.coral - scoutData.auto.coral);
        totalDiff += Math.abs(tbaData.auto.algae - scoutData.auto.algae);
        
        // Teleop differences
        totalDiff += Math.abs(tbaData.teleop.l1Scored - scoutData.teleop.l1Scored);
        totalDiff += Math.abs(tbaData.teleop.l2Scored - scoutData.teleop.l2Scored);
        totalDiff += Math.abs(tbaData.teleop.l3Scored - scoutData.teleop.l3Scored);
        totalDiff += Math.abs(tbaData.teleop.l4Scored - scoutData.teleop.l4Scored);
        totalDiff += Math.abs(tbaData.teleop.processorScored - scoutData.teleop.processorScored);
        totalDiff += Math.abs(tbaData.teleop.bargeScored - scoutData.teleop.bargeScored);
        
        return totalDiff;
    };
    
    // Helper function to calculate total possible points for normalization
    const calculateTotalPossiblePoints = (tbaData: MatchComparison['tbaData']) => {
        let total = 0;
        
        // Auto
        total += tbaData.auto.leave;
        total += tbaData.auto.coral;
        total += tbaData.auto.algae;
        
        // Teleop
        total += tbaData.teleop.l1Scored;
        total += tbaData.teleop.l2Scored;
        total += tbaData.teleop.l3Scored;
        total += tbaData.teleop.l4Scored;
        total += tbaData.teleop.processorScored;
        total += tbaData.teleop.bargeScored;
        
        return total > 0 ? total : 1; // Avoid division by zero
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
                                    <h2 className="text-xl font-semibold mb-4">TBA Data Comparison (THIS DOES NOT WORK RN)</h2>
                                    <p className="text-gray-300 mb-4">
                                        Compare your scouting data with official match data from The Blue Alliance to 
                                        calculate scout accuracy scores.
                                    </p>
                                    <button
                                        onClick={fetchTBAMatchData}
                                        disabled={loadingTBAComparison}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loadingTBAComparison ? "Loading..." : "Fetch TBA Data & Calculate Accuracy"}
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
                                                        .sort((a, b) => b.accuracy - a.accuracy)
                                                        .map((scout, index) => (
                                                            <div key={scout.name} className="flex justify-between items-center p-2 border-b border-gray-700">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-gray-400 w-5">{index + 1}.</span>
                                                                    <span className="font-medium">{scout.name}</span>
                                                                    <span className="text-gray-400 text-xs">
                                                                        ({scout.matchesScored} matches)
                                                                    </span>
                                                                </div>
                                                                <span className={`font-bold ${
                                                                    scout.accuracy > 0.9 ? 'text-green-500' : 
                                                                    scout.accuracy > 0.7 ? 'text-yellow-500' : 
                                                                    'text-red-500'
                                                                }`}>
                                                                    {Math.round(scout.accuracy * 100)}%
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                            
                                            {/* Summary Stats */}
                                            <div className="p-4 border rounded-lg">
                                                <h2 className="text-xl font-semibold mb-4">Data Comparison Summary</h2>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="font-medium mb-2">Overall Accuracy</h3>
                                                        <p className="text-xl">
                                                            {Math.round(scoutAccuracy.reduce((sum, scout) => sum + scout.accuracy, 0) / scoutAccuracy.length * 100)}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium mb-2">Total Matches Compared</h3>
                                                        <p className="text-xl">
                                                            {scoutAccuracy.reduce((sum, scout) => sum + scout.matchesScored, 0)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Detailed Match Comparison View */}
                                        <div className="border rounded-lg p-4 mb-6">
                                            <h2 className="text-xl font-semibold mb-4">Match Details</h2>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-700">
                                                            <th className="py-3 px-4 text-left">Match</th>
                                                            <th className="py-3 px-4 text-left">Category</th>
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
                                                                
                                                                // Auto data
                                                                rows.push(
                                                                    <tr key={`${index}-auto-leave`} className="border-b border-gray-700">
                                                                        {index === 0 && <td rowSpan={9} className="py-2 px-4 align-top">{comparison.matchNumber}</td>}
                                                                        <td className="py-2 px-4">Auto Leave</td>
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
                                                                    <tr key={`${index}-auto-coral`} className="border-b border-gray-700">
                                                                        <td className="py-2 px-4">Auto Coral</td>
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
                                                                    <tr key={`${index}-auto-algae`} className="border-b border-gray-700">
                                                                        <td className="py-2 px-4">Auto Algae</td>
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
                                                                
                                                                // Teleop data
                                                                // Instead of using dynamic keys, let's directly render each field
                                                                
                                                                // L1 Scored
                                                                rows.push(
                                                                    <tr key={`${index}-teleop-l1Scored`} className="border-b border-gray-700">
                                                                        <td className="py-2 px-4">L1 Scored</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.tbaData?.teleop?.l1Scored || 0}</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.scoutingData?.teleop?.l1Scored || 0}</td>
                                                                        <td className={`py-2 px-4 text-right ${
                                                                            (comparison.tbaData?.teleop?.l1Scored || 0) === (comparison.scoutingData?.teleop?.l1Scored || 0)
                                                                                ? 'text-green-500'
                                                                                : 'text-red-500'
                                                                        }`}>
                                                                            {Math.abs((comparison.tbaData?.teleop?.l1Scored || 0) - (comparison.scoutingData?.teleop?.l1Scored || 0))}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                                
                                                                // L2 Scored
                                                                rows.push(
                                                                    <tr key={`${index}-teleop-l2Scored`} className="border-b border-gray-700">
                                                                        <td className="py-2 px-4">L2 Scored</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.tbaData?.teleop?.l2Scored || 0}</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.scoutingData?.teleop?.l2Scored || 0}</td>
                                                                        <td className={`py-2 px-4 text-right ${
                                                                            (comparison.tbaData?.teleop?.l2Scored || 0) === (comparison.scoutingData?.teleop?.l2Scored || 0)
                                                                                ? 'text-green-500'
                                                                                : 'text-red-500'
                                                                        }`}>
                                                                            {Math.abs((comparison.tbaData?.teleop?.l2Scored || 0) - (comparison.scoutingData?.teleop?.l2Scored || 0))}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                                
                                                                // L3 Scored
                                                                rows.push(
                                                                    <tr key={`${index}-teleop-l3Scored`} className="border-b border-gray-700">
                                                                        <td className="py-2 px-4">L3 Scored</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.tbaData?.teleop?.l3Scored || 0}</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.scoutingData?.teleop?.l3Scored || 0}</td>
                                                                        <td className={`py-2 px-4 text-right ${
                                                                            (comparison.tbaData?.teleop?.l3Scored || 0) === (comparison.scoutingData?.teleop?.l3Scored || 0)
                                                                                ? 'text-green-500'
                                                                                : 'text-red-500'
                                                                        }`}>
                                                                            {Math.abs((comparison.tbaData?.teleop?.l3Scored || 0) - (comparison.scoutingData?.teleop?.l3Scored || 0))}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                                
                                                                // L4 Scored
                                                                rows.push(
                                                                    <tr key={`${index}-teleop-l4Scored`} className="border-b border-gray-700">
                                                                        <td className="py-2 px-4">L4 Scored</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.tbaData?.teleop?.l4Scored || 0}</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.scoutingData?.teleop?.l4Scored || 0}</td>
                                                                        <td className={`py-2 px-4 text-right ${
                                                                            (comparison.tbaData?.teleop?.l4Scored || 0) === (comparison.scoutingData?.teleop?.l4Scored || 0)
                                                                                ? 'text-green-500'
                                                                                : 'text-red-500'
                                                                        }`}>
                                                                            {Math.abs((comparison.tbaData?.teleop?.l4Scored || 0) - (comparison.scoutingData?.teleop?.l4Scored || 0))}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                                
                                                                // Processor Scored
                                                                rows.push(
                                                                    <tr key={`${index}-teleop-processorScored`} className="border-b border-gray-700">
                                                                        <td className="py-2 px-4">Processor Scored</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.tbaData?.teleop?.processorScored || 0}</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.scoutingData?.teleop?.processorScored || 0}</td>
                                                                        <td className={`py-2 px-4 text-right ${
                                                                            (comparison.tbaData?.teleop?.processorScored || 0) === (comparison.scoutingData?.teleop?.processorScored || 0)
                                                                                ? 'text-green-500'
                                                                                : 'text-red-500'
                                                                        }`}>
                                                                            {Math.abs((comparison.tbaData?.teleop?.processorScored || 0) - (comparison.scoutingData?.teleop?.processorScored || 0))}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                                
                                                                // Barge Scored
                                                                rows.push(
                                                                    <tr key={`${index}-teleop-bargeScored`} className="border-b border-gray-700">
                                                                        <td className="py-2 px-4">Barge Scored</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.tbaData?.teleop?.bargeScored || 0}</td>
                                                                        <td className="py-2 px-4 text-right">{comparison.scoutingData?.teleop?.bargeScored || 0}</td>
                                                                        <td className={`py-2 px-4 text-right ${
                                                                            (comparison.tbaData?.teleop?.bargeScored || 0) === (comparison.scoutingData?.teleop?.bargeScored || 0)
                                                                                ? 'text-green-500'
                                                                                : 'text-red-500'
                                                                        }`}>
                                                                            {Math.abs((comparison.tbaData?.teleop?.bargeScored || 0) - (comparison.scoutingData?.teleop?.bargeScored || 0))}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                                
                                                                return rows;
                                                            };
                                                            
                                                            return createDataRows();
                                                        })}
                                                    </tbody>
                                                </table>
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

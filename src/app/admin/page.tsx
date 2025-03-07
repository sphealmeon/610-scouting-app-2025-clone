"use client"

import { useState, useEffect } from "react"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs } from "firebase/firestore"
import { MainHeader } from "@/components/MainHeader"
import { teams } from "@/app/globalVars"
import { key, useApi } from "@/app/globalVars"

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

    // Load the CSV file from public directory on component mount
    useEffect(() => {
        const loadDefaultCSV = async () => {
            try {
                const response = await fetch('/Scouting Schedule PH - Scouting Schedule.csv');
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
                <h1 className="text-3xl font-bold mb-6">Match Summary</h1>
                
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
                    </>
                )}
            </div>
        </>
    );
}

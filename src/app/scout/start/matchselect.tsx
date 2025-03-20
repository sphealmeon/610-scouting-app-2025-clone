import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { key, qualificationMatches } from "@/app/globalVars"; // Assuming `key` contains the event key for the API
import { useApi } from "@/app/globalVars"; // Assuming `useApi` determines if the API should be used
import { ScoutingData } from "@/app/scout/data";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import logo from "@/components/assets/logo.png";
import { FetchAlliance } from "@/app/blueAlliance/fetchTeamsInMatch";
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MatchSelect() {
    const [qualMatches, setQualMatches] = useState<any[]>([]); // Store qualification match data
    const [matchNumber, setMatchNumber] = useState("");
    const [teams, setTeams] = useState<string[]>([]); // Teams for the selected match
    const [selectedTeam, setSelectedTeam] = useState("");
    const [error, setError] = useState("");
    const [scoutingData, setScoutingData] = useState({
        start: {
            match: "",
            team: "",
            scoutName: ""
        }
    });
    const [isPlayoff, setIsPlayoff] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("qualification");
    const [loading, setLoading] = useState<boolean>(true);
    
    // Define playoff matches with their Firebase IDs, similar to match summary
    const playoffMatches = [
        { display: "Playoff 1", id: "1001" },
        { display: "Playoff 2", id: "1002" },
        { display: "Playoff 3", id: "1003" },
        { display: "Playoff 4", id: "1004" },
        { display: "Playoff 5", id: "1005" },
        { display: "Playoff 6", id: "1006" },
        { display: "Playoff 7", id: "1007" },
        { display: "Playoff 8", id: "1008" },
        { display: "Playoff 9", id: "1009" },
        { display: "Playoff 10", id: "1010" },
        { display: "Playoff 11", id: "1011" },
        { display: "Playoff 12", id: "1012" },
        { display: "Playoff 13", id: "1013" },
        { display: "Final 1", id: "1014" },
        { display: "Final 2", id: "1015" },
        { display: "Final 3", id: "1016" }
    ];
    
    const matchverify = () : boolean => {
        return selectedTeam !== "" && matchNumber !== "";
    }

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            if (useApi) {
                try {
                    const request = await fetch(
                        "https://www.thebluealliance.com/api/v3/event/" + key + "/matches",
                        {
                            method: "GET",
                            headers: {
                                "X-TBA-Auth-Key":
                                    "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO",
                            },
                        }
                    );

                    if (!request.ok) {
                        throw new Error("Failed to fetch matches from The Blue Alliance.");
                    }

                    const data = await request.json();
                    // Filter for qualification matches
                    const qualMatches = data
                        .filter((match: any) => match.comp_level === "qm")
                        .sort((a: any, b: any) => a.match_number - b.match_number);
                    
                    setQualMatches(qualMatches);
                } catch (err) {
                    console.error("Error fetching matches:", err);
                    setQualMatches([]);
                }
            }
            else {
                // For non-API scenario, set teams from globalVars
                setTeams(teams);
                // Set matches from qualificationMatches in globalVars
                const formattedMatches = qualificationMatches.map(matchNum => ({
                    match_number: parseInt(matchNum),
                    comp_level: "qm"
                }));
                setQualMatches(formattedMatches);
            }
            setLoading(false);
        };

        fetchMatches();
    }, [useApi]);

    const handleMatchNumberChange = async (value: string) => {
        // For playoff matches, set isPlayoff based on the ID format
        setIsPlayoff(parseInt(value) >= 1000);
        
        // Set match number in ScoutingData
        ScoutingData.start.match = parseInt(value);
        
        if (ScoutingData.start.team && !isPlayoff) {
            const alliance = await FetchAlliance(ScoutingData.start.match, ScoutingData.start.team);
            ScoutingData.start.alliance = alliance;
        }
        
        setMatchNumber(value);
        setSelectedTeam("");
        setError("");

        if (useApi && !isPlayoff) {
            // Finding teams for selected match
            const selectedMatch = qualMatches.find(
                (m: any) => m.match_number === parseInt(value, 10)
            );

            if (selectedMatch) {
                const redTeams = selectedMatch.alliances.red.team_keys.map((team: string) =>
                    team.replace("frc", "")
                );
                const blueTeams = selectedMatch.alliances.blue.team_keys.map((team: string) =>
                    team.replace("frc", "")
                );
                setTeams([...redTeams, ...blueTeams]);
            } else {
                setTeams([]);
            }
        }

        // Update scouting data
        setScoutingData(prev => ({
            ...prev,
            start: {
                ...prev.start,
                match: value
            }
        }));
    };

    const handleTeamSelection = async (value: string) => {
        //Write to data: team number
        ScoutingData.start.team = parseInt(value);
        if (ScoutingData.start.match && !isPlayoff) {
            const alliance = await FetchAlliance(ScoutingData.start.match, parseInt(value));
            ScoutingData.start.alliance = alliance;
        }
        setSelectedTeam(value);
        setError(""); // Clear any error when a valid team is selected

        // Update scouting data with the selected team
        setScoutingData(prev => ({
            ...prev,
            start: {
                ...prev.start,
                team: value // Update the team number in ScoutingData
            }
        }));
    };

    const handleAllianceToggle = (checked: boolean) => {
        ScoutingData.start.alliance = checked ? 'blue' : 'red';
    };

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setIsPlayoff(value === "playoff");
        // Reset selections when changing tabs
        setMatchNumber("");
        setSelectedTeam("");
    };

    // Handle alliance change
    const handleAllianceChange = (value: string) => {
        ScoutingData.start.alliance = value;
    };

    return (
        <div className="w-1/2 flex flex-col items-center justify-center text-white">
            <Image src={logo} alt="610 Logo" width={188} height={100} className="mx-auto" />
            <p className="text-2xl mb-6 font-bold">Scouting App</p>
    
            {/* Scout Name Input */}
            <Input
                type="text"
                placeholder="Enter Scout Name"
                className="mb-6 w-64 bg-gray-600 text-white placeholder-gray-400 py-6"
                onChange={(e) => {
                    ScoutingData.start.scoutName = e.target.value;
                }}
            />
    
            {/* Match Type Tabs */}
            <Tabs defaultValue="qualification" onValueChange={handleTabChange} className="w-64 mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                    <TabsTrigger value="qualification">Qualification</TabsTrigger>
                    <TabsTrigger value="playoff">Playoff</TabsTrigger>
                </TabsList>
                
                <TabsContent value="qualification">
                    {useApi ? (
                        // API-based qualification match dropdown
                        <Select onValueChange={handleMatchNumberChange} disabled={loading}>
                            <SelectTrigger className="w-64 bg-gray-600 text-white py-6 mx-auto">
                                <SelectValue placeholder={loading ? "Loading..." : "Select Qualification Match"} />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-600 text-white">
                                {qualMatches.map((match) => (
                                    <SelectItem key={match.match_number} value={String(match.match_number)}
                                        className="text-white">
                                        Match {match.match_number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        // Manual input for qualification match
                        <Input
                            min="1"
                            type="number"
                            placeholder="Enter Match Number"
                            className="mb-6 w-64 bg-gray-600 text-white placeholder-gray-400 py-6 mx-auto"
                            onChange={(e) => handleMatchNumberChange(e.target.value)}
                        />
                    )}
                </TabsContent>
                
                <TabsContent value="playoff">
                    {useApi ? (
                        // Dropdown for playoff matches
                        <Select onValueChange={handleMatchNumberChange}>
                            <SelectTrigger className="w-64 bg-gray-600 text-white py-6 mx-auto">
                                <SelectValue placeholder="Select Playoff Match" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-600 text-white">
                                {playoffMatches.map((match) => (
                                    <SelectItem key={match.id} value={match.id} className="text-white">
                                        {match.display}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        // Manual input for playoff match
                        <Input
                            min="1001"
                            max="1016"
                            type="number"
                            placeholder="Enter Playoff Match ID (1001-1016)"
                            className="mb-6 w-64 bg-gray-600 text-white placeholder-gray-400 py-6 mx-auto"
                            onChange={(e) => handleMatchNumberChange(e.target.value)}
                        />
                    )}
                </TabsContent>
            </Tabs>
    
            {/* Alliance Selection - Only shown when API is off or in Playoff mode */}
            {(isPlayoff || !useApi) && (
                <Tabs defaultValue="red" onValueChange={handleAllianceChange} className="w-64 mb-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                        <TabsTrigger value="red" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Red</TabsTrigger>
                        <TabsTrigger value="blue" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Blue</TabsTrigger>
                    </TabsList>
                </Tabs>
            )}
    
            {/* Team Selection Section */}
            {matchNumber && (
                <>
                    {isPlayoff ? (
                        // Manual team input for playoffs/finals
                        <Input
                            min="1"
                            type="number"
                            placeholder="Enter Team Number"
                            className="mb-6 w-64 bg-gray-600 text-white placeholder-gray-400 py-6"
                            onChange={(e) => handleTeamSelection(e.target.value)}
                        />
                    ) : useApi ? (
                        // Team dropdown for qualification matches with API
                        <Select
                            onValueChange={handleTeamSelection}
                            disabled={!matchNumber}
                        >
                            <SelectTrigger className="mb-6 w-64 bg-gray-600 text-white py-6">
                                <SelectValue placeholder={matchNumber ? "Select Team" : "Select a Match First"} />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-600 text-white">
                                {teams.map((team) => (
                                    <SelectItem key={team} value={team} className="text-white">
                                        Team {team}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        // Manual team input for non-API qualification matches
                        <Input
                            min="1"
                            type="number"
                            placeholder="Enter Team Number"
                            className="mb-6 w-64 bg-gray-600 text-white placeholder-gray-400 py-6"
                            onChange={(e) => handleTeamSelection(e.target.value)}
                        />
                    )}
                </>
            )}
    
            {/* Container for preload checkbox */}
            <div className="flex items-center mb-4 gap-4">
                <div className="flex items-center justify-center gap-2">
                    <label htmlFor="preload" className="text-white font-medium leading-none ml-2 text-white">
                        Preload?
                    </label>
                    <Checkbox 
                        id="preload" 
                        onClick={() => {
                            console.log("here");
                            ScoutingData.start.preload = ScoutingData.start.preload == 0 ? 1 : 0; // Set to 1 if checked, otherwise 0
                        }} 
                    />
                </div>
            </div>
    
            {/* Optional: Add visual feedback about selection state */}
            {!matchverify() && (
                <p className="text-sm text-gray-300 mt-2">
                    Select match and team to continue
                </p>
            )}
        </div>
    );
}

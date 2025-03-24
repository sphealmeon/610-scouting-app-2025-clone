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
    const [playoffMatches, setPlayoffMatches] = useState<any[]>([]); // Store playoff match data
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
    
    // Function to format playoff match display name
    const formatPlayoffMatchName = (match: any) => {
        const level = match.comp_level;
        const matchNum = match.match_number;
        const setNum = match.set_number;
        
        if (level === "qf") return `Quarterfinal ${setNum} Match ${matchNum}`;
        if (level === "sf") return `Semifinal ${setNum} Match ${matchNum}`;
        if (level === "f") return `Final ${matchNum}`;
        return `Playoff Match ${matchNum}`;
    };
    
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
                    
                    // Filter for playoff matches (qf, sf, f)
                    const playoffMatches = data
                        .filter((match: any) => ["qf", "sf", "f"].includes(match.comp_level))
                        .sort((a: any, b: any) => {
                            // Sort by competition level first (qf, sf, f)
                            const levelOrder = { qf: 1, sf: 2, f: 3 };
                            if (levelOrder[a.comp_level as keyof typeof levelOrder] !== levelOrder[b.comp_level as keyof typeof levelOrder]) {
                                return levelOrder[a.comp_level as keyof typeof levelOrder] - levelOrder[b.comp_level as keyof typeof levelOrder];
                            }
                            // Then by set number
                            if (a.set_number !== b.set_number) {
                                return a.set_number - b.set_number;
                            }
                            // Finally by match number
                            return a.match_number - b.match_number;
                        });
                    
                    setQualMatches(qualMatches);
                    setPlayoffMatches(playoffMatches);
                } catch (err) {
                    console.error("Error fetching matches:", err);
                    setQualMatches([]);
                    setPlayoffMatches([]);
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
                
                // Define static playoff matches for non-API scenario
                const staticPlayoffMatches = [
                    { display: "Quarterfinal 1-1", id: "qf_1_1", comp_level: "qf", set_number: 1, match_number: 1 },
                    { display: "Quarterfinal 1-2", id: "qf_1_2", comp_level: "qf", set_number: 1, match_number: 2 },
                    { display: "Quarterfinal 2-1", id: "qf_2_1", comp_level: "qf", set_number: 2, match_number: 1 },
                    { display: "Quarterfinal 2-2", id: "qf_2_2", comp_level: "qf", set_number: 2, match_number: 2 },
                    { display: "Quarterfinal 3-1", id: "qf_3_1", comp_level: "qf", set_number: 3, match_number: 1 },
                    { display: "Quarterfinal 3-2", id: "qf_3_2", comp_level: "qf", set_number: 3, match_number: 2 },
                    { display: "Quarterfinal 4-1", id: "qf_4_1", comp_level: "qf", set_number: 4, match_number: 1 },
                    { display: "Quarterfinal 4-2", id: "qf_4_2", comp_level: "qf", set_number: 4, match_number: 2 },
                    { display: "Semifinal 1-1", id: "sf_1_1", comp_level: "sf", set_number: 1, match_number: 1 },
                    { display: "Semifinal 1-2", id: "sf_1_2", comp_level: "sf", set_number: 1, match_number: 2 },
                    { display: "Semifinal 2-1", id: "sf_2_1", comp_level: "sf", set_number: 2, match_number: 1 },
                    { display: "Semifinal 2-2", id: "sf_2_2", comp_level: "sf", set_number: 2, match_number: 2 },
                    { display: "Final 1", id: "f_1_1", comp_level: "f", set_number: 1, match_number: 1 },
                    { display: "Final 2", id: "f_1_2", comp_level: "f", set_number: 1, match_number: 2 },
                    { display: "Final 3", id: "f_1_3", comp_level: "f", set_number: 1, match_number: 3 }
                ];
                setPlayoffMatches(staticPlayoffMatches);
            }
            setLoading(false);
        };

        fetchMatches();
    }, [useApi]);

    const handleMatchNumberChange = async (value: string) => {
        let matchData: any;
        let matchType: string;
        
        // Determine if we're dealing with a qualification or playoff match
        if (activeTab === "qualification") {
            matchType = "qm";
            matchData = qualMatches.find((m: any) => String(m.match_number) === value);
        } else {
            matchType = "playoff";
            matchData = playoffMatches.find((m: any) => {
                if (useApi) {
                    // For API data, check comp_level, set_number, and match_number combined
                    return `${m.comp_level}_${m.set_number}_${m.match_number}` === value;
                } else {
                    return m.id === value;
                }
            });
        }
        
        // Set match number and match key in ScoutingData
        if (matchData) {
            if (matchType === "qm") {
                ScoutingData.start.match = parseInt(value);
            } else {
                // For playoff matches, store the match info differently
                ScoutingData.start.match = parseInt(value.split('_').pop() || "0");
                // If your ScoutingData interface doesn't have matchKey, you might need to add it
                // Store the full match identifier as a custom property
                (ScoutingData.start as any).matchIdentifier = value;
            }
        } else {
            ScoutingData.start.match = matchType === "qm" ? parseInt(value) : parseInt(value.split('_').pop() || "0");
        }
        
        setIsPlayoff(activeTab === "playoff");
        setMatchNumber(value);
        setSelectedTeam("");
        setError("");

        // Fetch teams for the selected match if using API
        if (useApi && matchData) {
            // Finding teams for selected match
            const redTeams = matchData.alliances.red.team_keys.map((team: string) =>
                team.replace("frc", "")
            );
            const blueTeams = matchData.alliances.blue.team_keys.map((team: string) =>
                team.replace("frc", "")
            );
            setTeams([...redTeams, ...blueTeams]);
            
            // If this is a qual match and a team is selected, determine alliance
            if (matchType === "qm" && ScoutingData.start.team) {
                const alliance = await FetchAlliance(parseInt(value), ScoutingData.start.team);
                ScoutingData.start.alliance = alliance;
            }
        } else {
            setTeams([]);
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
        
        // Determine alliance if it's a qualification match and API is enabled
        if (activeTab === "qualification" && useApi) {
            const alliance = await FetchAlliance(
                typeof ScoutingData.start.match === 'number' ? ScoutingData.start.match : parseInt(String(ScoutingData.start.match)), 
                parseInt(value)
            );
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

    // Create a match ID for playoff matches (API mode)
    const createPlayoffMatchId = (match: any): string => {
        return `${match.comp_level}_${match.set_number}_${match.match_number}`;
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
                        // Dropdown for TBA playoff matches
                        <Select onValueChange={handleMatchNumberChange} disabled={loading}>
                            <SelectTrigger className="w-64 bg-gray-600 text-white py-6 mx-auto">
                                <SelectValue placeholder={loading ? "Loading..." : "Select Playoff Match"} />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-600 text-white">
                                {playoffMatches.map((match) => (
                                    <SelectItem 
                                        key={createPlayoffMatchId(match)} 
                                        value={createPlayoffMatchId(match)} 
                                        className="text-white"
                                    >
                                        {formatPlayoffMatchName(match)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        // Dropdown for static playoff matches
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
                    {!useApi ? (
                        // Manual team input
                        <Input
                            min="1"
                            type="number"
                            placeholder="Enter Team Number"
                            className="mb-6 w-64 bg-gray-600 text-white placeholder-gray-400 py-6"
                            onChange={(e) => handleTeamSelection(e.target.value)}
                        />
                    ) : teams.length > 0 ? (
                        // Team dropdown for matches with API
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
                        // Manual team input if no teams loaded
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

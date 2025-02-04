import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { key } from "@/app/globalVars"; // Assuming `key` contains the event key for the API
import { useApi } from "@/app/globalVars"; // Assuming `useApi` determines if the API should be used
import { ScoutingData } from "@/app/scout/data";
import { Input } from "@/components/ui/input";

export default function MatchSelect() {
    const [matches, setMatches] = useState<any[]>([]); // Store match data
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
    
    function matchverify() : boolean {
        return selectedTeam !== "" && matchNumber !== ""
    }

    useEffect(() => {
        const fetchMatches = async () => {
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
                    setMatches(
                        data.filter((match: any) => match.comp_level === "qm")
                        // Qual matches = qm 
                    );
                } catch (err) {
                    console.error("Error fetching matches:", err);
                    setMatches([]);
                }
            }
            else {
                // Handle non-API scenario here
            }
        };

        fetchMatches();
    }, [useApi]);

    const handleMatchNumberChange = (value: string) => {
        //Write to data: match number
        ScoutingData.start.match=parseInt(value);

        setMatchNumber(value);
        setSelectedTeam("");
        setError("");

        // Finding teams for selected match
        const selectedMatch = matches.find(
            (m: any) => m.match_number === parseInt(value, 10)
        );

        if (selectedMatch) {
            const redTeams = selectedMatch.alliances.red.team_keys.map((team: string) =>
                team.replace("frc", "")
            ); // Remove "frc" prefix
            const blueTeams = selectedMatch.alliances.blue.team_keys.map((team: string) =>
                team.replace("frc", "")
            );
            setTeams([...redTeams, ...blueTeams]);
            console.log("Teams:", ...redTeams, ...blueTeams);

            // Update scouting data with the selected match number
            setScoutingData(prev => ({
                ...prev,
                start: {
                    ...prev.start,
                    match: value // Update the match number in ScoutingData
                }
            }));
        } else {
            setTeams([]);
        }
    };

    const handleTeamSelection = (value: string) => {
        //Write to data: team number
        ScoutingData.start.team=parseInt(value);

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

    return (
        <div className="w-1/2 flex flex-col items-center justify-center">
            <p className="text-2xl mb-6 font-bold">Scouting App</p>

            {/* Scout Name Input */}
            <Input
                type="text"
                placeholder="Enter Scout Name"
                className="mb-6 w-full"
                onChange={(e) => {
                    ScoutingData.start.scoutName = e.target.value;
                }}
            />

            {useApi ? (
                // API-based dropdowns
                <>
                    <Select onValueChange={handleMatchNumberChange}>
                        <SelectTrigger className="mb-6 w-full">
                            <SelectValue placeholder="Select Match Number" />
                        </SelectTrigger>
                        <SelectContent>
                            {matches
                                .sort((a, b) => a.match_number - b.match_number)
                                .map((match) => (
                                    <SelectItem key={match.match_number} value={String(match.match_number)}>
                                        Match {match.match_number}
                                    </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={handleTeamSelection}
                        disabled={!matchNumber}
                    >
                        <SelectTrigger className="mb-6 w-full">
                            <SelectValue placeholder={matchNumber ? "Select Team" : "Select a Match First"} />
                        </SelectTrigger>
                        <SelectContent>
                            {teams.map((team) => (
                                <SelectItem key={team} value={team}>
                                    Team {team}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </>
            ) : (
                // Manual input fields
                <>
                    <Input
                        min="1"
                        type="number"
                        placeholder="Enter Match Number"
                        className="mb-6 w-full"
                        onChange={(e) => handleMatchNumberChange(e.target.value)}
                    />
                    <Input
                        min="1"
                        type="number"
                        placeholder="Enter Team Number"
                        className="mb-6 w-full"
                        onChange={(e) => handleTeamSelection(e.target.value)}
                    />
                </>
            )}

            {/* Container for checkbox and label */}
            <div className="flex items-center mb-6">
                <Checkbox id="preload" />
                <label htmlFor="preload" className="text-sm font-medium leading-none ml-2">
                    Preload?
                </label>
            </div>
        </div>
    );
}

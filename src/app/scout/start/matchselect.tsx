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
import { Data } from "@/app/interfaces";
import { BlueAllianceMatch } from '@/app/blueAlliance/types';

export default function MatchSelect() {
    const [matches, setMatches] = useState<BlueAllianceMatch[]>([]);
    const [matchNumber, setMatchNumber] = useState("");
    const [teams, setTeams] = useState<string[]>([]); // Teams for the selected match
    const [selectedTeam, setSelectedTeam] = useState("");
    const matchverify = () : boolean => {
        return selectedTeam !== "" && matchNumber !== "";
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

                    const data: BlueAllianceMatch[] = await request.json();
                    setMatches(
                        data.filter(match => match.comp_level === "qm")
                    );
                } catch (err) {
                    console.error("Error fetching matches:", err);
                    setMatches([]);
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
                setMatches(formattedMatches as BlueAllianceMatch[]);
            }
        };

        fetchMatches();
    }, []);  // Remove useApi from deps since it's not expected to change

    const handleMatchNumberChange = async (value: string) => {
        //Write to data: match number
        ScoutingData.start.match = parseInt(value);
        if (ScoutingData.start.team) {
            const alliance = await FetchAlliance(parseInt(value), ScoutingData.start.team);
            ScoutingData.start.alliance = alliance;
        }
        setMatchNumber(value);
        setSelectedTeam("");

        if (useApi) {
            // Finding teams for selected match
            const selectedMatch = matches.find(
                (m: BlueAllianceMatch) => m.match_number === parseInt(value, 10)
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
        // else case not needed as teams are already set in fetchMatches for non-API scenario

        // Update scouting data
        ScoutingData.start.match = parseInt(value);
    };

    const handleTeamSelection = async (value: string) => {
        //Write to data: team number
        ScoutingData.start.team = parseInt(value);
        if (ScoutingData.start.match) {
            const alliance = await FetchAlliance(ScoutingData.start.match, parseInt(value));
            ScoutingData.start.alliance = alliance;
        }
        setSelectedTeam(value);

        // Update scouting data with the selected team
        ScoutingData.start.team = parseInt(value);
    };

    return (
        <div className="w-1/2 flex flex-col items-center justify-center text-white">
            <Image src={logo} alt="610 Logo" width={188} height={100} className="mx-auto" />
            <p className="text-2xl mb-6 font-bold">Scouting App</p>
    
            {/* Scout Name Input */}
            <Input
                type="text"
                placeholder="Enter Scout Name"
                className="mb-6 w-1/3 bg-gray-600 text-white placeholder-gray-400 py-6"
                onChange={(e) => {
                    ScoutingData.start.scoutName = e.target.value;
                }}
            />
    
            {useApi ? (
                // API-based dropdowns
                <>
                    <Select onValueChange={handleMatchNumberChange}>
                        <SelectTrigger className="mb-6 w-1/3 bg-gray-600 text-white py-6">
                            <SelectValue placeholder="Select Match Number" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-600 text-white">
                            {matches
                                .sort((a, b) => a.match_number - b.match_number)
                                .map((match) => (
                                    <SelectItem key={match.match_number} value={String(match.match_number)}
                                        className="text-white">
                                        Match {match.match_number}
                                    </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
    
                    <Select
                        onValueChange={handleTeamSelection}
                        disabled={!matchNumber}
                    >
                        <SelectTrigger className="mb-6 w-1/3 bg-gray-600 text-white py-6">
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
                </>
            ) : (
                // Manual input fields
                <>
                    <Input
                        min="1"
                        type="number"
                        placeholder="Enter Match Number"
                        className="mb-6 w-1/3 bg-gray-600 text-white placeholder-gray-400 py-6"
                        onChange={(e) => handleMatchNumberChange(e.target.value)}
                    />
                    <Input
                        min="1"
                        type="number"
                        placeholder="Enter Team Number"
                        className="mb-6 w-1/3 bg-gray-600 text-white placeholder-gray-400 py-6"
                        onChange={(e) => handleTeamSelection(e.target.value)}
                    />
                </>
            )}
    
            {/* Container for checkbox and label */}
            <div className="flex items-center mb-4">
                <Checkbox 
                    id="preload" 
                    onClick={() => {
                        console.log("here");
                        ScoutingData.start.preload = ScoutingData.start.preload == 0 ? 1 : 0; // Set to 1 if checked, otherwise 0
                    }} 
                />
                <label htmlFor="preload" className="text-sm font-medium leading-none ml-2 text-white">
                    Preload?
                </label>
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

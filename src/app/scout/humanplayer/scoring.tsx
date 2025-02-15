import { Button } from "@/components/ui/button";
import { HPData, resetData } from "../data";
import { SubmitHP } from "@/app/firebase/submitHP";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { key, useApi } from "@/app/globalVars";
interface MatchTeams {
    red: number[];
    blue: number[];
}

export default function HumanPlayerMain({ setMatchState }: { setMatchState: Function }) {
    const [match, setMatch] = useState<string>("");
    const [redTeam, setRedTeam] = useState<string>("");
    const [blueTeam, setBlueTeam] = useState<string>("");
    const [matchTeams, setMatchTeams] = useState<MatchTeams | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            if (useApi) {
                try {
                    const request = await fetch(
                        "https://www.thebluealliance.com/api/v3/event/" + key + "/matches",
                        {
                            method: "GET",
                            headers: {
                                "X-TBA-Auth-Key": "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO",
                            },
                        }
                    );

                    if (!request.ok) {
                        throw new Error("Failed to fetch matches");
                    }

                    const data = await request.json();
                    const selectedMatch = data.find((m: any) => m.match_number === parseInt(match));
                    
                    if (selectedMatch) {
                        const redTeams = selectedMatch.alliances.red.team_keys.map((team: string) =>
                            team.replace("frc", "")
                        );
                        const blueTeams = selectedMatch.alliances.blue.team_keys.map((team: string) =>
                            team.replace("frc", "")
                        );
                        setMatchTeams({ red: redTeams, blue: blueTeams });
                    }
                } catch (err) {
                    console.error("Error fetching matches:", err);
                }
            }
        };

        if (match) {
            fetchMatches();
        }
    }, [match]);

    const handleExit = () => {
        resetData();
        setMatchState(0);
    };

    const handleSubmit = () => {
        if (!match || !redTeam || !blueTeam) {
            alert("Please select match and teams first");
            return;
        }
        
        // Update HPData with match and team info
        HPData.red.team = parseInt(redTeam);
        HPData.red.match = parseInt(match);
        HPData.blue.team = parseInt(blueTeam);
        HPData.blue.match = parseInt(match);
        
        SubmitHP({ 
            team1: HPData.red.team, 
            team2: HPData.blue.team, 
            matchData: HPData 
        });
        handleExit();
    };

    const handleBlueScored = () => {
        HPData.blue.blueScored++;
    };

    const handleRedScored = () => {
        HPData.red.redScored++;
    };

    const handleBlueMissed = () => {
        HPData.blue.blueMissed++;
    };

    const handleRedMissed = () => {
        HPData.red.redMissed++;
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex items-center gap-4 mb-8 w-full">
                <h1 className="text-3xl font-bold">Human Player</h1>
                <div className="flex gap-4">
                    <Select onValueChange={setMatch} value={match}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Match" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({length: 100}, (_, i) => i + 1).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                    Match {num}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setBlueTeam} value={blueTeam} disabled={!matchTeams}>
                        <SelectTrigger className="w-[180px] bg-blue-100">
                            <SelectValue placeholder="Select Blue Team" />
                        </SelectTrigger>
                        <SelectContent>
                            {matchTeams?.blue.map((team) => (
                                <SelectItem key={team} value={team.toString()}>
                                    {team}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setRedTeam} value={redTeam} disabled={!matchTeams}>
                        <SelectTrigger className="w-[180px] bg-red-100">
                            <SelectValue placeholder="Select Red Team" />
                        </SelectTrigger>
                        <SelectContent>
                            {matchTeams?.red.map((team) => (
                                <SelectItem key={team} value={team.toString()}>
                                    {team}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-blue-500 hover:bg-blue-400 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleBlueScored}
                >
                    Blue Scored
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleRedScored}
                >
                    Red Scored
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-blue-500 hover:bg-blue-400 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleBlueMissed}
                >
                    Blue Missed
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleRedMissed}
                >
                    Red Missed
                </div>
                <Button className="bg-green-700 hover:bg-green-600 h-20 text-xl font-bold" onClick={handleExit}>
                    Back to Start
                </Button>
                <Button className="bg-green-700 hover:bg-green-600 h-20 text-xl font-bold" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

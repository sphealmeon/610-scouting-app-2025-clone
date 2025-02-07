import { Button } from "@/components/ui/button";
import { ScoutingData, resetData } from "../data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { FetchTeamsInMatch } from "@/app/blueAlliance/fetchTeamsInMatch";

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
        if (match) {
            const fetchMatchTeams = async () => {
                const teams = await FetchTeamsInMatch({ match: parseInt(match) });
                if (teams) {
                    setMatchTeams(teams);
                    setRedTeam("");  
                    setBlueTeam("");
                }
            };
            fetchMatchTeams();
        }
    }, [match]);

    const handleExit = () => {
        resetData();
        setMatchState(0);
    };

    const handleBlueScored = () => {
        ScoutingData.humanPlayer.blueScored++;
    };

    const handleRedScored = () => {
        ScoutingData.humanPlayer.redScored++;
    };

    const handleBlueMissed = () => {
        ScoutingData.humanPlayer.blueMissed++;
    };

    const handleRedMissed = () => {
        ScoutingData.humanPlayer.redMissed++;
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-6">
            <div className="flex items-center gap-4 mb-6 w-full">
                <h1 className="text-2xl font-bold">Human Player Scout</h1>
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
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-white text-center cursor-pointer rounded-lg"
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
                <Button className="h-20 text-xl font-bold" onClick={handleExit}>
                    Back To Start
                </Button>
                <Button className="h-20 text-xl font-bold" onClick={handleExit}>
                    Submit 
                </Button>
            </div>
        </div>
    );
}

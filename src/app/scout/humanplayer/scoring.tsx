import { Button } from "@/components/ui/button";
import { resetData } from "../data";
import { submitHPData } from "@/app/scout/humanplayer/submitHP";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { key, useApi } from "@/app/globalVars";
import { ScoutingData } from "../data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
interface MatchTeams {
    red: number[];
    blue: number[];
}

export default function HumanPlayerMain({ setMatchState }: { setMatchState: Function }) {
    const [match, setMatch] = useState<string>("");
    const [redTeam, setRedTeam] = useState<string>("");
    const [blueTeam, setBlueTeam] = useState<string>("");
    const [matchTeams, setMatchTeams] = useState<MatchTeams | null>(null);
    const [alliance, setAlliance] = useState<string>("red"); // Use the strict type

    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [scores, setScores] = useState({
        red: { redScored: 0, redMissed: 0, team: 0, match: 0 },
        blue: { blueScored: 0, blueMissed: 0, team: 0, match: 0 }
    });
    const switchAlliance = (value: string) => {
        setAlliance(value)
    }

    const handleAllianceChange = (value: string) => {
            ScoutingData.start.alliance = value;
        };

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
                    const qualMatches = data
                        .filter((match: any) => match.comp_level === "qm")
                        .sort((a: any, b: any) => a.match_number - b.match_number);
                    
                    const selectedMatch = qualMatches.find((m: any) => m.match_number === parseInt(match));
                    
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

    const handleSubmit = async () => {
        if (!match) {
            alert("Please select a match first");
            return;
        }
        
        const submitData = {
            red: {
                ...scores.red,
                team: parseInt(redTeam || "0"),
                match: parseInt(match)
            },
            blue: {
                ...scores.blue,
                team: parseInt(blueTeam || "0"),
                match: parseInt(match)
            }
        };
        
        try {
            await submitHPData({ 
                red: {
                    team: parseInt(redTeam || "0"),
                    match: parseInt(match),
                    redScored: scores.red.redScored,
                    redMissed: scores.red.redMissed
                },
                blue: {
                    team: parseInt(blueTeam || "0"),
                    match: parseInt(match),
                    blueScored: scores.blue.blueScored,
                    blueMissed: scores.blue.blueMissed
                }
            });
            handleExit();
        } catch (error) {
            alert("Error submitting data. Please try again.");
            console.error(error);
        }
    };

    const handleBlueScored = () => {
        setScores(prev => ({
            ...prev,
            blue: {
                ...prev.blue,
                blueScored: prev.blue.blueScored + 1
            }
        }));
        setFeedbackMessage("Blue team scored!");
    };

    const handleRedScored = () => {
        setScores(prev => ({
            ...prev,
            red: {
                ...prev.red,
                redScored: prev.red.redScored + 1
            }
        }));
        setFeedbackMessage("Red team scored!");
    };

    const handleBlueMissed = () => {
        setScores(prev => ({
            ...prev,
            blue: {
                ...prev.blue,
                blueMissed: prev.blue.blueMissed + 1
            }
        }));
        setFeedbackMessage("Blue team missed!");
    };

    const handleRedMissed = () => {
        setScores(prev => ({
            ...prev,
            red: {
                ...prev.red,
                redMissed: prev.red.redMissed + 1
            }
        }));
        setFeedbackMessage("Red team missed!");
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

                    {/* <Select onValueChange={setBlueTeam} value={blueTeam} disabled={!matchTeams}>
                        <SelectTrigger className="w-[180px] bg-blue-100">
                            <SelectValue placeholder="Select Blue Team" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">No Team</SelectItem>
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
                            <SelectItem value="0">No Team</SelectItem>
                            {matchTeams?.red.map((team) => (
                                <SelectItem key={team} value={team.toString()}>
                                    {team}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select> */}
                     <Tabs defaultValue="red" onValueChange={switchAlliance} className="w-64 mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                <TabsTrigger value="red" className="data-[state=active]:bg-red-500 hover:bg-red-400 data-[state=active]:text-white">Red</TabsTrigger>
                <TabsTrigger value="blue" className="data-[state=active]:bg-blue-500 hover:bg-blue-400 data-[state=active]:text-white">Blue</TabsTrigger>
            </TabsList>
        </Tabs>
        
                </div>
            </div>

            {feedbackMessage && (
                <div className="mb-4 text-lg font-semibold text-green-600">
                    {feedbackMessage}
                </div>
            )}


       
            <div className="grid grid-cols-2 gap-4 w-full">
                {alliance == "blue" && matchTeams?.blue && matchTeams.blue.map((team) => (
                    <>
                        <div
                            className="flex items-center justify-center h-60 text-3xl font-bold bg-green-500 hover:bg-green-400 text-white text-center cursor-pointer rounded-lg"
                            onClick={handleBlueScored}
                        >
                            {team} Scored
                        </div>
                        <div
                            className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-center cursor-pointer rounded-lg"
                            onClick={handleBlueMissed}
                        >
                            {team} Missed
                        </div>
                    </>
                ))}
                {alliance == "red" && matchTeams?.red && matchTeams.red.map((team) => (
                    <>
                        <div
                            className="flex items-center justify-center h-60 text-3xl font-bold bg-green-500 hover:bg-green-400 text-white text-center cursor-pointer rounded-lg"
                            onClick={handleRedScored}
                        >
                            {team} Scored
                        </div>
                        <div
                            className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-center cursor-pointer rounded-lg"
                            onClick={handleRedMissed}
                        >
                            {team} Missed
                        </div>
                    </>
                ))}
                {/* <div
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
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleRedMissed}
                >
                    Red Missed
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleRedMissed}
                >
                    Red Missed
                </div> */}
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

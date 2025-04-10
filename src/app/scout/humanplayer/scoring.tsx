import { Button } from "@/components/ui/button";
import { resetData } from "../data";
import { submitHPData } from "@/app/scout/humanplayer/submitHP";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { key, useApi } from "@/app/globalVars";
import { ScoutingData } from "../data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeamPickupData {
    scored: number;
    missed: number;
}

interface TeamPickupCollection {
    [teamNumber: string]: TeamPickupData;
}

interface MatchTeams {
    red: number[];
    blue: number[];
}

interface AllianceScores {
    redScored: number;
    redMissed: number;
    team: number;
    match: number;
    teams: TeamPickupCollection;
}

interface BlueAllianceScores {
    blueScored: number;
    blueMissed: number;
    team: number;
    match: number;
    teams: TeamPickupCollection;
}

interface Scores {
    red: AllianceScores;
    blue: BlueAllianceScores;
}

export default function HumanPlayerMain({ setMatchState }: { setMatchState: Function }) {
    const [match, setMatch] = useState<string>("");
    const [redTeam, setRedTeam] = useState<string>("");
    const [blueTeam, setBlueTeam] = useState<string>("");
    const [matchTeams, setMatchTeams] = useState<MatchTeams | null>(null);
    const [alliance, setAlliance] = useState<string>("red"); // Use the strict type

    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [scores, setScores] = useState<Scores>({
        red: { 
            redScored: 0, 
            redMissed: 0, 
            team: 0, 
            match: 0,
            teams: {} 
        },
        blue: { 
            blueScored: 0, 
            blueMissed: 0, 
            team: 0, 
            match: 0, 
            teams: {} 
        }
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
                    redMissed: scores.red.redMissed,
                    teams: scores.red.teams
                },
                blue: {
                    team: parseInt(blueTeam || "0"),
                    match: parseInt(match),
                    blueScored: scores.blue.blueScored,
                    blueMissed: scores.blue.blueMissed,
                    teams: scores.blue.teams
                }
            });
            handleExit();
        } catch (error) {
            alert("Error submitting data. Please try again.");
            console.error(error);
        }
    };

    const handleBlueScored = (team: string) => {
        setScores(prev => {
            // Create a copy of the current team data or initialize if it doesn't exist
            const teamData = (prev.blue.teams[team] || { scored: 0, missed: 0 });
            
            // Update the team's data
            const updatedTeamData = {
                ...teamData,
                scored: teamData.scored + 1
            };
            
            // Update the entire state
            return {
                ...prev,
                blue: {
                    ...prev.blue,
                    blueScored: prev.blue.blueScored + 1,
                    teams: {
                        ...prev.blue.teams,
                        [team]: updatedTeamData
                    }
                }
            };
        });
        setFeedbackMessage(`Team ${team} (Blue) picked up!`);
    };

    const handleRedScored = (team: string) => {
        setScores(prev => {
            // Create a copy of the current team data or initialize if it doesn't exist
            const teamData = (prev.red.teams[team] || { scored: 0, missed: 0 });
            
            // Update the team's data
            const updatedTeamData = {
                ...teamData,
                scored: teamData.scored + 1
            };
            
            // Update the entire state
            return {
                ...prev,
                red: {
                    ...prev.red,
                    redScored: prev.red.redScored + 1,
                    teams: {
                        ...prev.red.teams,
                        [team]: updatedTeamData
                    }
                }
            };
        });
        setFeedbackMessage(`Team ${team} (Red) picked up!`);
    };

    const handleBlueMissed = (team: string) => {
        setScores(prev => {
            // Create a copy of the current team data or initialize if it doesn't exist
            const teamData = (prev.blue.teams[team] || { scored: 0, missed: 0 });
            
            // Update the team's data
            const updatedTeamData = {
                ...teamData,
                missed: teamData.missed + 1
            };
            
            // Update the entire state
            return {
                ...prev,
                blue: {
                    ...prev.blue,
                    blueMissed: prev.blue.blueMissed + 1,
                    teams: {
                        ...prev.blue.teams,
                        [team]: updatedTeamData
                    }
                }
            };
        });
        setFeedbackMessage(`Team ${team} (Blue) missed!`);
    };

    const handleRedMissed = (team: string) => {
        setScores(prev => {
            // Create a copy of the current team data or initialize if it doesn't exist
            const teamData = (prev.red.teams[team] || { scored: 0, missed: 0 });
            
            // Update the team's data
            const updatedTeamData = {
                ...teamData,
                missed: teamData.missed + 1
            };
            
            // Update the entire state
            return {
                ...prev,
                red: {
                    ...prev.red,
                    redMissed: prev.red.redMissed + 1,
                    teams: {
                        ...prev.red.teams,
                        [team]: updatedTeamData
                    }
                }
            };
        });
        setFeedbackMessage(`Team ${team} (Red) missed!`);
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
                            key={`${team}-scored`}
                            className="flex items-center justify-center h-40 text-3xl font-bold bg-green-500 hover:bg-green-400 text-white text-center cursor-pointer rounded-lg"
                            onClick={() => handleBlueScored(team.toString())}
                        >
                            {team} Pickup
                        </div>
                        <div
                            key={`${team}-missed`}
                            className="flex items-center justify-center h-40 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-center cursor-pointer rounded-lg"
                            onClick={() => handleBlueMissed(team.toString())}
                        >
                            {team} Missed
                        </div>
                    </>
                ))}
                {alliance == "red" && matchTeams?.red && matchTeams.red.map((team) => (
                    <>
                        <div
                            key={`${team}-scored`}
                            className="flex items-center justify-center h-40 text-3xl font-bold bg-green-500 hover:bg-green-400 text-white text-center cursor-pointer rounded-lg"
                            onClick={() => handleRedScored(team.toString())}
                        >
                            {team} Pickup
                        </div>
                        <div
                            key={`${team}-missed`}
                            className="flex items-center justify-center h-40 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-center cursor-pointer rounded-lg"
                            onClick={() => handleRedMissed(team.toString())}
                        >
                            {team} Missed
                        </div>
                    </>
                ))}
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

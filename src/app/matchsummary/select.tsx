"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApi, key, qualificationMatches } from "@/app/globalVars"

export default function MatchSelect({ onMatchSelect }: { onMatchSelect: (match: string) => void }) {
    const [matches, setMatches] = useState<any[]>([])
    const [matchNumber, setMatchNumber] = useState("")

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
                    );
                } catch (err) {
                    console.error("Error fetching matches:", err);
                    setMatches([]);
                }
            } else {
                // For non-API scenario, use matches from globalVars
                const formattedMatches = qualificationMatches.map(matchNum => ({
                    match_number: parseInt(matchNum),
                    comp_level: "qm"
                }));
                setMatches(formattedMatches);
            }
        };

        fetchMatches();
    }, [useApi]);

    const handleMatchNumberChange = (value: string) => {
        setMatchNumber(value);
        onMatchSelect(value);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Match Summary</h2>
            <Select onValueChange={handleMatchNumberChange}>
                <SelectTrigger className="w-[200px] bg-gray-600 text-white">
                    <SelectValue placeholder="Select Match" />
                </SelectTrigger>
                <SelectContent className="bg-gray-600 text-white">
                    {matches
                        .sort((a, b) => a.match_number - b.match_number)
                        .map((match) => (
                            <SelectItem 
                                key={match.match_number} 
                                value={String(match.match_number)}
                                className="text-white"
                            >
                                Match {match.match_number}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
        </div>
    );
}
"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApi, key } from "@/app/globalVars"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MatchSelectProps {
    onMatchSelect: (match: string) => void
}

export default function MatchSelect({ onMatchSelect }: MatchSelectProps) {
    const [qualMatches, setQualMatches] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<string>("qualification")

    // Define playoff matches with their Firebase IDs
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

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true)
            try {
                if (useApi) {
                    // Fetch from TBA API
                    const response = await fetch(
                        `https://www.thebluealliance.com/api/v3/event/${key}/matches/simple`,
                        {
                            method: "GET",
                            headers: {
                                "X-TBA-Auth-Key": "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO",
                            },
                        }
                    )
                    
                    if (response.ok) {
                        const data = await response.json()
                        // Filter for qualification matches
                        const qualMatches = data
                            .filter((match: any) => match.comp_level === "qm")
                            .sort((a: any, b: any) => a.match_number - b.match_number)
                        
                        setQualMatches(qualMatches)
                    }
                } else {
                    // Use hardcoded match numbers from 1-100
                    const dummyMatches = Array.from({ length: 100 }, (_, i) => ({
                        match_number: i + 1,
                        comp_level: "qm"
                    }))
                    setQualMatches(dummyMatches)
                }
            } catch (error) {
                console.error("Error fetching matches:", error)
                // Fallback to dummy data
                const dummyMatches = Array.from({ length: 100 }, (_, i) => ({
                    match_number: i + 1,
                    comp_level: "qm"
                }))
                setQualMatches(dummyMatches)
            } finally {
                setLoading(false)
            }
        }

        fetchMatches()
    }, [])

    const handleMatchSelect = (match: string) => {
        onMatchSelect(match)
    }

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Select Match</h2>
            
            <Tabs defaultValue="qualification" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="qualification">Qualification</TabsTrigger>
                    <TabsTrigger value="playoff">Playoff</TabsTrigger>
                </TabsList>
                
                <TabsContent value="qualification">
                    <Select onValueChange={handleMatchSelect} disabled={loading}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={loading ? "Loading..." : "Select Qualification Match"} />
                        </SelectTrigger>
                        <SelectContent>
                            {qualMatches.map((match) => (
                                <SelectItem key={match.match_number} value={String(match.match_number)}>
                                    Match {match.match_number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </TabsContent>
                
                <TabsContent value="playoff">
                    <Select onValueChange={handleMatchSelect}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Playoff Match" />
                        </SelectTrigger>
                        <SelectContent>
                            {playoffMatches.map((match) => (
                                <SelectItem key={match.id} value={match.id}>
                                    {match.display}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </TabsContent>
            </Tabs>
        </div>
    )
}
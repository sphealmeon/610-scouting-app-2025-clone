"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApi, key } from "@/app/globalVars"

interface MatchSelectProps {
    onMatchSelect: (match: string) => void
}

export default function MatchSelect({ onMatchSelect }: MatchSelectProps) {
    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)

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
                        
                        setMatches(qualMatches)
                    }
                } else {
                    // Use hardcoded match numbers from 1-100
                    const dummyMatches = Array.from({ length: 100 }, (_, i) => ({
                        match_number: i + 1,
                        comp_level: "qm"
                    }))
                    setMatches(dummyMatches)
                }
            } catch (error) {
                console.error("Error fetching matches:", error)
                // Fallback to dummy data
                const dummyMatches = Array.from({ length: 100 }, (_, i) => ({
                    match_number: i + 1,
                    comp_level: "qm"
                }))
                setMatches(dummyMatches)
            } finally {
                setLoading(false)
            }
        }

        fetchMatches()
    }, [])

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Select Match</h2>
            <Select onValueChange={onMatchSelect} disabled={loading}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={loading ? "Loading..." : "Select Match"} />
                </SelectTrigger>
                <SelectContent>
                    {matches.map((match) => (
                        <SelectItem key={match.match_number} value={String(match.match_number)}>
                            Match {match.match_number}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
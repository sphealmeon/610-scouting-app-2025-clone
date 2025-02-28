"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useState, useEffect } from "react"

interface TeamSelectProps {
    onTeamSelect: (match: string) => void;
}

export default function MatchSelect({ onTeamSelect }: TeamSelectProps) {
    const [matches, setMatches] = useState<string[]>([])

    useEffect(() => {
        const fetchMatches = async () => {
            const matchesRef = collection(db, "matches")
            const querySnapshot = await getDocs(matchesRef)
            const uniqueMatches = [...new Set(querySnapshot.docs.map(doc => doc.data().start.match))]
            setMatches(uniqueMatches.sort((a, b) => a - b).map(String))
        }
        fetchMatches()
    }, [])

    return (
        <div className="p-4">
            <label className="block mb-2 bold text-2xl">Select a match</label>
            <Select onValueChange={onTeamSelect}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select match..." />
                </SelectTrigger>
                <SelectContent>
                    {matches.map((match) => (
                        <SelectItem key={match} value={match}>
                            Match {match}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
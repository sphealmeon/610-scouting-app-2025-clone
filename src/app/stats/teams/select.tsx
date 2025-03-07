"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useState, useEffect } from "react"

interface TeamSelectProps {
    onTeamSelect: (team: string) => void;
}

export default function TeamSelect({ onTeamSelect }: TeamSelectProps) {
    const [teams, setTeams] = useState<string[]>([])

    useEffect(() => {
        const fetchTeams = async () => {
            const matchesRef = collection(db, "matches")
            const querySnapshot = await getDocs(matchesRef)
            const uniqueTeams = [...new Set(querySnapshot.docs.map(doc => doc.data().start.team))]
            setTeams(uniqueTeams.sort((a, b) => a - b).map(String))
        }
        fetchTeams()
    }, [])

    return (
        <div className="p-4">
            <label className="block mb-2 bold text-2xl">Select a team</label>
            <Select onValueChange={onTeamSelect}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select team..." />
                </SelectTrigger>
                <SelectContent>
                    {teams.map((team) => (
                        <SelectItem key={team} value={team}>
                            Team {team}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
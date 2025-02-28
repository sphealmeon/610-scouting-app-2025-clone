"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FetchTeams } from "@/app/blueAlliance/fetchTeams"
import { useState, useEffect } from "react"

interface TeamSelectProps {
    onTeamSelect: (team: string) => void;
}

export default function TeamSelect({ onTeamSelect }: TeamSelectProps) {
    const [teams, setTeams] = useState<string[]>([])
    const [selectedTeam, setSelectedTeam] = useState<string>("")

    useEffect(() => {   
        FetchTeams({ setTeams })
    }, [])

    const handleTeamSelect = (team: string) => {
        setSelectedTeam(team)
        onTeamSelect(team)
    }

    return (
        <div className="p-4">
            <label className="block mb-2 bold text-2xl">Select a team</label>
            <Select onValueChange={handleTeamSelect} value={selectedTeam}>
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
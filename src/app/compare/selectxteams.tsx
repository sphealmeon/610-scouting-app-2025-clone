"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { TeamAggregate } from "@/app/firebase/TeamAggregate"
import { AggregateData } from "@/app/interfaces"
import { FetchTeams } from "@/app/blueAlliance/fetchTeams"

interface SelectXTeamsProps {
    onTeamsDataChange: (data: { [key: string]: AggregateData }) => void;
}

export default function SelectXTeams({ onTeamsDataChange }: SelectXTeamsProps) {
    const [teams, setTeams] = useState<string[]>([])
    const [selectors, setSelectors] = useState<number[]>([0]) // Array of selector IDs
    const [selectedTeams, setSelectedTeams] = useState<{ [key: number]: string }>({}) // Map of selector ID to selected team

    useEffect(() => {
        FetchTeams({ setTeams })
    }, [])

    const addSelector = () => {
        // Get the next ID by finding the maximum and adding 1, or use 0 if array is empty
        const nextId = selectors.length > 0 ? Math.max(...selectors) + 1 : 0
        setSelectors([...selectors, nextId])
    }

    const removeSelector = (id: number) => {
        setSelectors(selectors.filter(s => s !== id))
        const newSelectedTeams = { ...selectedTeams }
        // Deletes property of the id (which would be the team #)
        delete newSelectedTeams[id]
        setSelectedTeams(newSelectedTeams)
        updateTeamsData(newSelectedTeams)
    }

    const handleTeamSelect = async (team: string, selectorId: number) => {
        const newSelectedTeams = { ...selectedTeams, [selectorId]: team }
        setSelectedTeams(newSelectedTeams)
        updateTeamsData(newSelectedTeams)
    }

    const updateTeamsData = async (selections: { [key: number]: string }) => {
        const newTeamsData: { [key: string]: AggregateData } = {}
        for (const team of Object.values(selections)) {
            const data = await TeamAggregate({ team: parseInt(team) })
            if (data) newTeamsData[team] = data
        }
        onTeamsDataChange(newTeamsData)
    }

    return (
        <div className="space-y-4">
            {selectors.map((id) => (
                <div key={id} className="flex items-center gap-2">
                    <Select onValueChange={(value) => handleTeamSelect(value, id)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent>
                            {teams.map((team) => (
                                <SelectItem key={team} value={team}>
                                    Team {team}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => removeSelector(id)}
                    >
                        ×
                    </Button>
                </div>
            ))}
            
            <Button 
                variant="outline" 
                onClick={addSelector}
                className="mt-2"
            >
                Add Team
            </Button>
        </div>
    )
}

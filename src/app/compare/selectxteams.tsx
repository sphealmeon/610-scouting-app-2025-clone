"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { FetchTeams } from "../blueAlliance/fetchTeams"
import { TeamAggregate } from "../firebase/TeamAggregate"
import { AggregateData } from "../interfaces"

export default function SelectXTeams({ onTeamsDataChange }: { onTeamsDataChange: (data: { [key: string]: AggregateData }) => void }) {
    const [allTeams, setAllTeams] = useState<string[]>([])
    const [selectedTeams, setSelectedTeams] = useState<string[]>([])
    const [teamsData, setTeamsData] = useState<{ [key: string]: AggregateData }>({})
    
    // Fetch teams on component mount
    useEffect(() => {
        FetchTeams({ setTeams: setAllTeams })
    }, [])

    // Fetch team data when selections change
    useEffect(() => {
        const fetchTeamData = async () => {
            const newTeamsData: { [key: string]: AggregateData } = {}
            for (const team of selectedTeams) {
                const data = await TeamAggregate({ team: parseInt(team) })
                if (data) {
                    newTeamsData[team] = data
                }
            }
            setTeamsData(newTeamsData)
            onTeamsDataChange(newTeamsData)
            console.log("Teams data updated:", newTeamsData)
        }

        if (selectedTeams.length > 0) {
            fetchTeamData()
        } else {
            setTeamsData({})
            onTeamsDataChange({})
        }
    }, [selectedTeams, onTeamsDataChange])

    // Handle team selection
    const handleTeamSelect = (value: string, index: number) => {
        const newSelectedTeams = [...selectedTeams]
        newSelectedTeams[index] = value
        // Remove any selections after the current index to maintain consistency
        newSelectedTeams.length = index + 1
        setSelectedTeams(newSelectedTeams)
        
        console.log("Selected teams:", newSelectedTeams)
        // TODO: Add aggregateData logging here once implemented
    }

    // Get available teams for each select
    const getAvailableTeams = (index: number) => {
        return allTeams.filter(team => !selectedTeams.slice(0, index).includes(team))
    }

    return (
        <div className="flex flex-col gap-4">
            {/* First select */}
            <Select 
                value={selectedTeams[0]}
                onValueChange={(value) => handleTeamSelect(value, 0)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                    {allTeams.map((team) => (
                        <SelectItem key={team} value={team}>
                            Team {team}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Additional selects */}
            {selectedTeams.map((selectedTeam, index) => (
                index < selectedTeams.length && index > 0 ? (
                    <Select 
                        key={index}
                        value={selectedTeams[index]}
                        onValueChange={(value) => handleTeamSelect(value, index)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                            {getAvailableTeams(index).map((team) => (
                                <SelectItem key={team} value={team}>
                                    Team {team}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : null
            ))}

            {/* Additional select for new selection */}
            {selectedTeams.length > 0 && selectedTeams[selectedTeams.length - 1] && (
                <Select 
                    value={selectedTeams[selectedTeams.length]}
                    onValueChange={(value) => handleTeamSelect(value, selectedTeams.length)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                        {getAvailableTeams(selectedTeams.length).map((team) => (
                            <SelectItem key={team} value={team}>
                                Team {team}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}

"use client"

import { useState } from "react"
import TeamSelect from "./select"
import { TeamMatchesData } from "../firebase/teamMatchesData"
import PitScoutCategories from "./categories"
import { MainHeader } from "@/components/MainHeader"

export default function PitScout() {
    const [selectedTeam, setSelectedTeam] = useState<string>("")
    const [matchData, setMatchData] = useState<any[]>([])

    const handleTeamSelect = async (team: string) => {
        setSelectedTeam(team)
        if (team) {
            const matches = await TeamMatchesData({ team: parseInt(team) })
            // Filter out match 0 and undefined matches
            const validMatches = matches.filter(match => 
                match !== undefined && 
                match.start?.match !== undefined && 
                match.start.match !== 0
            )
            setMatchData(validMatches)
        }
    }

    return (
        <div>
            <MainHeader/>
            <div className="flex flex-col items-center p-4 min-h-screen">
                <div className="w-full max-w-md">
                    <TeamSelect onTeamSelect={handleTeamSelect} />
                </div>
                
                {selectedTeam ? (
                    <div className="w-full mt-8">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Pit Scouting for Team {selectedTeam}
                        </h2>
                        <PitScoutCategories teamNumber={selectedTeam} />
                    </div>
                ) : (
                    <div className="mt-8 text-center text-gray-400">
                        Please select a team to begin pit scouting
                    </div>
                )}
            </div>
        </div>
    )
}
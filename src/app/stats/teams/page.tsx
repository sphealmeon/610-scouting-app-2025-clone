"use client"

import TeamSelect from "./select"
import { DataTable } from "./teamtable"
import { MatchTable } from "./matchtable"
import { StartPos } from "./startpos"
import { useState } from "react"
import { TeamMatchesData } from "@/app/firebase/teamMatchesData"
import { MainHeader } from "@/components/MainHeader"

export default function Home() {
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
        <>
        <MainHeader />
        <div className="container mx-auto py-10">
            <TeamSelect onTeamSelect={handleTeamSelect} />
            {selectedTeam && (
                <div className="space-y-8">
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold mb-4">Team Summary</h2>
                        <DataTable teams={[parseInt(selectedTeam)]} />
                    </div>
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold mb-4">Match History</h2>
                        <MatchTable team={parseInt(selectedTeam)} />
                    </div>
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold mb-4">Starting Positions</h2>
                        <StartPos matches={matchData} />
                    </div>
                </div>
            )}
        </div>
        </>
    )
}
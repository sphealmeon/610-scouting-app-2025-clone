"use client"

import { useState } from "react"
import { MainHeader } from "@/components/MainHeader"
import MatchSelect from "./select"
import { DataTable } from "./teamtable"
import { MatchTable } from "./matchtable"
import { TeamMatchesData } from "@/app/firebase/teamMatchesData"
import { useApi, key } from "@/app/globalVars"

export default function MatchSummaryPage() {
    const [selectedMatch, setSelectedMatch] = useState<string>("")
    const [matchData, setMatchData] = useState<any[]>([])
    const [teams, setTeams] = useState<number[]>([])

    const handleMatchSelect = async (match: string) => {
        setSelectedMatch(match)
        const matchNumber = parseInt(match)

        if (useApi) {
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
            const data = await request.json()
            const allTeams = [
                ...data.alliances.red.team_keys,
                ...data.alliances.blue.team_keys
            ].map(team => parseInt(team.replace('frc', '')))
            
            setTeams(allTeams)

            // Get match data for all teams
            const allMatchData = []
            for (const team of allTeams) {
                const teamMatches = await TeamMatchesData({ team })
                const matchData = teamMatches.find(m => m?.start?.match === matchNumber)
                if (matchData) {
                    allMatchData.push(matchData)
                }
            }
            setMatchData(allMatchData)
        }
    }

    return (
        <>
            <MainHeader />
            <div className="container mx-auto py-10">
                <MatchSelect onTeamSelect={handleMatchSelect} />
                {selectedMatch && (
                    <div className="space-y-8">
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mb-4">Teams Summary</h2>
                            <DataTable teams={teams} />
                        </div>
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mb-4">Match Details</h2>
                            {teams.map(team => (
                                <MatchTable key={team} team={team} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
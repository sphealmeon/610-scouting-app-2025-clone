"use client"

import { useState } from "react"
import { MainHeader } from "@/components/MainHeader"
import MatchSelect from "./select"
import { MatchTable } from "./matchtable"
import { TeamStatsTable } from "./teamstatstable"
import { db } from "@/app/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useApi, key, teams } from "@/app/globalVars"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MatchSummaryPage() {
    const [selectedMatch, setSelectedMatch] = useState<string>("")
    const [matchData, setMatchData] = useState<any[]>([])
    const [redTeams, setRedTeams] = useState<number[]>([])
    const [blueTeams, setBlueTeams] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activeTab, setActiveTab] = useState<string>("match-data")

    const handleMatchSelect = async (match: string) => {
        setSelectedMatch(match)
        setError("")
        setLoading(true)
        setMatchData([])
        setRedTeams([])
        setBlueTeams([])
        
        try {
            // First get teams from TBA API
            if (useApi) {
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
                    const matches = await response.json()
                    const selectedMatch = matches.find((m: any) => 
                        m.comp_level === "qm" && m.match_number === parseInt(match)
                    )
                    
                    if (selectedMatch) {
                        const redTeamNumbers = selectedMatch.alliances.red.team_keys.map((team: string) => 
                            parseInt(team.replace("frc", ""))
                        )
                        const blueTeamNumbers = selectedMatch.alliances.blue.team_keys.map((team: string) => 
                            parseInt(team.replace("frc", ""))
                        )
                        
                        setRedTeams(redTeamNumbers)
                        setBlueTeams(blueTeamNumbers)

                        // Now fetch match data for each team
                        const allMatchData = []
                        const allTeams = [...redTeamNumbers, ...blueTeamNumbers]

                        for (const team of allTeams) {
                            // Get match data using the same pattern as submitMatch.ts
                            const matchDoc = doc(db, team.toString(), match)
                            const matchSnapshot = await getDoc(matchDoc)
                            
                            if (matchSnapshot.exists()) {
                                const data = matchSnapshot.data()
                                if (data.matchData) {
                                    // Add team and alliance info to the match data
                                    const alliance = redTeamNumbers.includes(team) ? 'red' : 'blue'
                                    allMatchData.push({
                                        ...data.matchData,
                                        start: {
                                            ...data.matchData.start,
                                            team,
                                            alliance,
                                            match: parseInt(match)
                                        }
                                    })
                                }
                            }
                        }

                        console.log("Match data found:", allMatchData)
                        setMatchData(allMatchData)
                    }
                } else {
                    // Try to find match data for all teams
                    const allMatchData: any[] = []
                    const redTeamsFound: number[] = []
                    const blueTeamsFound: number[] = []

                    // Try all possible teams for this match
                    for (const team of teams) {
                        const teamNum = parseInt(team)
                        const matchDoc = doc(db, team, match)
                        const matchSnapshot = await getDoc(matchDoc)
                        
                        if (matchSnapshot.exists()) {
                            const data = matchSnapshot.data()
                            if (data.matchData) {
                                // Get alliance from the match data
                                const alliance = data.matchData.start?.alliance || ''
                                
                                // Add team to appropriate alliance array
                                if (alliance === 'red') {
                                    redTeamsFound.push(teamNum)
                                } else if (alliance === 'blue') {
                                    blueTeamsFound.push(teamNum)
                                }

                                // Add the match data
                                allMatchData.push({
                                    ...data.matchData,
                                    start: {
                                        ...data.matchData.start,
                                        team: teamNum,
                                        alliance,
                                        match: parseInt(match)
                                    }
                                })
                            }
                        }
                    }

                    // If we found any data, update the state
                    if (allMatchData.length > 0) {
                        console.log("Match data found:", allMatchData)
                        setMatchData(allMatchData)
                        setRedTeams(redTeamsFound)
                        setBlueTeams(blueTeamsFound)
                    } else {
                        setError("No data found for this match")
                    }
                }
            }
            
        } catch (error) {
            console.error("Error in handleMatchSelect:", error)
            setError("An error occurred while fetching match data")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <MainHeader />
            <div className="container mx-auto py-10">
                <MatchSelect onMatchSelect={handleMatchSelect} />
                
                {loading && (
                    <div className="text-center py-10">
                        <p className="text-lg">Loading match data...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-10">
                        <p className="text-lg text-red-500">{error}</p>
                    </div>
                )}
                
                {selectedMatch && !loading && !error && (
                    <div className="space-y-8">
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mb-4">Match {selectedMatch} Details</h2>
                            
                            <Tabs defaultValue="match-data" onValueChange={setActiveTab}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="match-data">Match Data</TabsTrigger>
                                    <TabsTrigger value="team-stats">Team Stats</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="match-data">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-red-500">Red Alliance</h3>
                                            <MatchTable 
                                                matchData={matchData.filter(data => data.start?.alliance === 'red')} 
                                                teams={redTeams}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-blue-500">Blue Alliance</h3>
                                            <MatchTable 
                                                matchData={matchData.filter(data => data.start?.alliance === 'blue')} 
                                                teams={blueTeams}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="team-stats">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-red-500">Red Alliance</h3>
                                            <TeamStatsTable teams={redTeams} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-blue-500">Blue Alliance</h3>
                                            <TeamStatsTable teams={blueTeams} />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

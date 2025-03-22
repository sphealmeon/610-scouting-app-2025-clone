"use client"

import { useState, useEffect } from "react"
import { db } from "@/app/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import { teams } from "@/app/globalVars"
import { MatchTable } from "./matchtable"
import { TeamStatsTable } from "./teamstatstable"
import RadarChart from "@/app/compare/radarchart"
import { AggregateData } from "../interfaces"
import { TeamAggregate } from "@/app/firebase/TeamAggregate"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlayoffMatchProps {
    matchId: string
    matchDisplay: string
}

export default function PlayoffMatch({ matchId, matchDisplay }: PlayoffMatchProps) {
    const [matchData, setMatchData] = useState<any[]>([])
    const [redTeams, setRedTeams] = useState<number[]>([])
    const [blueTeams, setBlueTeams] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [activeTab, setActiveTab] = useState<string>("match-data")
    const [redTeamsData, setRedTeamsData] = useState<{ [key: string]: AggregateData }>({})
    const [blueTeamsData, setBlueTeamsData] = useState<{ [key: string]: AggregateData }>({})

    // Add a console log to check the teams array
    console.log("Teams from globalVars in playoffmatch.tsx:", teams);

    useEffect(() => {
        const fetchPlayoffMatchData = async () => {
            if (!matchId) return
            
            console.log("Fetching playoff match data for matchId:", matchId)
            console.log("Teams array length:", teams.length)
            
            if (teams.length === 0) {
                setError("No teams found in the teams array")
                setLoading(false)
                return
            }
            
            setLoading(true)
            setError("")
            setMatchData([])
            setRedTeams([])
            setBlueTeams([])
            
            try {
                // Search through all teams for this playoff match
                const allMatchData: any[] = []
                const redTeamsFound: number[] = []
                const blueTeamsFound: number[] = []

                // Try all possible teams for this match
                console.log("Searching through teams:", teams)
                for (const team of teams) {
                    const teamNum = parseInt(team)
                    const matchDoc = doc(db, team, matchId)
                    console.log(`Checking team ${team} for match ${matchId}`)
                    const matchSnapshot = await getDoc(matchDoc)
                    
                    if (matchSnapshot.exists()) {
                        console.log(`Found data for team ${team} in match ${matchId}:`, matchSnapshot.data())
                        const data = matchSnapshot.data()
                        if (data.matchData) {
                            // Get alliance from the match data
                            const alliance = data.matchData.start?.alliance || ''
                            console.log(`Team ${team} is on alliance: ${alliance}`)
                            
                            // Add team to appropriate alliance array
                            if (alliance === 'red') {
                                redTeamsFound.push(teamNum)
                            } else if (alliance === 'blue') {
                                blueTeamsFound.push(teamNum)
                            }

                            // Add the match data with the display name
                            allMatchData.push({
                                ...data.matchData,
                                start: {
                                    ...data.matchData.start,
                                    team: teamNum,
                                    alliance,
                                    match: matchDisplay // Use the display name
                                }
                            })
                        }
                    } else {
                        console.log(`No data found for team ${team} in match ${matchId}`)
                    }
                }

                // If we found any data, update the state
                console.log("All match data found:", allMatchData)
                console.log("Red teams found:", redTeamsFound)
                console.log("Blue teams found:", blueTeamsFound)
                
                if (allMatchData.length > 0) {
                    console.log("Playoff match data found:", allMatchData)
                    setMatchData(allMatchData)
                    setRedTeams(redTeamsFound)
                    setBlueTeams(blueTeamsFound)
                } else {
                    console.error("No data found for this playoff match")
                    setError("No data found for this playoff match")
                }
            } catch (error) {
                console.error("Error fetching playoff match data:", error)
                setError("An error occurred while fetching playoff match data")
            } finally {
                setLoading(false)
            }
        }

        fetchPlayoffMatchData()
    }, [matchId, matchDisplay])

    // Fetch team aggregate data when teams change
    useEffect(() => {
        const fetchTeamData = async () => {
            const newRedTeamsData: { [key: string]: AggregateData } = {}
            const newBlueTeamsData: { [key: string]: AggregateData } = {}
            
            // Fetch data for red teams
            for (const team of redTeams) {
                const data = await TeamAggregate({ team })
                if (data) {
                    newRedTeamsData[team.toString()] = data
                }
            }
            
            // Fetch data for blue teams
            for (const team of blueTeams) {
                const data = await TeamAggregate({ team })
                if (data) {
                    newBlueTeamsData[team.toString()] = data
                }
            }
            
            setRedTeamsData(newRedTeamsData)
            setBlueTeamsData(newBlueTeamsData)
        }
        
        if (redTeams.length > 0 || blueTeams.length > 0) {
            fetchTeamData()
        }
    }, [redTeams, blueTeams])

    const aggregateAllianceData = (teamsData: { [key: string]: AggregateData }) => {
        const aggregatedData: AggregateData = {
            team: 0,
            standing: 0,
            matchAggregateData: {} as any, // Assuming matchAggregateData is an object
            matchesPlayed: 0,
            autoPPG: 0,
            teleopPPG: 0,
            coralCyclesScored: 0,
            algaeCyclesScored: 0,
            autoL1Accuracy: 0,
            autoL2Accuracy: 0,
            autoL3Accuracy: 0,
            autoL4Accuracy: 0,
            teleopL1Accuracy: 0,
            teleopL2Accuracy: 0,
            teleopL3Accuracy: 0,
            teleopL4Accuracy: 0,
            teleopBargeAccuracy: 0,
            teleopProcessorAccuracy: 0,
            shallowAccuracy: 0,
            deepAccuracy: 0,
            endgamePPG: 0,
            brokePercentage: 0,
            avgFouls: 0,
            playedDefenseMatches: 0,
            coralAverageScoringTime: 0,
            processorAverageScoringTime: 0,
            bargeAverageScoringTime: 0,
            shallowAverageHangTime: 0,
            deepAverageHangTime: 0
        }

        for (const teamData of Object.values(teamsData)) {
            aggregatedData.matchesPlayed += teamData.matchesPlayed
            aggregatedData.autoPPG += teamData.autoPPG
            aggregatedData.teleopPPG += teamData.teleopPPG
            aggregatedData.coralCyclesScored += teamData.coralCyclesScored
            aggregatedData.algaeCyclesScored += teamData.algaeCyclesScored
            aggregatedData.autoL1Accuracy += teamData.autoL1Accuracy
            aggregatedData.autoL2Accuracy += teamData.autoL2Accuracy
            aggregatedData.autoL3Accuracy += teamData.autoL3Accuracy
            aggregatedData.autoL4Accuracy += teamData.autoL4Accuracy
            aggregatedData.teleopL1Accuracy += teamData.teleopL1Accuracy
            aggregatedData.teleopL2Accuracy += teamData.teleopL2Accuracy
            aggregatedData.teleopL3Accuracy += teamData.teleopL3Accuracy
            aggregatedData.teleopL4Accuracy += teamData.teleopL4Accuracy
            aggregatedData.teleopBargeAccuracy += teamData.teleopBargeAccuracy
            aggregatedData.teleopProcessorAccuracy += teamData.teleopProcessorAccuracy
            aggregatedData.shallowAccuracy += teamData.shallowAccuracy
            aggregatedData.deepAccuracy += teamData.deepAccuracy
            aggregatedData.endgamePPG += teamData.endgamePPG
            aggregatedData.brokePercentage += teamData.brokePercentage
            aggregatedData.avgFouls += teamData.avgFouls
            aggregatedData.playedDefenseMatches += teamData.playedDefenseMatches
        }

        return aggregatedData
    }

    const redAllianceData = aggregateAllianceData(redTeamsData)
    const blueAllianceData = aggregateAllianceData(blueTeamsData)

    if (loading) {
        return (
            <div className="text-center py-10">
                <p className="text-lg">Loading playoff match data...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="mt-4">
                <h2 className="text-2xl font-bold mb-4">{matchDisplay} Details</h2>
                
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
                        <div className="mt-4">
                            <h3 className="text-xl font-bold mb-2 text-center">Alliance Comparison</h3>
                            <RadarChart 
                                teamsData={{
                                    red: redAllianceData,
                                    blue: blueAllianceData
                                }} 
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 
"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/MainHeader"
import MatchSelect from "./select"
import { MatchTable } from "./matchtable"
import { TeamStatsTable } from "./teamstatstable"
import { db } from "@/app/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useApi, key, teams } from "@/app/globalVars"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RadarChart from "@/app/compare/radarchart"
import { AggregateData } from "../interfaces"
import { TeamAggregate } from "@/app/firebase/TeamAggregate"
import PlayoffMatch from "./playoffmatch"

export default function MatchSummaryPage() {
    const [selectedMatch, setSelectedMatch] = useState<string>("")
    const [matchData, setMatchData] = useState<any[]>([])
    const [redTeams, setRedTeams] = useState<number[]>([])
    const [blueTeams, setBlueTeams] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activeTab, setActiveTab] = useState<string>("match-data")
    const [redTeamsData, setRedTeamsData] = useState<{ [key: string]: AggregateData }>({})
    const [blueTeamsData, setBlueTeamsData] = useState<{ [key: string]: AggregateData }>({})
    const [isPlayoff, setIsPlayoff] = useState<boolean>(false)
    const [playoffMatchDisplay, setPlayoffMatchDisplay] = useState<string>("")

    const handleMatchSelect = async (match: string) => {
        setSelectedMatch(match)
        
        const isPlayoffMatch = parseInt(match) >= 1000
        setIsPlayoff(isPlayoffMatch)
        
        if (isPlayoffMatch) {
            setPlayoffMatchDisplay(`Playoff Match ${match}`)
            return
        }
        
        setError("")
        setLoading(true)
        setMatchData([])
        setRedTeams([])
        setBlueTeams([])
        
        try {
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

                        const allMatchData = []
                        const allTeams = [...redTeamNumbers, ...blueTeamNumbers]

                        for (const team of allTeams) {
                            const matchDoc = doc(db, team.toString(), match)
                            const matchSnapshot = await getDoc(matchDoc)
                            
                            if (matchSnapshot.exists()) {
                                const data = matchSnapshot.data()
                                if (data.matchData) {
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

                        setMatchData(allMatchData)
                    }
                } else {
                    const allMatchData: any[] = []
                    const redTeamsFound: number[] = []
                    const blueTeamsFound: number[] = []

                    for (const team of teams) {
                        const teamNum = parseInt(team)
                        const matchDoc = doc(db, team, match)
                        const matchSnapshot = await getDoc(matchDoc)
                        
                        if (matchSnapshot.exists()) {
                            const data = matchSnapshot.data()
                            if (data.matchData) {
                                const alliance = data.matchData.start?.alliance || ''
                                
                                if (alliance === 'red') {
                                    redTeamsFound.push(teamNum)
                                } else if (alliance === 'blue') {
                                    blueTeamsFound.push(teamNum)
                                }

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

                    if (allMatchData.length > 0) {
                        setMatchData(allMatchData)
                        setRedTeams(redTeamsFound)
                        setBlueTeams(blueTeamsFound)
                    } else {
                        setError("No data found for this match")
                    }
                }
            }
            
        } catch (error) {
            setError("An error occurred while fetching match data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchTeamData = async () => {
            const newRedTeamsData: { [key: string]: AggregateData } = {};
            const newBlueTeamsData: { [key: string]: AggregateData } = {};
            
            for (const team of redTeams) {
                const data = await TeamAggregate({ team });
                if (data) {
                    newRedTeamsData[team.toString()] = data;
                }
            }
            
            for (const team of blueTeams) {
                const data = await TeamAggregate({ team });
                if (data) {
                    newBlueTeamsData[team.toString()] = data;
                }
            }
            
            setRedTeamsData(newRedTeamsData);
            setBlueTeamsData(newBlueTeamsData);
        };
        
        if (redTeams.length > 0 || blueTeams.length > 0) {
            fetchTeamData();
        }
    }, [redTeams, blueTeams]);

    const aggregateAllianceData = (teamsData: { [key: string]: AggregateData }) => {
        const aggregatedData: AggregateData = {
            team: 0,
            standing: 0,
            matchAggregateData: {} as any,
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
            weightedBrokePercentage: 0,
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
            aggregatedData.weightedBrokePercentage += teamData.weightedBrokePercentage
            aggregatedData.playedDefenseMatches += teamData.playedDefenseMatches
        }

        return aggregatedData
    }

    const redAllianceData = aggregateAllianceData(redTeamsData)
    const blueAllianceData = aggregateAllianceData(blueTeamsData)

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
                    <>
                        {isPlayoff ? (
                            <PlayoffMatch 
                                matchId={selectedMatch} 
                                matchDisplay={playoffMatchDisplay} 
                            />
                        ) : (
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
                                                <div className="mt-4">
                                                    <h3 className="text-xl font-bold mb-2 text-center">Alliance Comparison</h3>
                                                    <RadarChart 
                                                        teamsData={{
                                                            red: redAllianceData,
                                                            blue: blueAllianceData
                                                        }} 
                                                    />
                                                </div>
                                                 <div>
                                                     <h3 className="text-xl font-bold mb-2 text-red-500">Red Alliance</h3>
                                                     <TeamStatsTable teams={redTeams} />
                                                     <h3 className="text-xl font-bold mb-2 text-blue-500">Blue Alliance</h3>
                                                     <TeamStatsTable teams={blueTeams} />
                                                    
                                                 </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

"use client"

import RadarChart from "./radarchart"
import SelectXTeams from "./selectxteams"
import { useState } from "react"
import { AggregateData } from "../interfaces"
import { MainHeader } from "@/components/MainHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ComparePage() {
    const [teamsData, setTeamsData] = useState<{ [key: string]: AggregateData }>({})

    return (
        <>
            <MainHeader />
            <div className="container mx-auto p-8">
                <h1 className="text-2xl font-bold mb-4">Compare Teams</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Team Selection */}
                    <div >
                        <SelectXTeams onTeamsDataChange={setTeamsData} />
                        {/* Aggregate Data Display */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {Object.entries(teamsData).map(([team, data]) => (
                                        <div key={team} className="p-4 border rounded-lg">
                                            <h3 className="font-bold mb-2">Team {team}</h3>
                                            <div className="space-y-1 text-sm">
                                                <p>Auto PPG: {data.autoPPG.toFixed(2)}</p>
                                                <p>Teleop PPG: {data.teleopPPG.toFixed(2)}</p>
                                                <p>Endgame PPG: {data.endgamePPG.toFixed(2)}</p>
                                                <p>Coral Cycles: {data.coralCyclesScored.toFixed(2)}</p>
                                                <p>Algae Cycles: {data.algaeCyclesScored.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    

                    {/* Right Column - Chart and Data */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Comparison</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadarChart teamsData={teamsData} />
                            </CardContent>
                        </Card>

                        
                    </div>
                </div>
            </div>
        </>
    )
}

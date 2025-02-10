"use client"

import RadarChart from "./radarchart"
import SelectXTeams from "./selectxteams"
import { useState } from "react"
import { AggregateData } from "../interfaces"

export default function ComparePage() {
    const [teamsData, setTeamsData] = useState<{ [key: string]: AggregateData }>({})

    return (
        <div className="container mx-auto p-8">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Compare Teams</h1>
                    <SelectXTeams onTeamsDataChange={setTeamsData} />
                </div>
                <div className="mt-8">
                    <RadarChart teamsData={teamsData} />
                </div>
            </div>
        </div>
    )
}

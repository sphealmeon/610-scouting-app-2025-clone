"use client"

import { useEffect, useState } from "react"
import { AggregateData } from "@/app/interfaces"
import { TeamAggregate } from "@/app/firebase/TeamAggregate"
import AllTable from "@/app/stats/all/tables/allTable"

interface TeamStatsTableProps {
    teams: number[];
}

export function TeamStatsTable({ teams }: TeamStatsTableProps) {
    const [teamStats, setTeamStats] = useState<AggregateData[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchTeamStats = async () => {
            setLoading(true)
            
            try {
                const tempTeamArr: AggregateData[] = [];
                for (const team of teams) {
                    const data = await TeamAggregate({ team });
                    if (data) tempTeamArr.push(data);
                }
                setTeamStats(tempTeamArr);
            } catch (error) {
                console.error("Error fetching team stats:", error)
                setTeamStats([])
            } finally {
                setLoading(false)
            }
        }
        
        if (teams.length > 0) {
            fetchTeamStats()
        }
    }, [teams])

    if (loading) {
        return <div>Loading team stats...</div>
    }

    return (
        <div>
            <AllTable teamData={teamStats} />
        </div>
    )
} 
"use client"

import { useState } from "react"
import { MainHeader } from "@/components/MainHeader"
import MatchSelect from "./select"
import { DataTable } from "@/app/stats/teams/teamtable"
import { MatchTable } from "./matchtable"
import { TeamMatchesData } from "@/app/firebase/teamMatchesData"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export default function MatchSummaryPage() {
    const [selectedMatch, setSelectedMatch] = useState<string>("")
    const [matchData, setMatchData] = useState<any[]>([])
    const [teams, setTeams] = useState<number[]>([])

    const handleMatchSelect = async (match: string) => {
        setSelectedMatch(match)
        const matchNumber = parseInt(match)

        try {
            // Get all data for this match from Firebase
            const matchesRef = collection(db, "matches")
            const q = query(matchesRef, where("start.match", "==", matchNumber))
            const querySnapshot = await getDocs(q)
            
            const allMatchData: any[] = []
            const allTeams = new Set<number>()

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                allMatchData.push(data)
                allTeams.add(data.start.team)
            })

            setTeams(Array.from(allTeams))
            setMatchData(allMatchData)
        } catch (error) {
            console.error("Error fetching match data:", error)
        }
    }

    return (
        <>
            <MainHeader />
            <div className="container mx-auto py-10">
                <MatchSelect onMatchSelect={handleMatchSelect} />
                {selectedMatch && (
                    <div className="space-y-8">
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mb-4">Teams Summary</h2>
                            <DataTable teams={teams} />
                        </div>
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mb-4">Match Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-red-500">Red Alliance</h3>
                                    {matchData
                                        .filter(data => data.start.alliance === 'red')
                                        .map(data => (
                                            <MatchTable key={data.start.team} matchData={data} />
                                        ))
                                    }
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-blue-500">Blue Alliance</h3>
                                    {matchData
                                        .filter(data => data.start.alliance === 'blue')
                                        .map(data => (
                                            <MatchTable key={data.start.team} matchData={data} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
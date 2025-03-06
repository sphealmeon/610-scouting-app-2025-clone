"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/MainHeader"
import MatchSelect from "./select"
import { MatchTable } from "./matchtable"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useApi, key } from "@/app/globalVars"
import { FetchTeamsInMatch } from "@/app/blueAlliance/fetchTeamsInMatch"

export default function MatchSummaryPage() {
    const [selectedMatch, setSelectedMatch] = useState<string>("")
    const [matchData, setMatchData] = useState<any[]>([])
    const [redTeams, setRedTeams] = useState<number[]>([])
    const [blueTeams, setBlueTeams] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const handleMatchSelect = async (match: string) => {
        setSelectedMatch(match)
        setError("")
        setLoading(true)
        setRedTeams([])
        setBlueTeams([])
        setMatchData([])
        
        const matchNumber = parseInt(match)
        console.log("Selected match:", matchNumber)

        try {
            // Get teams for this match using your existing function
            const teamsInMatch = await FetchTeamsInMatch(matchNumber)
            console.log("Teams in match:", teamsInMatch)
            
            if (teamsInMatch && teamsInMatch.red && teamsInMatch.blue) {
                setRedTeams(teamsInMatch.red)
                setBlueTeams(teamsInMatch.blue)
            }
            
            // Get all match data from Firebase
            const matchesRef = collection(db, "matches")
            const querySnapshot = await getDocs(matchesRef)
            
            console.log("All Firebase docs:", querySnapshot.size)
            
            // Filter for the selected match
            const allMatchData: any[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                // Check if this document is for our match
                if (data.start && data.start.match === matchNumber) {
                    console.log("Found match data for team:", data.start.team, "Alliance:", data.start.alliance)
                    allMatchData.push(data)
                }
            })
            
            console.log("Filtered match data:", allMatchData.length)
            setMatchData(allMatchData)
            
            // If we don't have teams from the API but have match data, extract teams from there
            if ((!teamsInMatch || !teamsInMatch.red || !teamsInMatch.blue) && allMatchData.length > 0) {
                const redTeamsFromData = allMatchData
                    .filter(data => data.start?.alliance === 'red')
                    .map(data => data.start.team)
                
                const blueTeamsFromData = allMatchData
                    .filter(data => data.start?.alliance === 'blue')
                    .map(data => data.start.team)
                
                if (redTeamsFromData.length > 0) setRedTeams(redTeamsFromData)
                if (blueTeamsFromData.length > 0) setBlueTeams(blueTeamsFromData)
            }
            
            // If we still don't have any data, show an error
            if (redTeams.length === 0 && blueTeams.length === 0 && allMatchData.length === 0) {
                setError("No data found for this match")
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
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-red-500">Red Alliance</h3>
                                    {matchData
                                        .filter(data => data.start?.alliance === 'red')
                                        .map(data => (
                                            <MatchTable key={data.start.team} matchData={data} />
                                        ))
                                    }
                                    {redTeams.length > 0 && redTeams.filter(team => 
                                        !matchData.some(data => 
                                            data.start?.alliance === 'red' && data.start?.team === team
                                        )
                                    ).map(team => (
                                        <div key={team} className="p-4 border rounded mb-4 bg-gray-800">
                                            <p className="text-lg font-bold">Team {team}</p>
                                            <p className="text-gray-400">No scouting data available</p>
                                        </div>
                                    ))}
                                    {redTeams.length === 0 && (
                                        <div className="p-4 border rounded mb-4 bg-gray-800">
                                            <p className="text-gray-400">No red alliance teams found</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-blue-500">Blue Alliance</h3>
                                    {matchData
                                        .filter(data => data.start?.alliance === 'blue')
                                        .map(data => (
                                            <MatchTable key={data.start.team} matchData={data} />
                                        ))
                                    }
                                    {blueTeams.length > 0 && blueTeams.filter(team => 
                                        !matchData.some(data => 
                                            data.start?.alliance === 'blue' && data.start?.team === team
                                        )
                                    ).map(team => (
                                        <div key={team} className="p-4 border rounded mb-4 bg-gray-800">
                                            <p className="text-lg font-bold">Team {team}</p>
                                            <p className="text-gray-400">No scouting data available</p>
                                        </div>
                                    ))}
                                    {blueTeams.length === 0 && (
                                        <div className="p-4 border rounded mb-4 bg-gray-800">
                                            <p className="text-gray-400">No blue alliance teams found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/MainHeader"
import MatchSelect from "./select"
import { MatchTable } from "./matchtable"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useApi, key } from "@/app/globalVars"

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
            // Get all data for this match from Firebase first
            const matchesRef = collection(db, "matches")
            const q = query(matchesRef, where("start.match", "==", matchNumber))
            console.log("Querying Firebase for match:", matchNumber, "typeof:", typeof matchNumber)
            
            const querySnapshot = await getDocs(q)
            console.log("Firebase query completed, docs:", querySnapshot.size)
            
            const allMatchData: any[] = []
            
            // If we don't get any results, try with a string version of the match number
            if (querySnapshot.size === 0) {
                console.log("Trying with string match number")
                const qString = query(matchesRef, where("start.match", "==", match))
                const querySnapshotString = await getDocs(qString)
                console.log("Firebase string query completed, docs:", querySnapshotString.size)
                
                querySnapshotString.forEach((doc) => {
                    const data = doc.data()
                    console.log("Match data for team:", data.start?.team, "Alliance:", data.start?.alliance)
                    allMatchData.push(data)
                })
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    console.log("Match data for team:", data.start?.team, "Alliance:", data.start?.alliance)
                    allMatchData.push(data)
                })
            }
            
            setMatchData(allMatchData)
            
            // Extract teams from match data
            const redTeamsFromData = allMatchData
                .filter(data => data.start?.alliance === 'red')
                .map(data => data.start.team)
            
            const blueTeamsFromData = allMatchData
                .filter(data => data.start?.alliance === 'blue')
                .map(data => data.start.team)
            
            console.log("Red teams from data:", redTeamsFromData)
            console.log("Blue teams from data:", blueTeamsFromData)
            
            // If we have teams from data, use them
            if (redTeamsFromData.length > 0 || blueTeamsFromData.length > 0) {
                setRedTeams(redTeamsFromData)
                setBlueTeams(blueTeamsFromData)
            } 
            // Otherwise try to get from TBA
            else if (useApi) {
                try {
                    console.log("Fetching from TBA API")
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
                        console.log("TBA matches:", matches.length)
                        
                        const selectedMatch = matches.find((m: any) => 
                            m.comp_level === "qm" && m.match_number === matchNumber
                        )
                        
                        if (selectedMatch) {
                            console.log("Found match in TBA data:", selectedMatch)
                            const redTeamNumbers = selectedMatch.alliances.red.team_keys.map((team: string) => 
                                parseInt(team.replace("frc", ""))
                            )
                            const blueTeamNumbers = selectedMatch.alliances.blue.team_keys.map((team: string) => 
                                parseInt(team.replace("frc", ""))
                            )
                            
                            console.log("TBA red teams:", redTeamNumbers)
                            console.log("TBA blue teams:", blueTeamNumbers)
                            
                            setRedTeams(redTeamNumbers)
                            setBlueTeams(blueTeamNumbers)
                        } else {
                            console.log("Match not found in TBA data")
                            setError("Match not found in TBA data")
                        }
                    } else {
                        console.error("TBA API error:", response.status)
                        setError("Error fetching data from TBA")
                    }
                } catch (error) {
                    console.error("Error fetching match data from TBA:", error)
                    setError("Error connecting to TBA")
                }
            }
            
            // If we still don't have teams, show an error
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
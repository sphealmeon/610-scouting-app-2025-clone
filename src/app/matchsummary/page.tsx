"use client"

import { useState } from "react"
import { MainHeader } from "@/components/MainHeader"
import MatchSelect from "./select"
import { MatchTable } from "./matchtable"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
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
            // Try to get match data from the "13" collection first
            console.log("Trying to get match data from '13' collection")
            const matchDoc = doc(db, "13", match)
            const matchSnapshot = await getDoc(matchDoc)
            
            if (matchSnapshot.exists()) {
                console.log("Found match document in '13' collection:", matchSnapshot.data())
                
                // Get all match data from the "matchData" collection
                console.log("Getting match data from 'matchData' collection")
                const matchDataRef = collection(db, "matchData")
                const matchDataSnapshot = await getDocs(matchDataRef)
                
                const allMatchData: any[] = []
                matchDataSnapshot.forEach(doc => {
                    const data = doc.data()
                    // Check if this document is for our match
                    if (data.start && String(data.start.match) === match) {
                        console.log("Found match data for team:", data.start.team)
                        allMatchData.push(data)
                    }
                })
                
                console.log(`Found ${allMatchData.length} team data entries for match ${match}`)
                setMatchData(allMatchData)
                
                // Extract teams from match data
                const redTeamsFromData = allMatchData
                    .filter(data => data.start?.alliance === 'red')
                    .map(data => data.start.team)
                
                const blueTeamsFromData = allMatchData
                    .filter(data => data.start?.alliance === 'blue')
                    .map(data => data.start.team)
                
                if (redTeamsFromData.length > 0) setRedTeams(redTeamsFromData)
                if (blueTeamsFromData.length > 0) setBlueTeams(blueTeamsFromData)
                
                // If we still don't have team data, try to get it from TBA
                if (redTeams.length === 0 || blueTeams.length === 0) {
                    if (useApi) {
                        try {
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
                                    m.comp_level === "qm" && m.match_number === matchNumber
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
                                }
                            }
                        } catch (error) {
                            console.error("Error fetching from TBA:", error)
                        }
                    }
                }
            } else {
                // If no match document in "13", try the "matches" collection
                console.log("No match document in '13' collection, trying 'matches'")
                const matchesRef = collection(db, "matches")
                const q = query(matchesRef, where("start.match", "==", matchNumber))
                const querySnapshot = await getDocs(q)
                
                if (querySnapshot.size > 0) {
                    console.log(`Found ${querySnapshot.size} documents in 'matches' collection`)
                    const allMatchData: any[] = []
                    querySnapshot.forEach(doc => {
                        allMatchData.push(doc.data())
                    })
                    
                    setMatchData(allMatchData)
                    
                    // Extract teams from match data
                    const redTeamsFromData = allMatchData
                        .filter(data => data.start?.alliance === 'red')
                        .map(data => data.start.team)
                    
                    const blueTeamsFromData = allMatchData
                        .filter(data => data.start?.alliance === 'blue')
                        .map(data => data.start.team)
                    
                    if (redTeamsFromData.length > 0) setRedTeams(redTeamsFromData)
                    if (blueTeamsFromData.length > 0) setBlueTeams(blueTeamsFromData)
                } else {
                    setError("No data found for this match. Try a different match number.")
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
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

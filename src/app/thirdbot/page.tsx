"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/MainHeader"
import { db } from "@/app/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useApi, key, teams } from "@/app/globalVars"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RadarChart from "@/app/compare/radarchart"
import { AggregateData, BrokenTeam } from "../interfaces"
import { TeamAggregate } from "@/app/firebase/TeamAggregate"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { FetchTeams } from "../blueAlliance/fetchTeams"

export default function ThirdBotPage() {
    const [teams, setTeams] = useState<string[]>([]);
    const [brokenTeams, setBrokenTeams] = useState<string[]>([]);
    const [teamBreakCounts, setTeamBreakCounts] = useState<Map<number, number>>(new Map())

    const fetchBrokenTeams = async () => {
        await FetchTeams({setTeams});
        console.log("Teams fetched:", teams);
        for (const team of teams) { 
            const data = await TeamAggregate({team: parseInt(team)});
            if(data.brokePercentage > 0) {
                setBrokenTeams(prev => [...prev, team]);
            }
        }
        console.log("Broken teams:", brokenTeams);
    };

    useEffect(() => {
        fetchBrokenTeams();
    }, []);
    
    return (
        <div>
            <MainHeader />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Third Bot Analysis - Broken Teams</h1>

                {/* Detailed breakdown section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Broken Teams</h2>
                    <div className="grid gap-4">
                        
                        {brokenTeams.length === 0 ? (
                            <p className="text-center text-gray-400 text-lg">No teams have broken in matches yet.</p>
                        ) : (
                            brokenTeams.map((teams) => (
                                <Card key={teams}>
                                    <CardContent className="p-4">
                                        <p className="text-lg">Team {teams}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

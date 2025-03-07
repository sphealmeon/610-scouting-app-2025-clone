"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MatchTableProps {
    matchData: any[];
    teams?: number[];
}

export function MatchTable({ matchData, teams = [] }: MatchTableProps) {
    // Calculate points for each team
    const teamPoints = matchData.map(data => {
        const team = data.start?.team;
        
        // Calculate auto points
        const autoPoints = 
            (data.auto?.l4 || 0) * 7 +
            (data.auto?.l3 || 0) * 6 +
            (data.auto?.l2 || 0) * 4 +
            (data.auto?.l1 || 0) * 3 +
            (data.auto?.leave || 0) * 3 +
            (data.auto?.processor || 0) * 6 +
            (data.auto?.barge || 0) * 4;

        // Calculate teleop points
        const teleopPoints = 
            (data.teleop?.l4Scored || 0) * 5 +
            (data.teleop?.l3Scored || 0) * 4 +
            (data.teleop?.l2Scored || 0) * 3 +
            (data.teleop?.l1Scored || 0) * 2 +
            (data.teleop?.processorScored || 0) * 6 +
            (data.teleop?.bargeScored || 0) * 4;

        // Calculate endgame points
        const endgamePoints = 
            (data.teleop?.deep || 0) * 12 +
            (data.teleop?.shallow || 0) * 6 +
            (data.teleop?.park || 0) * 2;

        return {
            team,
            autoPoints,
            teleopPoints,
            endgamePoints,
            totalPoints: autoPoints + teleopPoints + endgamePoints
        };
    });

    // Add missing teams
    const missingTeams = teams.filter(team => 
        !teamPoints.some(tp => tp.team === team)
    ).map(team => ({
        team,
        autoPoints: 0,
        teleopPoints: 0,
        endgamePoints: 0,
        totalPoints: 0,
        missing: true
    }));

    // Combine and sort by team number
    const allTeamPoints = [...teamPoints, ...missingTeams]
        .sort((a, b) => a.team - b.team);

    // Calculate alliance totals
    const allianceTotals = {
        autoPoints: teamPoints.reduce((sum, tp) => sum + tp.autoPoints, 0),
        teleopPoints: teamPoints.reduce((sum, tp) => sum + tp.teleopPoints, 0),
        endgamePoints: teamPoints.reduce((sum, tp) => sum + tp.endgamePoints, 0),
        totalPoints: teamPoints.reduce((sum, tp) => sum + tp.totalPoints, 0)
    };

    return (
        <div className="rounded-md border mb-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Team</TableHead>
                        <TableHead>Auto</TableHead>
                        <TableHead>Teleop</TableHead>
                        <TableHead>Endgame</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allTeamPoints.map((tp) => (
                        <TableRow key={tp.team}>
                            <TableCell className="font-medium">{tp.team}</TableCell>
                            <TableCell>{tp.autoPoints}</TableCell>
                            <TableCell>{tp.teleopPoints}</TableCell>
                            <TableCell>{tp.endgamePoints}</TableCell>
                            <TableCell className="font-bold">{tp.totalPoints}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow className="bg-gray-800 font-bold">
                        <TableCell>Alliance Total</TableCell>
                        <TableCell>{allianceTotals.autoPoints}</TableCell>
                        <TableCell>{allianceTotals.teleopPoints}</TableCell>
                        <TableCell>{allianceTotals.endgamePoints}</TableCell>
                        <TableCell>{allianceTotals.totalPoints}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}




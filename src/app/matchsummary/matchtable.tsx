"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MatchTableProps {
    matchData?: any;
}

export function MatchTable({ matchData }: MatchTableProps) {
    if (!matchData) return null;
    
    // Calculate points using the same logic as in calculateAggregate
    const autoPoints = 
        (matchData.auto?.l4 || 0) * 7 +
        (matchData.auto?.l3 || 0) * 6 +
        (matchData.auto?.l2 || 0) * 4 +
        (matchData.auto?.l1 || 0) * 3 +
        (matchData.auto?.leave || 0) * 3 +
        (matchData.auto?.processor || 0) * 6 +
        (matchData.auto?.barge || 0) * 4;

    const teleopPoints = 
        (matchData.teleop?.l4Scored || 0) * 5 +
        (matchData.teleop?.l3Scored || 0) * 4 +
        (matchData.teleop?.l2Scored || 0) * 3 +
        (matchData.teleop?.l1Scored || 0) * 2 +
        (matchData.teleop?.processorScored || 0) * 6 +
        (matchData.teleop?.bargeScored || 0) * 4;

    const endgamePoints = 
        (matchData.teleop?.deep || 0) * 12 +
        (matchData.teleop?.shallow || 0) * 6 +
        (matchData.teleop?.park || 0) * 2;

    const totalPoints = autoPoints + teleopPoints + endgamePoints;

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
                    <TableRow>
                        <TableCell className="font-medium">{matchData.start.team}</TableCell>
                        <TableCell>{autoPoints}</TableCell>
                        <TableCell>{teleopPoints}</TableCell>
                        <TableCell>{endgamePoints}</TableCell>
                        <TableCell className="font-bold">{totalPoints}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
} 
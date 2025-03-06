"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MatchTableProps {
    matchData?: any;
}

export function MatchTable({ matchData }: MatchTableProps) {
    if (!matchData) return null;
    
    // Calculate auto points
    const autoPoints = {
        l4: (matchData.auto?.l4 || 0) * 7,
        l3: (matchData.auto?.l3 || 0) * 6,
        l2: (matchData.auto?.l2 || 0) * 4,
        l1: (matchData.auto?.l1 || 0) * 3,
        leave: (matchData.auto?.leave || 0) * 3,
        processor: (matchData.auto?.processor || 0) * 6,
        barge: (matchData.auto?.barge || 0) * 4,
        total: (matchData.auto?.l4 || 0) * 7 +
               (matchData.auto?.l3 || 0) * 6 +
               (matchData.auto?.l2 || 0) * 4 +
               (matchData.auto?.l1 || 0) * 3 +
               (matchData.auto?.leave || 0) * 3 +
               (matchData.auto?.processor || 0) * 6 +
               (matchData.auto?.barge || 0) * 4
    };

    // Calculate teleop points
    const teleopPoints = {
        l4: (matchData.teleop?.l4Scored || 0) * 5,
        l3: (matchData.teleop?.l3Scored || 0) * 4,
        l2: (matchData.teleop?.l2Scored || 0) * 3,
        l1: (matchData.teleop?.l1Scored || 0) * 2,
        processor: (matchData.teleop?.processorScored || 0) * 6,
        barge: (matchData.teleop?.bargeScored || 0) * 4,
        total: (matchData.teleop?.l4Scored || 0) * 5 +
               (matchData.teleop?.l3Scored || 0) * 4 +
               (matchData.teleop?.l2Scored || 0) * 3 +
               (matchData.teleop?.l1Scored || 0) * 2 +
               (matchData.teleop?.processorScored || 0) * 6 +
               (matchData.teleop?.bargeScored || 0) * 4
    };

    // Calculate endgame points
    const endgamePoints = {
        deep: (matchData.teleop?.deep || 0) * 12,
        shallow: (matchData.teleop?.shallow || 0) * 6,
        park: (matchData.teleop?.park || 0) * 2,
        total: (matchData.teleop?.deep || 0) * 12 +
               (matchData.teleop?.shallow || 0) * 6 +
               (matchData.teleop?.park || 0) * 2
    };

    const totalPoints = autoPoints.total + teleopPoints.total + endgamePoints.total;

    return (
        <div className="rounded-md border mb-4">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-800">
                        <TableHead colSpan={2} className="text-center font-bold text-lg">
                            Team {matchData.start.team}
                        </TableHead>
                        <TableHead className="text-right font-bold">Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Auto Section */}
                    <TableRow className="bg-gray-700">
                        <TableCell colSpan={3} className="font-bold">Auto</TableCell>
                    </TableRow>
                    {matchData.auto?.l4 > 0 && (
                        <TableRow>
                            <TableCell>L4 Notes</TableCell>
                            <TableCell>{matchData.auto.l4}x</TableCell>
                            <TableCell className="text-right">{autoPoints.l4}</TableCell>
                        </TableRow>
                    )}
                    {matchData.auto?.l3 > 0 && (
                        <TableRow>
                            <TableCell>L3 Notes</TableCell>
                            <TableCell>{matchData.auto.l3}x</TableCell>
                            <TableCell className="text-right">{autoPoints.l3}</TableCell>
                        </TableRow>
                    )}
                    {matchData.auto?.l2 > 0 && (
                        <TableRow>
                            <TableCell>L2 Notes</TableCell>
                            <TableCell>{matchData.auto.l2}x</TableCell>
                            <TableCell className="text-right">{autoPoints.l2}</TableCell>
                        </TableRow>
                    )}
                    {matchData.auto?.l1 > 0 && (
                        <TableRow>
                            <TableCell>L1 Notes</TableCell>
                            <TableCell>{matchData.auto.l1}x</TableCell>
                            <TableCell className="text-right">{autoPoints.l1}</TableCell>
                        </TableRow>
                    )}
                    {matchData.auto?.leave > 0 && (
                        <TableRow>
                            <TableCell>Leave</TableCell>
                            <TableCell>{matchData.auto.leave}x</TableCell>
                            <TableCell className="text-right">{autoPoints.leave}</TableCell>
                        </TableRow>
                    )}
                    {matchData.auto?.processor > 0 && (
                        <TableRow>
                            <TableCell>Processor</TableCell>
                            <TableCell>{matchData.auto.processor}x</TableCell>
                            <TableCell className="text-right">{autoPoints.processor}</TableCell>
                        </TableRow>
                    )}
                    {matchData.auto?.barge > 0 && (
                        <TableRow>
                            <TableCell>Barge</TableCell>
                            <TableCell>{matchData.auto.barge}x</TableCell>
                            <TableCell className="text-right">{autoPoints.barge}</TableCell>
                        </TableRow>
                    )}
                    <TableRow className="font-bold">
                        <TableCell colSpan={2}>Auto Total</TableCell>
                        <TableCell className="text-right">{autoPoints.total}</TableCell>
                    </TableRow>

                    {/* Teleop Section */}
                    <TableRow className="bg-gray-700">
                        <TableCell colSpan={3} className="font-bold">Teleop</TableCell>
                    </TableRow>
                    {matchData.teleop?.l4Scored > 0 && (
                        <TableRow>
                            <TableCell>L4 Notes</TableCell>
                            <TableCell>{matchData.teleop.l4Scored}x</TableCell>
                            <TableCell className="text-right">{teleopPoints.l4}</TableCell>
                        </TableRow>
                    )}
                    {matchData.teleop?.l3Scored > 0 && (
                        <TableRow>
                            <TableCell>L3 Notes</TableCell>
                            <TableCell>{matchData.teleop.l3Scored}x</TableCell>
                            <TableCell className="text-right">{teleopPoints.l3}</TableCell>
                        </TableRow>
                    )}
                    {matchData.teleop?.l2Scored > 0 && (
                        <TableRow>
                            <TableCell>L2 Notes</TableCell>
                            <TableCell>{matchData.teleop.l2Scored}x</TableCell>
                            <TableCell className="text-right">{teleopPoints.l2}</TableCell>
                        </TableRow>
                    )}
                    {matchData.teleop?.l1Scored > 0 && (
                        <TableRow>
                            <TableCell>L1 Notes</TableCell>
                            <TableCell>{matchData.teleop.l1Scored}x</TableCell>
                            <TableCell className="text-right">{teleopPoints.l1}</TableCell>
                        </TableRow>
                    )}
                    {matchData.teleop?.processorScored > 0 && (
                        <TableRow>
                            <TableCell>Processor</TableCell>
                            <TableCell>{matchData.teleop.processorScored}x</TableCell>
                            <TableCell className="text-right">{teleopPoints.processor}</TableCell>
                        </TableRow>
                    )}
                    {matchData.teleop?.bargeScored > 0 && (
                        <TableRow>
                            <TableCell>Barge</TableCell>
                            <TableCell>{matchData.teleop.bargeScored}x</TableCell>
                            <TableCell className="text-right">{teleopPoints.barge}</TableCell>
                        </TableRow>
                    )}
                    <TableRow className="font-bold">
                        <TableCell colSpan={2}>Teleop Total</TableCell>
                        <TableCell className="text-right">{teleopPoints.total}</TableCell>
                    </TableRow>

                    {/* Endgame Section */}
                    <TableRow className="bg-gray-700">
                        <TableCell colSpan={3} className="font-bold">Endgame</TableCell>
                    </TableRow>
                    {matchData.teleop?.deep > 0 && (
                        <TableRow>
                            <TableCell>Deep</TableCell>
                            <TableCell>{matchData.teleop.deep}x</TableCell>
                            <TableCell className="text-right">{endgamePoints.deep}</TableCell>
                        </TableRow>
                    )}
                    {matchData.teleop?.shallow > 0 && (
                        <TableRow>
                            <TableCell>Shallow</TableCell>
                            <TableCell>{matchData.teleop.shallow}x</TableCell>
                            <TableCell className="text-right">{endgamePoints.shallow}</TableCell>
                        </TableRow>
                    )}
                    {matchData.teleop?.park > 0 && (
                        <TableRow>
                            <TableCell>Park</TableCell>
                            <TableCell>{matchData.teleop.park}x</TableCell>
                            <TableCell className="text-right">{endgamePoints.park}</TableCell>
                        </TableRow>
                    )}
                    <TableRow className="font-bold">
                        <TableCell colSpan={2}>Endgame Total</TableCell>
                        <TableCell className="text-right">{endgamePoints.total}</TableCell>
                    </TableRow>

                    {/* Total Points */}
                    <TableRow className="bg-gray-800 font-bold text-lg">
                        <TableCell colSpan={2}>TOTAL POINTS</TableCell>
                        <TableCell className="text-right">{totalPoints}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
} 
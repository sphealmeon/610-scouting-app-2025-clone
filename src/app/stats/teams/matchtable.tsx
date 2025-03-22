"use client"

import { Data } from "@/app/interfaces"
import { useState, useEffect } from "react"
import { TeamMatchesData } from "@/app/firebase/teamMatchesData"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
   
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Calculate coral cycles for a match
const calculateCoralCycles = (match: Data): number => {
    // Count all coral pieces scored
    let total = 0;
    
    // Auto coral
    if (match.auto?.coral) {
        total += match.auto.coral;
    }
    
    // Teleop coral (L1-L4)
    if (match.teleop?.l1Scored) total += match.teleop.l1Scored;
    if (match.teleop?.l2Scored) total += match.teleop.l2Scored;
    if (match.teleop?.l3Scored) total += match.teleop.l3Scored;
    if (match.teleop?.l4Scored) total += match.teleop.l4Scored;
    
    return total;
};

// Calculate algae cycles for a match
const calculateAlgaeCycles = (match: Data): number => {
    // Count all algae pieces scored
    let total = 0;
    
    // Auto algae
    if (match.auto?.algae) {
        total += match.auto.algae;
    }
    
    // Teleop algae (processor + barge)
    if (match.teleop?.processorScored) total += match.teleop.processorScored;
    if (match.teleop?.bargeScored) total += match.teleop.bargeScored;
    
    return total;
};

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: "start.match",
        header: "Match",
    },
    {
        id: "coralCycles",
        header: "Coral Cycles",
        cell: ({ row }) => calculateCoralCycles(row.original)
    },
    {
        id: "algaeCycles",
        header: "Algae Cycles",
        cell: ({ row }) => calculateAlgaeCycles(row.original)
    },
    {
        accessorKey: "auto.coral",
        header: "Auto Coral",
    },
    {
        accessorKey: "auto.algae",
        header: "Auto Algae",
    },
    {
        accessorKey: "teleop.l4Scored",
        header: "L4 Scored",
    },
    {
        accessorKey: "teleop.l4Dropped",
        header: "L4 Dropped",
    },
    {
        accessorKey: "teleop.l3Scored",
        header: "L3 Scored",
    },
    {
        accessorKey: "teleop.l3Dropped",
        header: "L3 Dropped",
    },
    {
        accessorKey: "teleop.l2Scored",
        header: "L2 Scored",
    },
    {
        accessorKey: "teleop.l2Dropped",
        header: "L2 Dropped",
    },
    {
        accessorKey: "teleop.l1Scored",
        header: "L1 Scored",
    },
    {
        accessorKey: "teleop.l1Dropped",
        header: "L1 Dropped",
    },
    {
        accessorKey: "teleop.processorScored",
        header: "Processor Scored",
    },
    {
        accessorKey: "teleop.bargeScored",
        header: "Barge Scored",
    },
    {
        accessorKey: "teleop.deep",
        header: "Deep Hang",
    },
    {
        accessorKey: "teleop.shallow",
        header: "Shallow Hang",
    },
    {
        accessorKey: "teleop.park",
        header: "Park",
    },
    {
        accessorKey: "teleop.missedDeep",
        header: "Missed Deep",
    },
    {
        accessorKey: "teleop.missedShallow",
        header: "Missed Shallow",
    }
]

interface MatchTableProps {
    team: number;
}
   
export function MatchTable({ team }: MatchTableProps) {
    const [data, setData] = useState<Data[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchesData = await TeamMatchesData({ team })
                // Filter out undefined entries, match 0, and sort by match number
                const validMatches = matchesData
                    .filter((match): match is Data => 
                        match !== undefined && 
                        match.start?.match !== undefined && 
                        match.start.match !== 0  // Exclude match 0
                    )
                    .sort((a, b) => a.start.match - b.start.match)
                
                setData(validMatches)
            } catch (error) {
                console.error("Error fetching match data:", error)
            } finally {
                setLoading(false)
            }
        }

        if (team) {
            fetchData()
        }
    }, [team])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
   
    if (loading) {
        return <div>Loading match data...</div>
    }

    return (
        <div className="space-y-6">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No matches found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Match Notes</h3>
                <div className="rounded-md border divide-y">
                    {data.map((match) => (
                        
                        <div key={match.start.match} className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">Match {match.start.match}</span>
                            </div>
                            {match.teleop.general && (
                                <div className="mb-2">
                                    <span className="text-gray-400">General: </span>
                                    {match.teleop.general}
                                </div>
                            )}
                            {match.teleop.reason && (
                                <div>
                                    <span className="text-gray-400">Break: </span>
                                    {match.teleop.reason}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

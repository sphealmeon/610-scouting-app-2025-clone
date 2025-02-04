"use client"

import { Data } from "@/app/interfaces"
import { useState, useEffect } from "react"
import { TeamMatchesData } from "@/app/firebase/teamMatchesData"
import { StartPos } from "./startpos"
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

export const columns: ColumnDef<Data>[] = [
    {
        accessorKey: "start.match",
        header: "Match",
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
        accessorKey: "teleop.l3Scored",
        header: "L3 Scored",
    },
    {
        accessorKey: "teleop.l2Scored",
        header: "L2 Scored",
    },
    {
        accessorKey: "teleop.l1Scored",
        header: "L1 Scored",
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
        <div>
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
        </div>
    )
}

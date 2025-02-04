"use client"

import { AggregateData } from "@/app/interfaces"
import { useState, useEffect } from "react"
import { TeamAggregate } from "@/app/firebase/TeamAggregate"
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

export const columns: ColumnDef<AggregateData>[] = [
    {
        accessorKey: "standing",
        header: "Qual Ranking",
    },
    {
        accessorKey: "autoPPG",
        header: "Auto PPG",
    },
    {
        accessorKey: "teleopPPG",
        header: "Teleop PPG",
    },
    {
        accessorKey: "endgamePPG",
        header: "Endgame PPG",
    },
    {
        accessorKey: "coralCyclesScored",
        header: "# of Coral Cycles/Game",
    },
    {
        accessorKey: "algaeCyclesScored",
        header: "# of Algae Cycles/Game",
    },
    {
        accessorKey: "teleopL1Accuracy",
        header: "Teleop L1 Accuracy",
    },
    {
        accessorKey: "teleopL2Accuracy",
        header: "Teleop L2 Accuracy",
    },
    {
        accessorKey: "teleopL3Accuracy",
        header: "Teleop L3 Accuracy",
    },
    {
        accessorKey: "teleopL4Accuracy",
        header: "Teleop L4 Accuracy",
    },
]

interface DataTableProps<TData, TValue> {
    teams: number[]
}
   
export function DataTable<TData, TValue>({
    teams,
}: DataTableProps<TData, TValue>) {
    const [data, setData] = useState<AggregateData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const aggregateData = await Promise.all(
                    teams.map(team => TeamAggregate({ team }))
                )
                setData(aggregateData.filter(data => data !== undefined))
            } catch (error) {
                console.error("Error fetching team data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [teams])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
   
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
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
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

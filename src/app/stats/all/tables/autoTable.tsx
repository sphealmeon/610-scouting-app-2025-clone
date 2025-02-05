"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { AggregateData } from "@/app/interfaces";
import { setCookie } from "@/app/cookies/cookies";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @param teamData an AggregateData array of all the teams data
 * @returns a sortable table containing auto data
 */
export default function AutoTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'team', direction: 'asc' });

  const sortKeys = {
    team: (data: AggregateData) => data.team,
    autoPPG: (data: AggregateData) => data.autoPPG,
    coral: (data: AggregateData) => data.matchAggregateData.auto.coral,
    algae: (data: AggregateData) => data.matchAggregateData.auto.algae,
    droppedCoral: (data: AggregateData) => data.matchAggregateData.auto.droppedCoral,
    droppedAlgae: (data: AggregateData) => data.matchAggregateData.auto.droppedAlgae,
    l4: (data: AggregateData) => data.matchAggregateData.auto.l4,
    l3: (data: AggregateData) => data.matchAggregateData.auto.l3,
    l2: (data: AggregateData) => data.matchAggregateData.auto.l2,
    l1: (data: AggregateData) => data.matchAggregateData.auto.l1,
    processor: (data: AggregateData) => data.matchAggregateData.auto.processor,
    barge: (data: AggregateData) => data.matchAggregateData.auto.barge,
  };

  const sortData = (key: keyof typeof sortKeys) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...teamData].sort((a, b) => {
    const getValue = sortKeys[sortConfig.key];
    const aValue = getValue(a);
    const bValue = getValue(b);
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Object.entries(sortKeys).map(([key, _]) => (
              <TableHead key={key} className="p-0">
                <Button 
                  className="bg-gray-200 hover:bg-gray-300 text-black w-full rounded-none h-full" 
                  onClick={() => sortData(key as keyof typeof sortKeys)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((data) => (
            <TableRow 
              key={data.team}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                router.push("/stats/team");
                setCookie("Team", data.team.toString());
              }}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.autoPPG.toFixed(2)}</TableCell>
              <TableCell>{data.matchAggregateData.auto.coral}</TableCell>
              <TableCell>{data.matchAggregateData.auto.algae}</TableCell>
              <TableCell>{data.matchAggregateData.auto.droppedCoral}</TableCell>
              <TableCell>{data.matchAggregateData.auto.droppedAlgae}</TableCell>
              <TableCell>{data.matchAggregateData.auto.l4}</TableCell>
              <TableCell>{data.matchAggregateData.auto.l3}</TableCell>
              <TableCell>{data.matchAggregateData.auto.l2}</TableCell>
              <TableCell>{data.matchAggregateData.auto.l1}</TableCell>
              <TableCell>{data.matchAggregateData.auto.processor}</TableCell>
              <TableCell>{data.matchAggregateData.auto.barge}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
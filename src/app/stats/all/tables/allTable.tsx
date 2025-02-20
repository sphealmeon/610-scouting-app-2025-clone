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
import { ArrowUpDown, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @param teamData an AggregateData array of all the teams data
 * @returns a sortable table containing all data
 */
export default function AllTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'team', direction: 'asc' });

  const sortKeys = {
    team: (data: AggregateData) => data.team,
    matches: (data: AggregateData) => data.matchesPlayed,
    autoPPG: (data: AggregateData) => data.autoPPG,
    teleopPPG: (data: AggregateData) => data.teleopPPG,
    endgamePPG: (data: AggregateData) => data.endgamePPG,
    coralCycles: (data: AggregateData) => data.coralCyclesScored,
    algaeCycles: (data: AggregateData) => data.algaeCyclesScored,
    l1l4Accuracy: (data: AggregateData) => (data.teleopL1Accuracy + data.teleopL2Accuracy + data.teleopL3Accuracy + data.teleopL4Accuracy) / 4,
    bargeAccuracy: (data: AggregateData) => data.teleopBargeAccuracy,
    processorAccuracy: (data: AggregateData) => data.teleopProcessorAccuracy,
    shallowAccuracy: (data: AggregateData) => data.shallowAccuracy,
    deepAccuracy: (data: AggregateData) => data.deepAccuracy,
    brokePercentage: (data: AggregateData) => data.brokePercentage,
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
    <div className="rounded-md border border-gray-700 bg-[#121212]">
      <Table>
        <TableHeader>
          <TableRow>
           {Object.entries(sortKeys).map(([key, _]) => (
              <TableHead key={key} className="p-0">
                <Button 
                  className="bg-[#004d40] hover:bg-[#00695c] text-white w-full rounded-none h-full" 
                  onClick={() => sortData(key as keyof typeof sortKeys)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig.key === key ? (
                    sortConfig.direction === 'asc' 
                      ? <ArrowUpIcon className="ml-2 h-4 w-4" />
                      : <ArrowDownIcon className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((data) => (
            <TableRow 
              key={data.team}
              className="cursor-pointer hover:bg-gray-800 text-gray-200"
              onClick={() => {
                router.push("/stats/teams");
                setCookie("Team", data.team.toString());
              }}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.matchesPlayed}</TableCell>
              <TableCell>{data.autoPPG.toFixed(2)}</TableCell>
              <TableCell>{data.teleopPPG.toFixed(2)}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(2)}</TableCell>
              <TableCell>{data.coralCyclesScored.toFixed(2)}</TableCell>
              <TableCell>{data.algaeCyclesScored.toFixed(2)}</TableCell>
              <TableCell>{((data.teleopL1Accuracy + data.teleopL2Accuracy + data.teleopL3Accuracy + data.teleopL4Accuracy) / 4 * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopBargeAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopProcessorAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.shallowAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.deepAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.brokePercentage * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
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

export default function EndgameTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'team', direction: 'asc' });

  const sortKeys = {
    team: (data: AggregateData) => data.team,
    endgamePPG: (data: AggregateData) => data.endgamePPG,
    shallowAccuracy: (data: AggregateData) => data.shallowAccuracy,
    deepAccuracy: (data: AggregateData) => data.deepAccuracy,
    park: (data: AggregateData) => data.matchAggregateData.teleop.park,
    shallow: (data: AggregateData) => data.matchAggregateData.teleop.shallow,
    deep: (data: AggregateData) => data.matchAggregateData.teleop.deep,
    missedShallow: (data: AggregateData) => data.matchAggregateData.teleop.missedShallow,
    missedDeep: (data: AggregateData) => data.matchAggregateData.teleop.missedDeep,
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
                setCookie("Team", data.team.toString());
                window.open("/stats/teams", "_blank");
              }}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(2)}</TableCell>
              <TableCell>{(data.shallowAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.deepAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.matchAggregateData.teleop.park * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.matchAggregateData.teleop.shallow * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.matchAggregateData.teleop.deep * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.matchAggregateData.teleop.missedShallow * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.matchAggregateData.teleop.missedDeep * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
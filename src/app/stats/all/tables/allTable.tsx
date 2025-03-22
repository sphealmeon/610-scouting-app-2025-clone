"use client";
import { setCookie } from "@/app/cookies/cookies";
import { AggregateData } from "@/app/interfaces";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./allTable.css";

export default function AllTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'totalPPG', direction: 'desc' });

  const sortKeys = {
    team: (data: AggregateData) => data.team,
    totalPPG: (data: AggregateData) => data.autoPPG + data.teleopPPG + data.endgamePPG,
    matches: (data: AggregateData) => data.matchesPlayed,
    autoPPG: (data: AggregateData) => data.autoPPG,
    teleopPPG: (data: AggregateData) => data.teleopPPG,
    endgamePPG: (data: AggregateData) => data.endgamePPG,
    coralCycles: (data: AggregateData) => data.coralCyclesScored,
    algaeCycles: (data: AggregateData) => data.algaeCyclesScored,
    l1Accuracy: (data: AggregateData) => data.teleopL1Accuracy,
    l2Accuracy: (data: AggregateData) => data.teleopL2Accuracy,
    l3Accuracy: (data: AggregateData) => data.teleopL3Accuracy,
    l4Accuracy: (data: AggregateData) => data.teleopL4Accuracy,
    bargeAccuracy: (data: AggregateData) => data.teleopBargeAccuracy,
    processorAccuracy: (data: AggregateData) => data.teleopProcessorAccuracy,
    shallowAccuracy: (data: AggregateData) => data.shallowAccuracy,
    deepAccuracy: (data: AggregateData) => data.deepAccuracy,
    playedDefenseMatches: (data: AggregateData) => data.playedDefenseMatches,
    avgFouls: (data: AggregateData) => data.avgFouls,
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
          {sortedData.map((data, index) => (
            <TableRow 
              key={data.team}
              className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
              onClick={() => {
                setCookie("Team", data.team.toString());
                window.open("/stats/teams", "_blank");
              }}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{(data.autoPPG + data.teleopPPG + data.endgamePPG).toFixed(2)}</TableCell>
              <TableCell>{data.matchesPlayed}</TableCell>
              <TableCell>{data.autoPPG.toFixed(2)}</TableCell>
              <TableCell>{data.teleopPPG.toFixed(2)}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(2)}</TableCell>
              <TableCell>{data.coralCyclesScored.toFixed(2)}</TableCell>
              <TableCell>{data.algaeCyclesScored.toFixed(2)}</TableCell>
              <TableCell>{(data.teleopL1Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL2Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL3Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL4Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopBargeAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopProcessorAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.shallowAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.deepAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{data.playedDefenseMatches}</TableCell>
              <TableCell>{(data.avgFouls).toFixed(1)}</TableCell>
              <TableCell>{(data.brokePercentage * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
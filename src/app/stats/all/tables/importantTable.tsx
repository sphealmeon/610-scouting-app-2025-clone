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

// Custom power calculation weights - MODIFY THESE VALUES TO CHANGE THE POWER CALCULATION
const powerWeights = {
  autoPPG: 1.75,        // Auto points are weighted 20% higher
  teleopPPG: 1.0,      // Teleop points at normal weight
  endgamePPG: 1.5,     // Endgame points are weighted 50% higher
  brokePercentage: -3.0, // Heavy penalty for breaking
  coralCyclesScored: 0.5, // Bonus for coral cycles
  algaeCyclesScored: 0.3, // Bonus for algae cycles
};

/**
 * Calculates a custom power rating based on the team's stats and configurable weights
 * @param team The team's aggregate data
 * @returns A power rating number
 */
const calculatePower = (team: AggregateData): number => {
  // Base calculation from weighted PPG components
  let power = 
    (team.autoPPG * powerWeights.autoPPG) +
    (team.teleopPPG * powerWeights.teleopPPG) +
    (team.endgamePPG * powerWeights.endgamePPG);
  
  // Apply penalties for breaking
  power += team.brokePercentage * powerWeights.brokePercentage;
  
  // Add bonuses for cycles
  power += team.coralCyclesScored * powerWeights.coralCyclesScored;
  power += team.algaeCyclesScored * powerWeights.algaeCyclesScored;

  
  return power;
};

/**
 * @param teamData an AggregateData array of all the teams data
 * @returns a sortable table showing important stats
 */
export default function ImportantTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'power', direction: 'desc' });

  // Calculate power for each team
  const teamsWithPower = teamData.map(team => ({
    ...team,
    power: calculatePower(team)
  }));

  const sortKeys = {
    team: (data: AggregateData & { power: number }) => data.team,
    standing: (data: AggregateData & { power: number }) => data.standing,
    power: (data: AggregateData & { power: number }) => data.power,
    autoPPG: (data: AggregateData & { power: number }) => data.autoPPG,
    teleopPPG: (data: AggregateData & { power: number }) => data.teleopPPG,
    endgamePPG: (data: AggregateData & { power: number }) => data.endgamePPG,
    totalPPG: (data: AggregateData & { power: number }) => data.autoPPG + data.teleopPPG + data.endgamePPG,
    brokePercentage: (data: AggregateData & { power: number }) => data.brokePercentage,
  };

  const sortData = (key: keyof typeof sortKeys) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...teamsWithPower].sort((a, b) => {
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
                  {/* {key === 'totalPPG' ? 'Total PPG' : 
                   key === 'autoPPG' ? 'Auto PPG' : 
                   key === 'teleopPPG' ? 'Teleop PPG' : 
                   key === 'endgamePPG' ? 'Endgame PPG' : 
                   key === 'brokePercentage' ? 'Broke %' : 
                   key === 'power' ? 'Power Rating' :
                   key} */}
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
              <TableCell>{data.standing}</TableCell>
              <TableCell className="font-bold">{data.power.toFixed(1)}</TableCell>
              <TableCell>{data.autoPPG.toFixed(1)}</TableCell>
              <TableCell>{data.teleopPPG.toFixed(1)}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(1)}</TableCell>
              <TableCell>{(data.autoPPG + data.teleopPPG + data.endgamePPG).toFixed(1)}</TableCell>
              <TableCell>{(data.brokePercentage * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

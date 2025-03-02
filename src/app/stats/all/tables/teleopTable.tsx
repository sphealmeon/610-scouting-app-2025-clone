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
 * @returns a sortable table containing teleop data
 */
export default function TeleopTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'team', direction: 'asc' });

  const sortKeys = {
    team: (data: AggregateData) => data.team,
    teleopPPG: (data: AggregateData) => data.teleopPPG,
    coralCyclesScored: (data: AggregateData) => data.coralCyclesScored,
    algaeCyclesScored: (data: AggregateData) => data.algaeCyclesScored,
    l1Accuracy: (data: AggregateData) => data.teleopL1Accuracy,
    l2Accuracy: (data: AggregateData) => data.teleopL2Accuracy,
    l3Accuracy: (data: AggregateData) => data.teleopL3Accuracy,
    l4Accuracy: (data: AggregateData) => data.teleopL4Accuracy,
    bargeAccuracy: (data: AggregateData) => data.teleopBargeAccuracy,
    processorAccuracy: (data: AggregateData) => data.teleopProcessorAccuracy,
    coralPickup: (data: AggregateData) => data.matchAggregateData.teleop.coralPickup,
    coralPickupFromStation: (data: AggregateData) => data.matchAggregateData.teleop.coralPickupFromStation,
    pickupAlgae: (data: AggregateData) => data.matchAggregateData.teleop.pickupAlgae,
    pickupAlgaeFromReef: (data: AggregateData) => data.matchAggregateData.teleop.pickupAlgaeFromReef,
    algaeRemoved: (data: AggregateData) => data.matchAggregateData.teleop.algaeRemoved,
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
              <TableCell>{data.teleopPPG.toFixed(2)}</TableCell>
              <TableCell>{data.coralCyclesScored.toFixed(2)}</TableCell>
              <TableCell>{data.algaeCyclesScored.toFixed(2)}</TableCell>
              <TableCell>{(data.teleopL1Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL2Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL3Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL4Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopBargeAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopProcessorAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{data.matchAggregateData.teleop.coralPickup.toFixed(2)}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.coralPickupFromStation.toFixed(2)}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.pickupAlgae.toFixed(2)}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.pickupAlgaeFromReef.toFixed(2)}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.algaeRemoved.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

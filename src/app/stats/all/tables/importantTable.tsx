"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AggregateData } from "@/app/interfaces";

/**
 * @param teamData an AggregateData array of all the teams data
 * @returns a sortable table mostly containing to most important data
 */
export default function ImportantTable({ teamData }: { teamData: AggregateData[] }) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Team</TableHead>
            <TableHead>Auto PPG</TableHead>
            <TableHead>Teleop PPG</TableHead>
            <TableHead>Endgame PPG</TableHead>
            <TableHead>Coral Cycles</TableHead>
            <TableHead>Algae Cycles</TableHead>
            <TableHead>Broke %</TableHead>
            <TableHead>Matches</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamData.map((data) => (
            <TableRow 
              key={data.team}          
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.autoPPG.toFixed(2)}</TableCell>
              <TableCell>{data.teleopPPG.toFixed(2)}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(2)}</TableCell>
              <TableCell>{data.coralCyclesScored.toFixed(2)}</TableCell>
              <TableCell>{data.algaeCyclesScored.toFixed(2)}</TableCell>
              <TableCell>{(data.brokePercentage * 100).toFixed(1)}%</TableCell>
              <TableCell>{data.matchesPlayed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

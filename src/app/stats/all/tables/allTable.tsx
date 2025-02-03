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
import { setCookie } from "@/app/cookies/cookies";

/**
 * @param teamData an AggregateData array of all the teams data
 * @returns a sortable table containing all data
 */
export default function AllTable({ teamData }: { teamData: AggregateData[] }) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Team</TableHead>
            <TableHead>Matches</TableHead>
            <TableHead>Auto PPG</TableHead>
            <TableHead>Teleop PPG</TableHead>
            <TableHead>Endgame PPG</TableHead>
            <TableHead>Coral Cycles</TableHead>
            <TableHead>Algae Cycles</TableHead>
            <TableHead>L1-L4 Accuracy</TableHead>
            <TableHead>Barge Accuracy</TableHead>
            <TableHead>Processor Accuracy</TableHead>
            <TableHead>Shallow Accuracy</TableHead>
            <TableHead>Deep Accuracy</TableHead>
            <TableHead>Broke %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamData.map((data) => (
            <TableRow 
              key={data.team}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.matchesPlayed}</TableCell>
              <TableCell>{data.autoPPG.toFixed(2)}</TableCell>
              <TableCell>{data.teleopPPG.toFixed(2)}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(2)}</TableCell>
              <TableCell>{data.coralCyclesScored}</TableCell>
              <TableCell>{data.algaeCyclesScored}</TableCell>
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
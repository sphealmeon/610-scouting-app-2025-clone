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
export default function EndgameTable({ teamData }: { teamData: AggregateData[] }) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Team</TableHead>
            <TableHead>Endgame PPG</TableHead>
            <TableHead>Shallow Accuracy</TableHead>
            <TableHead>Deep Accuracy</TableHead>
            <TableHead>Park</TableHead>
            <TableHead>Shallow</TableHead>
            <TableHead>Deep</TableHead>
            <TableHead>Missed Shallow</TableHead>
            <TableHead>Missed Deep</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamData.map((data) => (
            <TableRow 
              key={data.team}
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
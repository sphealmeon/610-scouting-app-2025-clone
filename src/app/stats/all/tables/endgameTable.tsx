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
import { useRouter } from "next/navigation";
import { AggregateData } from "@/app/interfaces";
import { setCookie } from "@/app/cookies/cookies";

export default function EndgameTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();

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
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                router.push("/stats/team");
                setCookie("Team", data.team.toString());
              }}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(2)}</TableCell>
              <TableCell>{(data.shallowAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.deepAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{data.matchAggregateData.teleop.park}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.shallow}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.deep}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.missedShallow}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.missedDeep}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
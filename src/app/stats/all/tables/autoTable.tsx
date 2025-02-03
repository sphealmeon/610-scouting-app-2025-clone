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

/**
 * @param teamData an AggregateData array of all the teams data
 * @returns a sortable table containing auto data
 */
export default function AutoTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Team</TableHead>
            <TableHead>Auto PPG</TableHead>
            <TableHead>Coral</TableHead>
            <TableHead>Algae</TableHead>
            <TableHead>Dropped Coral</TableHead>
            <TableHead>Dropped Algae</TableHead>
            <TableHead>L4</TableHead>
            <TableHead>L3</TableHead>
            <TableHead>L2</TableHead>
            <TableHead>L1</TableHead>
            <TableHead>Processor</TableHead>
            <TableHead>Barge</TableHead>
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
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
 * @returns a sortable table containing teleop data
 */
export default function TeleopTable({ teamData }: { teamData: AggregateData[] }) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Team</TableHead>
            <TableHead>Teleop PPG</TableHead>
            <TableHead>L1 Accuracy</TableHead>
            <TableHead>L2 Accuracy</TableHead>
            <TableHead>L3 Accuracy</TableHead>
            <TableHead>L4 Accuracy</TableHead>
            <TableHead>Barge Accuracy</TableHead>
            <TableHead>Processor Accuracy</TableHead>
            <TableHead>Floor Pickup</TableHead>
            <TableHead>Source Pickup</TableHead>
            <TableHead>Pickup Algae</TableHead>
            <TableHead>Pickup Algae From Reef</TableHead>
            <TableHead>Algae Removed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamData.map((data) => (
            <TableRow 
              key={data.team}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.teleopPPG.toFixed(2)}</TableCell>
              <TableCell>{(data.teleopL1Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL2Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL3Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopL4Accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopBargeAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(data.teleopProcessorAccuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{data.matchAggregateData.teleop.floorPickup}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.sourcePickup}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.pickupAlgae}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.pickupAlgaeFromReef}</TableCell>
              <TableCell>{data.matchAggregateData.teleop.algaeRemoved}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

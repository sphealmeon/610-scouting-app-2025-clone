"use client";
import { setCookie } from "@/app/cookies/cookies";
import { AggregateData } from "@/app/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AllTable({ teamData }: { teamData: AggregateData[] }) {
  const router = useRouter();
  const [sortedData, setSortedData] = useState(teamData);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AggregateData;
    direction: "ascending" | "descending";
  } | null>(null);

  const onSort = (key: keyof AggregateData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof AggregateData) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return null;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]" onClick={() => onSort("team")}>
              Team {getSortIndicator("team")}
            </TableHead>
            <TableHead onClick={() => onSort("matchesPlayed")}>
              Matches {getSortIndicator("matchesPlayed")}
            </TableHead>
            <TableHead onClick={() => onSort("autoPPG")}>
              Auto PPG {getSortIndicator("autoPPG")}
            </TableHead>
            <TableHead onClick={() => onSort("teleopPPG")}>
              Teleop PPG {getSortIndicator("teleopPPG")}
            </TableHead>
            <TableHead onClick={() => onSort("endgamePPG")}>
              Endgame PPG {getSortIndicator("endgamePPG")}
            </TableHead>
            <TableHead onClick={() => onSort("coralCyclesScored")}>
              Coral Cycles {getSortIndicator("coralCyclesScored")}
            </TableHead>
            <TableHead onClick={() => onSort("algaeCyclesScored")}>
              Algae Cycles {getSortIndicator("algaeCyclesScored")}
            </TableHead>
            <TableHead>L1-L4 Accuracy</TableHead>
            <TableHead>Barge Accuracy</TableHead>
            <TableHead>Processor Accuracy</TableHead>
            <TableHead>Shallow Accuracy</TableHead>
            <TableHead>Deep Accuracy</TableHead>
            <TableHead>Broke %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((data) => (
            <TableRow
              key={data.team}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                router.push("/stats/team");
                setCookie("Team", data.team.toString());
              }}
            >
              <TableCell className="font-medium">{data.team}</TableCell>
              <TableCell>{data.matchesPlayed}</TableCell>
              <TableCell>{data.autoPPG.toFixed(2)}</TableCell>
              <TableCell>{data.teleopPPG.toFixed(2)}</TableCell>
              <TableCell>{data.endgamePPG.toFixed(2)}</TableCell>
              <TableCell>{data.coralCyclesScored}</TableCell>
              <TableCell>{data.algaeCyclesScored}</TableCell>
              <TableCell>
                {(
                  ((data.teleopL1Accuracy +
                    data.teleopL2Accuracy +
                    data.teleopL3Accuracy +
                    data.teleopL4Accuracy) /
                    4) *
                  100
                ).toFixed(1)}
                %
              </TableCell>
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
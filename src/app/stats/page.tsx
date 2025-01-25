"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AggregateData } from "@/app/interfaces";
import { TeamAggregate } from "@/app/firebase/TeamAggregate";
import { FetchTeams } from "@/app/blueAlliance/fetchTeams";
import Link from "next/link";
import { timer } from "@/app/globalVars";
import { delay } from "@/app/utils/delay";
//import TableTabs from "./tableTabs";

/**
 * @returns button to retrieve data, loads the team tabs with the tables
 */
export default function Home() {
  const [teams, setTeams] = useState<string[]>([]);
  const arr: AggregateData[] = [];
  const [teamData, setTeamData] = useState(arr);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (teams.length == 0) {
      FetchTeams({ setTeams: setTeams });
    }
  }, []);

  return (
    <>
      <div style={{ display: "flex", marginBottom: "1%" }}>
        <Link href="/stats/team">To Team Data</Link>
      </div>

      <Button
        onClick={() => {
          if (teams.length != 0 && !update) {
            const tempTeamArr: AggregateData[] = [];
            teams.forEach(async (team) => {
              tempTeamArr.push(await TeamAggregate({ team: parseInt(team) }));
            });
            setTeamData(tempTeamArr);
            delay(() => setUpdate(true), timer);
          }
        }}
      >
        Get Data
      </Button>
      {/*{update ? <TableTabs teamData={teamData} /> : <></>}*/}
    </>
  );
}
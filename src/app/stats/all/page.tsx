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
    <div className="flex flex-col items-center gap-4 p-4">
      <div>
        <Link href="/stats/team" className="hover:text-green-600 text-lg">
          To Team Data
        </Link>
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
        className="w-fit text-lg"
      >
        Get Data
      </Button>
      {/*{update ? <TableTabs teamData={teamData} /> : <></>}*/}
    </div>
  );
}
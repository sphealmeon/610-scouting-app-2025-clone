"use client";
import React, { useEffect, useState } from "react";
import { AggregateData } from "@/app/interfaces";
import { TeamAggregate } from "@/app/firebase/TeamAggregate";
import { FetchTeams } from "@/app/blueAlliance/fetchTeams";
import TableTabs from "./tableTabs";
import { MainHeader } from "@/components/MainHeader";

export default function Page() {
  const [teams, setTeams] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<AggregateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      FetchTeams({ setTeams });

      const tempTeamArr: AggregateData[] = [];
      for (const team of teams) {
        const data = await TeamAggregate({ team: parseInt(team) });
        if (data) tempTeamArr.push(data);
      }
      setTeamData(tempTeamArr);
      setLoading(false);
    };

    fetchData();
  }, [teams]);

  if (loading) return <div>Loading...</div>;

  return (
      <>
      <MainHeader />
      <TableTabs teamData={teamData} />
      </>
  );
}
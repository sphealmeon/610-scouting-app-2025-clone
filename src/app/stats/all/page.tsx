"use client";
import React, { useEffect, useState } from "react";
import { AggregateData, HumanPlayerStats } from "@/app/interfaces";
import { TeamAggregate } from "@/app/firebase/TeamAggregate";
import { FetchTeams } from "@/app/blueAlliance/fetchTeams";
import TableTabs from "./tableTabs";
import { MainHeader } from "@/components/MainHeader";
import { db } from "@/app/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Page() {
  const [teams, setTeams] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<AggregateData[]>([]);
  const [hpData, setHpData] = useState<HumanPlayerStats[]>([]);
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

  useEffect(() => {
    const fetchHPData = async () => {
      try {
        const hpCollection = collection(db, "humanplayers");
        const hpSnapshot = await getDocs(hpCollection);
        const hpList = hpSnapshot.docs.map(doc => ({
          ...doc.data(),
          team: parseInt(doc.id)
        })) as HumanPlayerStats[];
        
        console.log("Fetched HP data:", hpList); // Debug log
        setHpData(hpList);
      } catch (error) {
        console.error("Error fetching HP data:", error);
      }
    };

    fetchHPData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
      <>
      <MainHeader />
      <TableTabs teamData={teamData} hpData={hpData} />
      </>
  );
}
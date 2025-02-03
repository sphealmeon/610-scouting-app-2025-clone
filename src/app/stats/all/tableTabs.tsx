"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AutoTable from "./tables/autoTable";
import { AggregateData } from "@/app/interfaces";
import ImportantTable from "./tables/importantTable";
import TeleopTable from "./tables/teleopTable";
import EndgameTable from "./tables/endgameTable";
import AllTable from "./tables/allTable";

export default function TableTabs({ teamData }: { teamData: AggregateData[] }) {
  return (
    <Tabs defaultValue="importantStats">
      <TabsList>
        <TabsTrigger value="importantStats">Important Stats</TabsTrigger>
        <TabsTrigger value="autoStats">Auto Stats</TabsTrigger>
        <TabsTrigger value="teleopStats">Teleop Stats</TabsTrigger>
        <TabsTrigger value="endgameStats">Endgame Stats</TabsTrigger>
        <TabsTrigger value="allStats">All Stats</TabsTrigger>
      </TabsList>

      <TabsContent value="importantStats">
        <ImportantTable teamData={teamData} />
      </TabsContent>
      <TabsContent value="autoStats">
        <AutoTable teamData={teamData} />
      </TabsContent>
      <TabsContent value="teleopStats">
        <TeleopTable teamData={teamData} />
      </TabsContent>
      <TabsContent value="endgameStats">
        <EndgameTable teamData={teamData} />
      </TabsContent>
      <TabsContent value="allStats">
        <AllTable teamData={teamData} />
      </TabsContent>
    </Tabs>
  );
}
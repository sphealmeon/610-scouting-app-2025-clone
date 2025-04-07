"use client";

import { useState } from "react";
import MatchPredictor from "@/app/strategy/MatchPredictor";
import PlayoffPredictor from "@/app/strategy/PlayoffPredictor";
import RankingsPredictor from "@/app/strategy/RankingsPredictor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StrategyPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Strategy Tools</h1>
      
      <Tabs defaultValue="match-predictor" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="match-predictor">Match Predictor</TabsTrigger>
          <TabsTrigger value="playoff-predictor">Playoff Predictor</TabsTrigger>
          <TabsTrigger value="rankings-predictor">Rankings Predictor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="match-predictor">
          <MatchPredictor />
        </TabsContent>
        
        <TabsContent value="playoff-predictor">
          <PlayoffPredictor />
        </TabsContent>
        
        <TabsContent value="rankings-predictor">
          <RankingsPredictor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

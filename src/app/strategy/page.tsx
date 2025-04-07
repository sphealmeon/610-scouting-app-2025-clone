"use client";

import { useState } from "react";
import MatchPredictor from "@/app/strategy/MatchPredictor";
import PlayoffPredictor from "@/app/strategy/PlayoffPredictor";
import RankingsPredictor from "@/app/strategy/RankingsPredictor";
import PredictionAccuracy from "@/app/strategy/PredictionAccuracy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainHeader } from "@/components/MainHeader";

export default function StrategyPage() {
  return (
    <>
    <MainHeader/>
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Strategy Tools</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Predict outcomes, simulate playoff brackets, and plan your alliance strategy.
      </p>

      <Tabs defaultValue="matchPredictor" className="w-full">
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="matchPredictor">Match Predictor</TabsTrigger>
          <TabsTrigger value="rankingsPredictor">Rankings Predictor</TabsTrigger>
          <TabsTrigger value="playoffPredictor">Playoff Predictor</TabsTrigger>
          <TabsTrigger value="accuracy">Prediction Accuracy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matchPredictor" className="mt-6">
          <MatchPredictor />
        </TabsContent>
        
        <TabsContent value="rankingsPredictor" className="mt-6">
          <RankingsPredictor />
        </TabsContent>
        
        <TabsContent value="playoffPredictor" className="mt-6">
          <PlayoffPredictor />
        </TabsContent>
        
        <TabsContent value="accuracy" className="mt-6">
          <PredictionAccuracy />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}

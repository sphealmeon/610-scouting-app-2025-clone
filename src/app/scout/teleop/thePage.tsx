'use client';

import React, { useState } from "react";
import PickupAlgae from "./pickupalgae";
import CoralScoringSection from "./coralscoring";
import EndGame from "./endgame";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";

export default function Home({ setMatchState }: { setMatchState: Function}) {
  const [middlePageState, setMiddlePageState] = useState("pickupAlgae");
  const [rightPageState, setRightPageState] = useState("endGame");

  const handleMiddlePageChange = (state: string) => {
    setMiddlePageState(state);
  };

  const handleRightPageChange = (state: string) => {
    setRightPageState(state);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden max-w-7xl mx-auto">
      <div className="flex flex-row items-center justify-center gap-8 mb-8">
        <div className="flex items-center gap-4 mt-12">
          <FontAwesomeIcon icon={faGamepad} className="w-16 h-16" />
          <p className="text-4xl font-bold">Teleop</p>
        </div>
      </div>
      {/*<ScoutHeader name={"Teleop"}/>*/}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 mr-5">
          <CoralScoringSection />
        </div>
        <div className="flex-1 p-4 mr-5 ml-5">
          <PickupAlgae />
        </div>
        <div className="flex-1 p-4 ml-5">
          {rightPageState === "endGame" && <EndGame />}
        </div>
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
        <div className="flex justify-between">
          <Button 
            className="bg-red-700 hover:bg-red-800 text-white p-4 w-[200px]"
            onClick={() => setMatchState(1)}
          >
            ← Back to Auto
          </Button>
          <Button 
            className="bg-green-700 hover:bg-green-800 text-white p-4 w-[200px]"
            onClick={() => setMatchState(3)}
          >
            Match Review →
          </Button>
        </div>
      </div>
    </div>
  );
}

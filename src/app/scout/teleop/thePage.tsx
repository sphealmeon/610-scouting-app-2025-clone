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


  return (
    <div className="flex flex-col h-screen overflow-x-hidden max-w-full mx-auto px-4">
      <div className="flex flex-row items-center justify-center gap-4 mb-4 sm:mb-8 mt-4 sm:mt-12">
        <div className="flex items-center gap-2 sm:gap-4">
          <FontAwesomeIcon icon={faGamepad} className="w-12 h-12 sm:w-16 sm:h-16" />
          <p className="text-2xl sm:text-4xl font-bold">Teleop</p>
        </div>
      </div>
      {/*<ScoutHeader name={"Teleop"}/>*/}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="w-full lg:w-1/3 p-2">
          <CoralScoringSection />
        </div>
        <div className="w-full lg:w-1/3 p-2">
          <PickupAlgae />
        </div>
        <div className="w-full lg:w-1/3 p-2 ">
          {rightPageState === "endGame" && <EndGame />}
        </div>
      </div>
      <div className="w-full mb-4">
        <div className="flex justify-between gap-4 mt-2">
          <Button 
            className="bg-red-700 hover:bg-red-800 text-white h-24 p-2 sm:p-4 w-[140px] sm:w-[200px] text-sm sm:text-base"
            onClick={() => setMatchState(1)}
          >
            ← Back to Auto
          </Button>
          <Button 
            className="bg-green-700 hover:bg-green-800 text-white h-24 p-2 sm:p-4 w-[140px] sm:w-[200px] text-sm sm:text-base"
            onClick={() => setMatchState(3)}
          >
            Match Review →
          </Button>
        </div>
      </div>
    </div>
  );
}

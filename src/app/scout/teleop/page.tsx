'use client';

import React, { useState } from "react";
import PickupCoral from "./pickupcoral";
import PickupAlgae from "./pickupalgae";
import AlgaeScoring from "./algaescoring";
import CoralScoring from "./coralscoring";
import EndGame from "./endgame";

export default function App() {
  const [leftPageState, setLeftPageState] = useState("pickupCoral");
  const [middlePageState, setMiddlePageState] = useState("pickupAlgae");
  const [rightPageState, setRightPageState] = useState("endGame");

  const handleLeftPageChange = (state: string) => {
    setLeftPageState(state);
  };

  const handleMiddlePageChange = (state: string) => {
    setMiddlePageState(state);
  };

  const handleRightPageChange = (state: string) => {
    setRightPageState(state);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col w-1/3 border-r p-4">
        {leftPageState === "reefScoring" && (
          <CoralScoring handlePageChange={handleLeftPageChange} />
        )}
        {leftPageState === "pickupCoral" && (
          <PickupCoral handlePageChange={handleLeftPageChange} />
        )}
      </div>

      <div className="flex flex-col w-1/3 border-r p-4">
        {middlePageState === "pickupAlgae" && (
          <PickupAlgae handlePageChange={handleMiddlePageChange} />
        )}
        {middlePageState === "algaeScoring" && (
          <AlgaeScoring handlePageChange={handleMiddlePageChange} />
        )}
      </div>

      <div className="flex flex-col w-1/3 border-r p-4">
        {rightPageState === "endGame" && (
          <EndGame handlePageChange={handleRightPageChange} />
        )}
      </div>
  </div>);
}

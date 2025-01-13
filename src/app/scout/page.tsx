"use client"

import { ScoutingData } from "./data";
import { useState } from "react";
import Start from "./start/thePage";
import Auto from "./auto/thePage";
import Teleop from "./teleop/thePage";

export default function Home() {
  const[matchState, setMatchState] = useState(0);
  return (
    <div>
      {matchState == 0 ? (
        <Start setMatchState={setMatchState}/>
      ) : matchState == 1 ? (
        <Auto setMatchState={setMatchState}/>
      ) : (
        <Teleop setMatchState={setMatchState}/>
      )}
    </div>
  );
}

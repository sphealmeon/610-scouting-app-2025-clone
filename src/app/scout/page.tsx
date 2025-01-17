"use client"

import { ScoutingData } from "./data";
import { useState } from "react";
import Start from "./start/thePage";
import AutoPage from "./auto/thePage";
import Teleop from "./teleop/thePage";
import MatchReviewPage from "./matchreview/thePage";
import DarkModeToggle from "../darkmode";

export default function Home() {
  const[matchState, setMatchState] = useState(0);
  return (
    <div>
     {/* <DarkModeToggle/> */}
      {matchState == 0 ? (
        <Start setMatchState={setMatchState}/>
      ) : matchState == 1 ? (
        <AutoPage setMatchState={setMatchState}/>
      ) :  matchState == 2 ? (
        <Teleop setMatchState={setMatchState}/>
      ) : (
        <MatchReviewPage setMatchState={setMatchState}/>
      )}
    </div>
  );
}

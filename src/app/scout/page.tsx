"use client"

import { useState } from "react";
import AutoPage from "./auto/thePage";
import HumanPlayerPage from "./humanplayer/thePage";
import MatchReviewPage from "./matchreview/thePage";
import Start from "./start/thePage";
import Teleop from "./teleop/thePage";

export default function Home() {
  const[matchState, setMatchState] = useState(0);
  return (
    <div>
      {matchState == 0 ? (
        <Start setMatchState={setMatchState}/>
      ) : matchState == 1 ? (
        <AutoPage setMatchState={setMatchState}/>
      ) :  matchState == 2 ? (
        <Teleop setMatchState={setMatchState}/>
      ) : matchState == 3? (
        <MatchReviewPage setMatchState={setMatchState}/>
      ) : (
        <HumanPlayerPage setMatchState={setMatchState}/>
      )}
    </div>
  );
}

"use client";

import Matchpoints from "./matchpoints";

export default function MatchReviewPage({setMatchState}: {setMatchState: Function}) {
    return (
        <div>
            <Matchpoints setMatchState={setMatchState}/>
        </div>
    );
}

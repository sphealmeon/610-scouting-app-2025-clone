"use client";

import React, { useState } from "react"
import ReviewHeader from "./header";
import AutoReview from "./autoMR/auto";
import TeleopReview from "./teleop";
import NotesReview from "./notes";

export default function MatchReviewPage({setMatchState}: {setMatchState: Function}) {
    const [pageState, setPageState] = useState("auto");

    const handlePageChange = (state: string) => {
        setPageState(state);
    };
    
    return (
        <div>
            <ReviewHeader 
                setMatchState={setMatchState} 
                handlePageChange={handlePageChange}
            />
            <div>
                {pageState === "auto" && <AutoReview/>}
                {pageState === "teleop" && <TeleopReview/>}
                {pageState === "notes" && <NotesReview/>}
            </div>
        </div>
    );
}

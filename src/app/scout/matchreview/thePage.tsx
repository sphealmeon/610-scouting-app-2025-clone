"use client";

import React, { useState } from "react"
import ReviewHeader from "./header";
import AutoReview from "./auto";
import TeleopReview from "./teleop";
import NotesReview from "./notes";

export default function MatchReviewPage({setMatchState}: {setMatchState: Function}) {
    const [pageState, setPageState] = useState("auto");

    const handlePageChange = (state: string) => {
        setPageState(state);
      };
    
    return (
        <div>
            <div className="h-screen">
                <ReviewHeader handlePageChange={handlePageChange}/>
                {pageState === "auto" && (
                <AutoReview/>
                )}
                {pageState === "teleop" && (
                <TeleopReview setMatchState={setMatchState}/>
                )}
                {pageState === "notes" && (
                <NotesReview/>
                )}
            </div>
            
        </div>
    );
}

"use client";

import React, { useState } from "react"
import ReviewHeader from "./header";
import AutoReview from "./autoMR/auto";
import TeleopReview from "./teleop";
import NotesReview from "./notes";

export default function MatchReviewPage({setMatchState}: {setMatchState: (state: number) => void}) {
    const [pageState, setPageState] = useState("auto");

    const handlePageChange = (state: string) => {
        setPageState(state);
    };
    
    return (
        <div>
            <div className="h-screen">
                <ReviewHeader 
                    setMatchState={setMatchState} 
                    handlePageChange={handlePageChange}
                />
                {pageState === "auto" && (
                <AutoReview/>
                )}
                {pageState === "teleop" && (
                <TeleopReview/>
                )}
                {pageState === "notes" && (
                <NotesReview/>
                )}
            </div>
        </div>
    );
}

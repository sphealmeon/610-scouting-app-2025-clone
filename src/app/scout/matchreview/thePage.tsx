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
        <div className="flex flex-col h-screen">
            <ReviewHeader 
                setMatchState={setMatchState} 
                handlePageChange={handlePageChange}
            />
            <div className="flex-1 overflow-y-auto">
                {pageState === "auto" && (
                    <div className="h-full">
                        <AutoReview/>
                    </div>
                )}
                {pageState === "teleop" && (
                    <div className="h-full">
                        <TeleopReview/>
                    </div>
                )}
                {pageState === "notes" && (
                    <div className="h-full">
                        <NotesReview/>
                    </div>
                )}
            </div>
        </div>
    );
}

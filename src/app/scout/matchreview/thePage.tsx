"use client";

import { useState } from "react";
import AutoReview from "./autoMR/autoMR";
import ReviewHeader from "./header";
import NotesReview from "./notes";
import TeleopReview from "./teleop";

export default function MatchReviewPage({setMatchState}: {setMatchState: Function}) {
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

"use client";

import { useState } from "react";
import AutoReview from "./autoMR/autoMR";
import ReviewHeader from "./header";
import NotesReview from "./notes";
import TeleopReview from "./teleop";

export default function MatchReviewPage({setMatchState}: {setMatchState: Function}) {
    const [pageState, setPageState] = useState("auto");

    const handlePageChange = (state: string) => {
        if(state === "continue"){
            setPageState(pageState === "auto" ? "teleop" : "notes");
        } else if (state === "back") {
            setPageState(pageState === "notes" ? "teleop" : "auto");
        } else {
            setPageState(state);
        }
    };
    
    return (
        <div>
            <div className="h-screen">
                <ReviewHeader 
                    setMatchState={setMatchState} 
                    handlePageChange={handlePageChange}
                    pageState={pageState}
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

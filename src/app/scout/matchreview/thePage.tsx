"use client";

import React, { useState } from "react"
import ReviewHeader from "./header";
import AutoReview from "./auto";
import TeleopReview from "./teleop";
import NotesReview from "./notes";
import { SubmitMatch } from "@/app/firebase/submitMatch";
import { ScoutingData } from "@/app/scout/data";
import { resetData } from "../data";

export default function MatchReviewPage({setMatchState}: {setMatchState: Function}) {
    const [pageState, setPageState] = useState("auto");

    const handlePageChange = (state: string) => {
        setPageState(state);
    };
    
    const handleSubmit = () => {
        try {
            SubmitMatch({
                team: ScoutingData.start.team,
                match: ScoutingData.start.match,
                matchData: ScoutingData
            });
            console.log("Submitting match data:", ScoutingData);
            // Optionally reset data or redirect after successful submission
            resetData();
        } catch (error) {
            console.error("Error submitting match:", error);
        }
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

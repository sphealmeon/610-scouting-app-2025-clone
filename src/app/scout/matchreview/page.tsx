"use client"
import DarkModeToggle from "@/app/darkmode";
import ReviewHeader from "./header";
import React, { useState } from "react";
import AutoReview from "./auto";
import TeleopReview from "./teleop";
import NotesReview from "./notes";

export default function MatchReviewPage(){
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
                <TeleopReview/>
                )}
                {pageState === "notes" && (
                <NotesReview/>
                )}
            </div>
            
        </div>
    );
}
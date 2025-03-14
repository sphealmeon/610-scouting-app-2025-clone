'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Popup from "./popup";

export default function ReviewHeader({
    setMatchState,
    handlePageChange,
    pageState,
}: {
    setMatchState: Function;
    handlePageChange: (page: string) => void;
    pageState: string;
}) {
    const [confirm, setConfirm] = useState(false);

    const handleConfirm = (state: boolean) => {
        setConfirm(state);
    };

    return (
        <div className="bg-black flex flex-col sm:flex-row p-4 w-full items-center gap-4 border-2 border-green-900 justify-center">
            <Button
                className="w-40 text-xl sm:text-3xl bg-red-400 hover:bg-red-300 p-2"
                onClick={() => {
                    if(pageState==="auto"){
                        setMatchState(2);
                    }else{
                        handlePageChange("back");
                    }
                }}
            >
                {pageState === "auto" ? "Return" : "Back"}
            </Button>

            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    className="w-40 text-xl sm:text-3xl bg-gray-500 hover:bg-gray-400 p-2"
                    onClick={() => handlePageChange("auto")}
                >
                    Auto
                </Button>
                <Button
                    className="w-40 text-xl sm:text-3xl bg-gray-500 hover:bg-gray-400 p-2"
                    onClick={() => 
                        handlePageChange("teleop")}
                >
                    Teleop
                </Button>
                <Button
                    className="w-40 text-xl sm:text-3xl bg-gray-500 hover:bg-gray-400 p-2"
                    onClick={() => handlePageChange("notes")}
                >
                    Notes
                </Button>
            </div> */}

            <Button
                className="w-40 text-xl sm:text-3xl bg-green-500 hover:bg-green-400 p-2"
                onClick={() => {
                    if(pageState==="notes"){
                        handleConfirm(true);
                    }else{
                        handlePageChange("continue");
                    }
                }}
            >
                {pageState === "notes" ? "Confirm" : "Continue"}
            </Button>

            {confirm && <Popup setConfirm={setConfirm} setMatchState={setMatchState}/>}
        </div>
    );
}

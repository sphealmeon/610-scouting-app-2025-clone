'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Popup from "./popup";

export default function ReviewHeader({
    setMatchState,
    handlePageChange,
}: {
    setMatchState: (state: number) => void;
    handlePageChange: (page: string) => void
}) {
    const [confirm, setConfirm] = useState(false);

    const handleConfirm = (state: boolean) => {
        setConfirm(state);
    };

    return (
        <div className="bg-gray-200 flex flex-row h-20 w-full items-center justify-center gap-20 border-2 border-green-900">
            <Button
                className="h-15 w-45 text-3xl bg-red-400 hover:bg-red-300"
                onClick={() => setMatchState(2)}
            >
                Return
            </Button>

            <Button
                className="h-15 w-40 text-3xl bg-gray-500 hover:bg-gray-400"
                onClick={() => handlePageChange("auto")}
            >
                Auto
            </Button>
            <Button
                className="h-15 w-40 text-3xl bg-gray-500 hover:bg-gray-400"
                onClick={() => handlePageChange("teleop")}
            >
                Teleop
            </Button>
            <Button
                className="h-15 w-45 text-3xl bg-gray-500 hover:bg-gray-400"
                onClick={() => handlePageChange("notes")}
            >
                Endgame + Notes
            </Button>
            <Button
                className="h-15 w-40 text-3xl bg-green-500 hover:bg-green-400"
                onClick={() => handleConfirm(true)}
            >
                Confirm
            </Button>

            {confirm && <Popup setConfirm={setConfirm} setMatchState={setMatchState}/>}
        </div>
    );
}

'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Popup from "./popup";

export default function ReviewHeader({
    setMatchState,
    handlePageChange,
}: {
    setMatchState: Function;
    handlePageChange: (page: string) => void
}) {
    const [confirm, setConfirm] = useState(false);

    const handleConfirm = (state: boolean) => {
        setConfirm(state);
    };

    return (
        <div className="bg-gray-200 flex flex-col p-4 w-full items-center gap-4 border-2 border-green-900 sticky top-0 z-50">
            <Button
                className="w-40 text-xl sm:text-3xl bg-red-400 hover:bg-red-300 p-2"
                onClick={() => setMatchState(2)}
            >
                Return
            </Button>

            <div className="flex flex-col gap-4 justify-center">
                <Button
                    className="w-40 text-xl sm:text-3xl bg-gray-500 hover:bg-gray-400 p-2"
                    onClick={() => handlePageChange("auto")}
                >
                    Auto
                </Button>
                <Button
                    className="w-40 text-xl sm:text-3xl bg-gray-500 hover:bg-gray-400 p-2"
                    onClick={() => handlePageChange("teleop")}
                >
                    Teleop
                </Button>
                <Button
                    className="w-40 text-xl sm:text-3xl bg-gray-500 hover:bg-gray-400 p-2"
                    onClick={() => handlePageChange("notes")}
                >
                    Notes
                </Button>
            </div>

            <Button
                className="w-40 text-xl sm:text-3xl bg-green-500 hover:bg-green-400 p-2"
                onClick={() => handleConfirm(true)}
            >
                Confirm
            </Button>

            {confirm && <Popup setConfirm={setConfirm} setMatchState={setMatchState}/>}
        </div>
    );
}

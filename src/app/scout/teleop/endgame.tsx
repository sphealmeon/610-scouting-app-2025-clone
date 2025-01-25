'use client';
import { ScoutingData } from "../../data";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";

export default function EndGame({setMatchState}: {setMatchState: Function}) {
    const [parkChecked, setParkChecked] = useState(ScoutingData.teleop.park === 1);
    const [shallowChecked, setShallowChecked] = useState(ScoutingData.teleop.shallow === 1);
    const [missedShallowChecked, setMissedShallowChecked] = useState(ScoutingData.teleop.missedshallow === 1);
    const [deepChecked, setDeepChecked] = useState(ScoutingData.teleop.deep === 1);
    const [missedDeepChecked, setMissedDeepChecked] = useState(ScoutingData.teleop.misseddeep === 1);

    const handleParkChange = (checked: boolean) => {
        setParkChecked(checked);
        ScoutingData.teleop.park = checked ? 1 : 0;
    };

    const handleShallowChange = (checked: boolean) => {
        setShallowChecked(checked);
        ScoutingData.teleop.shallow = checked ? 1 : 0;
    };

    const handleMissedShallowChange = (checked: boolean) => {
        setMissedShallowChecked(checked);
        ScoutingData.teleop.missedshallow = checked ? 1 : 0;
    };

    const handleDeepChange = (checked: boolean) => {
        setDeepChecked(checked);
        ScoutingData.teleop.deep = checked ? 1 : 0;
    };

    const handleMissedDeepChange = (checked: boolean) => {
        setMissedDeepChecked(checked);
        ScoutingData.teleop.misseddeep = checked ? 1 : 0;
    };

    return (
        <div className="flex flex-col gap-4 items-center min-h-screen p-6">
            <h1 className="font-sans text-2xl">Endgame</h1>
            <div className="flex flex-col gap-10 border-4 border-gray-200 bg-gray-100 rounded-lg w-full flex-grow justify-center p-6">
                <label className="flex items-center gap-4">
                    <Checkbox
                        className="h-6 w-6"
                        checked={parkChecked}
                        disabled={shallowChecked || deepChecked} 
                        onCheckedChange={handleParkChange}
                    />
                    <span className="text-3xl">Park</span>
                </label>

                <label className="flex items-center gap-4">
                    <Checkbox 
                        className="h-6 w-6"
                        checked={shallowChecked}
                        disabled={parkChecked || missedShallowChecked || deepChecked} 
                        onCheckedChange={handleShallowChange}
                    />
                    <span className="text-3xl">Shallow Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <Checkbox
                        className="h-6 w-6"
                        checked={missedShallowChecked}
                        disabled={shallowChecked} 
                        onCheckedChange={handleMissedShallowChange}
                    />
                    <span className="text-3xl">Missed Shallow Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <Checkbox
                        className="h-6 w-6"
                        checked={deepChecked}
                        disabled={parkChecked || shallowChecked || missedDeepChecked} 
                        onCheckedChange={handleDeepChange}
                    />
                    <span className="text-3xl">Deep Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <Checkbox
                        className="h-6 w-6"
                        checked={missedDeepChecked}
                        disabled={deepChecked} 
                        onCheckedChange={handleMissedDeepChange}
                    />
                    <span className="text-3xl">Missed Deep Cage</span>
                </label>
            </div>

            {/* Buttons Section */}
            <div className="mt-auto flex flex-col gap-4 w-full">
                    <Button 
                        className="h-20 bg-blue-400 hover:bg-blue-500 text-white font-bold text-3xl"
                        onClick={() => setMatchState(3)}
                    >
                        Match Review
                    </Button>
                    <Button 
                        className="h-20 bg-green-400 hover:bg-green-500 text-white font-bold text-3xl"
                        onClick={() => setMatchState(1)}
                    >
                        Back To Auto
                    </Button>
                </div>  
        </div>
    );
}

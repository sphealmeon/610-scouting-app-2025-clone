'use client';

import { Checkbox } from "@/components/ui/checkbox";
import Algae from "./autoalgae";
import Reef from "./autoreef";
import Leave from "./leave";
import { useState } from "react";
import { ScoutingData } from "../data";

export default function AutoPage({setMatchState}: {setMatchState: Function}){
    const [leaveState, setLeaveState] = useState(ScoutingData.auto.leave);

    const handleLeaveChange = (newValue: number) => {
        setLeaveState(newValue);
        ScoutingData.auto.leave = newValue;
    };

    return(
        <div className="flex">
            <div className="w-1/2 p-4">
                <Reef setMatchState={setMatchState} setLeaveState={handleLeaveChange} />
            </div>
            <div className="w-1/2 p-4"> 
                <Leave leaveState={leaveState} setLeaveState={handleLeaveChange} />
            </div>
            <div className="w-1/2 p-4">
                <Algae setLeaveState={handleLeaveChange} />
            </div>
        </div>
    );
}

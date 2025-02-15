'use client';

import Algae from "./autoalgae";
import Reef from "./autoreef";
import Leave from "./leave";
import { useState } from "react";
import { ScoutingData } from "../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function AutoPage({setMatchState}: {setMatchState: (state: number) => void}){
    const [leaveState, setLeaveState] = useState(ScoutingData.auto.leave);

    const handleLeaveChange = (newValue: number) => {
        setLeaveState(newValue);
        ScoutingData.auto.leave = newValue;
    };

    return(
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden max-w-7xl mx-auto">
            <div className="flex flex-row items-center justify-center gap-8 mb-8">
                <div className="flex items-center gap-4 mt-12">
                    <FontAwesomeIcon icon={faRobot} className="w-16 h-16" />
                    <p className="text-4xl font-bold">Autonomous</p>
                </div>
            </div>
            
            <div className="flex justify-center gap-4">
                <div className="w-1/2 p-2">
                    <Reef setLeaveState={handleLeaveChange} />
                </div>
                <div className="w-1/2 p-2"> 
                    <Leave leaveState={leaveState} setLeaveState={handleLeaveChange} setMatchState={setMatchState}/>
                </div>
                <div className="w-1/2 p-2">
                    <Algae setLeaveState={handleLeaveChange} />
                </div>
            </div>
        </div>
    );
}

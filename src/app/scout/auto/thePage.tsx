'use client';

import Algae from "./autoalgae";
import Reef from "./autoreef";
import Leave from "./leave";
import { useState } from "react";
import { ScoutingData } from "../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function AutoPage({setMatchState}: {setMatchState: Function}){
    const [leaveState, setLeaveState] = useState(ScoutingData.auto.leave);

    const handleLeaveChange = (newValue: number) => {
        setLeaveState(newValue);
        ScoutingData.auto.leave = newValue;
    };

    // Get alliance color from ScoutingData
    const allianceColor = ScoutingData.start.alliance === 'red' ? 'text-red-500' : 'text-blue-500';

    return(
        <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full mx-auto px-4">
            <div className="flex flex-row items-center justify-center gap-4 mb-4 sm:mb-8 mt-4 sm:mt-12">
                <div className="flex items-center gap-2 sm:gap-4">
                    <FontAwesomeIcon icon={faRobot} className="w-12 h-12 sm:w-16 sm:h-16" />
                    <p className={`text-2xl sm:text-4xl font-bold ${allianceColor}`}>Autonomous {ScoutingData.start.team}</p>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row flex-1 gap-4 overflow-y-auto">
                <div className="w-full lg:w-1/3 p-2">
                    <Reef setLeaveState={handleLeaveChange} />
                </div>
                <div className="w-full lg:w-1/3 p-2"> 
                    <Leave leaveState={leaveState} setLeaveState={handleLeaveChange} setMatchState={setMatchState}/>
                </div>
                <div className="w-full lg:w-1/3 p-2">
                    <Algae setLeaveState={handleLeaveChange} />
                </div>
            </div>
        </div>
    );
}

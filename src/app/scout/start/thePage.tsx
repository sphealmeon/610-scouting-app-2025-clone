'use client';

import React, { useState, useEffect } from "react";
import RobotPosition from "./robotposition";
import MatchSelect from "./matchselect";
import ScoutSelect from "./scoutselect";
import Layout from "./layout";
import { ScoutingData } from "../data";

export default function StartPage({setMatchState}: {setMatchState: Function}){
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const checkReadyState = () => {
            const ready = (
                ScoutingData.start.position != "" && 
                ScoutingData.start.match != 0 && 
                ScoutingData.start.team != 0
            );
            setIsReady(ready);
        };

        // Initial check
        checkReadyState();

        // Set up an interval to check periodically
        const interval = setInterval(checkReadyState, 100); // Check every 100ms

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []); // Empty dependency array since we're checking ScoutingData directly

    return(
        <>
            {/* <ScoutHeader name={"Start"}/> */}
            <div className="relative flex flex-col items-center space-y-8 p-8">
                <MatchSelect />
                <RobotPosition />
                <ScoutSelect setMatchState={setMatchState} />
                <Layout />
            </div>
        </>
    );
}


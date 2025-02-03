'use client';

import React from "react";
import RobotPosition from "./robotposition";
import MatchSelect from "./matchselect";
import ScoutSelect from "./scoutselect";
import ScoutHeader from "../components/scoutHeader";
import ChangeButton from "../components/changeButton";

export default function StartPage({setMatchState}: {setMatchState: Function}){
    return(
        <>
            {/*ScoutHeader name={"Start"}/>*/}
            <div className="relative grid grid-cols-3 gap-4 p-8">
                <div className="col-span-1">
                    <RobotPosition />
                </div>
                <div className="col-span-1 flex justify-center">
                    <MatchSelect />
                </div>
                <div className="col-span-1 flex justify-center">
                    <ScoutSelect setMatchState={setMatchState} />
                </div>
            </div>
            
        </>
    );
}


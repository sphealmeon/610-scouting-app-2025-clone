import ReefMR from "./reefMR";
import LeaveMR from "./leaveMR";
import AlgaeMR from "./algaeMR";
import { useState } from "react";
import { ScoutingData } from "../../data";

export default function AutoReview() {
    const [leaveState, setLeaveState] = useState(ScoutingData.auto.leave);

    const handleLeaveChange = (newValue: number) => {
        setLeaveState(newValue);
        ScoutingData.auto.leave = newValue;
    };

    return(
        <div className="grid grid-cols-3 gap-4 p-4 w-full">
            <div className="col-span-1">
                <ReefMR setLeaveState={handleLeaveChange} />
            </div>
            <div className="col-span-1"> 
                <LeaveMR leaveState={leaveState} setLeaveState={handleLeaveChange} />
            </div>
            <div className="col-span-1">
                <AlgaeMR setLeaveState={handleLeaveChange} />
            </div>
        </div>
    );
}
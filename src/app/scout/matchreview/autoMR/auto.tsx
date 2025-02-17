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
        <div className="flex flex-col gap-8 p-4 w-full overflow-y-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
                <div className="w-full flex justify-center min-h-[500px]">
                    <ReefMR setLeaveState={handleLeaveChange} />
                </div>
                <div className="w-full flex justify-center min-h-[500px]"> 
                    <LeaveMR leaveState={leaveState} setLeaveState={handleLeaveChange} />
                </div>
                <div className="w-full flex justify-center min-h-[500px]">
                    <AlgaeMR setLeaveState={handleLeaveChange} />
                </div>
            </div>
        </div>
    );
}
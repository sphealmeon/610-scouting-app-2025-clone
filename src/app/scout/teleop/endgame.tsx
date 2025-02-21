import { ScoutingData } from "@/app/scout/data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";

export default function EndGame() {
    const [endgameState, setEndgameState] = useState("none"); // none, park, shallow, deep
    const [missedShallowChecked, setMissedShallowChecked] = useState(ScoutingData.teleop.missedShallow === 1);
    const [missedDeepChecked, setMissedDeepChecked] = useState(ScoutingData.teleop.missedDeep === 1);

    const handleEndgameStateChange = (state: string) => {
        setEndgameState(state);
        
        // Reset all states
        ScoutingData.teleop.park = 0;
        ScoutingData.teleop.shallow = 0;
        ScoutingData.teleop.deep = 0;

        // Set the appropriate state
        switch(state) {
            case "park":
                ScoutingData.teleop.park = 1;
                break;
            case "shallow":
                ScoutingData.teleop.shallow = 1;
                break;
            case "deep":
                ScoutingData.teleop.deep = 1;
                break;
        }
    };

    const handleMissedShallowChange = (checked: boolean) => {
        setMissedShallowChecked(checked);
        ScoutingData.teleop.missedShallow = checked ? 1 : 0;
    };

    const handleMissedDeepChange = (checked: boolean) => {
        setMissedDeepChecked(checked);
        ScoutingData.teleop.missedDeep = checked ? 1 : 0;
    };

    return (
        <div className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex-1 h-[1px] bg-white max-w-[80px]"></div>
                <h1 className="text-xl">Endgame</h1>
                <div className="flex-1 h-[1px] bg-white max-w-[80px]"></div>
            </div>

            <div className="flex flex-col gap-4 flex-1 px-4">
                {/* Checkboxes Section */}
                <div className="flex flex-col gap-2 mb-4">
                    {endgameState === "shallow" && (
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={true}
                                disabled={true}
                                className="h-5 w-5"
                            />
                            <span>Shallow Climb</span>
                        </label>
                    )}
                    {endgameState === "deep" && (
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={true}
                                disabled={true}
                                className="h-5 w-5"
                            />
                            <span>Deep Climb</span>
                        </label>
                    )}
                    {endgameState !== "shallow" && endgameState !== "deep" && (
                        <>
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    checked={missedShallowChecked}
                                    onCheckedChange={handleMissedShallowChange}
                                    className="h-5 w-5"
                                />
                                <span>Missed Shallow Cage</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    checked={missedDeepChecked}
                                    onCheckedChange={handleMissedDeepChange}
                                    className="h-5 w-5"
                                />
                                <span>Missed Deep Cage</span>
                            </label>
                        </>
                    )}
                </div>

                {/* Ended on section */}
                <div className="flex flex-col gap-2">
                    <p className="text-lg">Ended on:</p>
                    <div className="grid grid-cols-4 gap-2">
                        <Button 
                            variant={endgameState === "none" ? "secondary" : "default"}
                            onClick={() => handleEndgameStateChange("none")}
                            className="p-4"
                        >
                            None
                        </Button>
                        <Button 
                            variant={endgameState === "park" ? "secondary" : "default"}
                            onClick={() => handleEndgameStateChange("park")}
                            className="p-4"
                        >
                            Park
                        </Button>
                        <Button 
                            variant={endgameState === "shallow" ? "secondary" : "default"}
                            onClick={() => handleEndgameStateChange("shallow")}
                            className="p-4"
                        >
                            Shallow
                        </Button>
                        <Button 
                            variant={endgameState === "deep" ? "secondary" : "default"}
                            onClick={() => handleEndgameStateChange("deep")}
                            className="p-4"
                        >
                            Deep
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

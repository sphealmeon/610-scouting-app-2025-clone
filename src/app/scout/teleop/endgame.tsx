import { ScoutingData } from "@/app/scout/data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState, useEffect } from "react";

export default function EndGame() {
    const [endgameState, setEndgameState] = useState("none"); // none, park, shallow, deep
    const [missedShallowChecked, setMissedShallowChecked] = useState(ScoutingData.teleop.missedShallow === 1);
    const [missedDeepChecked, setMissedDeepChecked] = useState(ScoutingData.teleop.missedDeep === 1);
    const [hangStartTime, setHangStartTime] = useState<number | null>(null);
    const [hangType, setHangType] = useState<'shallow' | 'deep' | null>(null);
    const [hangInProgress, setHangInProgress] = useState(false);
    const [fouls, setFouls] = useState(ScoutingData.teleop.fouls);

    useEffect(() => {
        ScoutingData.teleop.fouls = fouls;
    }, [fouls]);

    const handleEndgameStateChange = (state: string) => {
        // If there's a hang in progress, calculate the time
        if (hangInProgress && hangStartTime && (state === 'shallow' || state === 'deep')) {
            const endTime = Date.now();
            const hangTime = endTime - hangStartTime;
            
            if (hangType === 'shallow' && state === 'shallow') {
                // Update shallow hang time
                ScoutingData.teleop.shallowAverageHangTime = hangTime;
                console.log(`Shallow hang time: ${hangTime}ms`);
            } else if (hangType === 'deep' && state === 'deep') {
                // Update deep hang time
                ScoutingData.teleop.deepAverageHangTime = hangTime;
                console.log(`Deep hang time: ${hangTime}ms`);
            }
            
            // Reset hang state
            setHangInProgress(false);
            setHangStartTime(null);
            setHangType(null);
        }
        
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

    const startHangTimer = (type: 'shallow' | 'deep') => {
        setHangStartTime(Date.now());
        setHangType(type);
        setHangInProgress(true);
    };

    const incrementFouls = () => {
        setFouls(prev => {
            const newValue = prev + 1;
            ScoutingData.teleop.fouls = newValue;
            return newValue;
        });
    };

    const decrementFouls = () => {
        if (fouls > 0) {
            setFouls(prev => {
                const newValue = prev - 1;
                ScoutingData.teleop.fouls = newValue;
                return newValue;
            });
        }
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

                {/* Hang Timer Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Button 
                        onClick={() => startHangTimer('shallow')}
                        className={`p-4 ${hangInProgress && hangType === 'shallow' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-700 hover:bg-green-600'}`}
                        disabled={hangInProgress && hangType !== 'shallow'}
                    >
                        {hangInProgress && hangType === 'shallow' ? 'Timing Shallow Hang...' : 'Start Shallow Hang'}
                    </Button>
                    <Button 
                        onClick={() => startHangTimer('deep')}
                        className={`p-4 ${hangInProgress && hangType === 'deep' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-700 hover:bg-green-600'}`}
                        disabled={hangInProgress && hangType !== 'deep'}
                    >
                        {hangInProgress && hangType === 'deep' ? 'Timing Deep Hang...' : 'Start Deep Hang'}
                    </Button>
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
                            className={`p-4 ${hangInProgress && hangType === 'shallow' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                        >
                            Shallow
                        </Button>
                        <Button 
                            variant={endgameState === "deep" ? "secondary" : "default"}
                            onClick={() => handleEndgameStateChange("deep")}
                            className={`p-4 ${hangInProgress && hangType === 'deep' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                        >
                            Deep
                        </Button>
                    </div>
                </div>

                {/* Fouls Counter Section */}
                <div className="flex flex-col items-center mt-8">
                    <h2 className="text-lg font-semibold mb-2">Fouls: {fouls}</h2>
                    <div className="flex gap-4">
                        <Button
                            onClick={decrementFouls}
                            className="w-16 h-16 text-2xl bg-red-700 hover:bg-red-600 text-white"
                        >
                            -
                        </Button>
                        <Button
                            onClick={incrementFouls}
                            className="w-16 h-16 text-2xl bg-green-700 hover:bg-green-600 text-white"
                        >
                            +
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

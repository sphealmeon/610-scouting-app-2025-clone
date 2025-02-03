import { Button } from "@/components/ui/button";
import { ScoutingData, resetData } from "../data";

export default function HumanPlayerMain({ setMatchState }: { setMatchState: Function }) {
    const handleExit = () => {
        resetData();
        setMatchState(0);
    };

    const handleBlueScored = () => {
        ScoutingData.humanPlayer.blueScored++;
    };

    const handleRedScored = () => {
        ScoutingData.humanPlayer.redScored++;
    };

    const handleBlueMissed = () => {
        ScoutingData.humanPlayer.blueMissed++;
    };

    const handleRedMissed = () => {
        ScoutingData.humanPlayer.redMissed++;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <p className="text-3xl mb-6 font-bold text-center">Human Player</p>
            <div className="grid grid-cols-2 gap-4 w-full p-6 border-4 rounded-lg border-gray-300 bg-gray-200">
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-blue-500 hover:bg-blue-400 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleBlueScored}
                >
                    Blue Scored
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-white text-center cursor-pointer rounded-lg"
                    onClick={handleRedScored}
                >
                    Red Scored
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-blue-400 hover:bg-blue-300 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleBlueMissed}
                >
                    Blue Missed
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-400 hover:bg-red-300 text-white text-center cursor-pointer rounded-lg"
                    onClick={handleRedMissed}
                >
                    Red Missed
                </div>
                <Button className="h-20 text-xl font-bold" onClick={handleExit}>
                    Back to Start
                </Button>
                <Button className="h-20 text-xl font-bold" onClick={handleExit}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

import { ScoutingData } from "@/app/scout/data";
import { useState } from "react";

export default function RobotPosition() {
    // State for scouting data (we assume this is part of a larger context or is lifted to a higher component)
    const [scoutingData, setScoutingData] = useState({
        start: {
            position: ""
        }
    });

    // Handle click on position
    const handleClick = (position: string) => {
        //Write to data: match number
        ScoutingData.start.position=position;
        
        // Update scouting data with the selected position
        setScoutingData((prevState) => ({
            ...prevState,
            start: {
                ...prevState.start,
                position: position.toLowerCase() // Set position in lowercase (i.e., "far", "middle", or "close")
            }
        }));
    };

    return (
        <div className="flex flex-col justify-center items-start h-[90vh] ml-4 my-4">
            <div
                className="flex-1 bg-gray-300 text-black flex justify-center items-center cursor-pointer hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3"
                onClick={() => handleClick('Far')}
            >
                Far
            </div>
            <div
                className="flex-1 bg-gray-300 text-black flex justify-center items-center cursor-pointer hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3"
                onClick={() => handleClick('Middle')}
            >
                Middle
            </div>
            <div
                className="flex-1 bg-gray-300 text-black flex justify-center items-center cursor-pointer hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3"
                onClick={() => handleClick('Close')}
            >
                Close
            </div>
        </div>
    );
}

import { ScoutingData } from "@/app/scout/data";
import { useState } from "react";

export default function RobotPosition() {
    const [selectedPosition, setSelectedPosition] = useState<string>("");

    // Handle click on position
    const handleClick = (position: string) => {
        ScoutingData.start.position = position;
        setSelectedPosition(position);
    };

    return (
        <div className="flex flex-col justify-center items-start h-[90vh] ml-4 my-4">
            <div
                className={`flex-1 ${selectedPosition === 'Far' ? 'bg-green-500' : 'bg-gray-300'} 
                text-black flex justify-center items-center cursor-pointer 
                hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3`}
                onClick={() => handleClick('Far')}
            >
                Far
            </div>
            <div
                className={`flex-1 ${selectedPosition === 'Middle' ? 'bg-green-500' : 'bg-gray-300'} 
                text-black flex justify-center items-center cursor-pointer 
                hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3`}
                onClick={() => handleClick('Middle')}
            >
                Middle
            </div>
            <div
                className={`flex-1 ${selectedPosition === 'Close' ? 'bg-green-500' : 'bg-gray-300'} 
                text-black flex justify-center items-center cursor-pointer 
                hover:bg-gray-400 active:opacity-60 transition-colors border-2 border-black w-2/3`}
                onClick={() => handleClick('Close')}
            >
                Close
            </div>
        </div>
    );
}

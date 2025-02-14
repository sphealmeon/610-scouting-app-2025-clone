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
        <div className="flex flex-row justify-center items-start items-center gap-x-1">
            <div
                className={`flex-1 ${selectedPosition === 'Far' ? 'bg-green-700' : 'bg-black-300'} 
                text-gray-300 text-xl flex justify-center items-center cursor-pointer 
                hover:bg-gray-300 hover:text-black active:opacity-60 transition-colors 
                border-2 border-gray-300 w-20 py-3 rounded-lg`}
                onClick={() => handleClick('Far')}
            >
                Far
            </div>
            <div
                className={`flex-1 ${selectedPosition === 'Middle' ? 'bg-green-700' : 'bg-black-300'} 
                text-gray-300 text-xl flex justify-center items-center cursor-pointer 
                hover:bg-gray-300 hover:text-black active:opacity-60 transition-colors 
                border-2 border-gray-300 w-20 py-3 rounded-lg`}
                onClick={() => handleClick('Middle')}
            >
                Middle
            </div>
            <div
                className={`flex-1 ${selectedPosition === 'Close' ? 'bg-green-700' : 'bg-black-300'} 
                text-gray-300 text-xl flex justify-center items-center cursor-pointer 
                hover:bg-gray-300 hover:text-black active:opacity-60 transition-colors 
                border-2 border-gray-300 w-20 py-3 rounded-lg`}
                onClick={() => handleClick('Close')}
            >
                Close
            </div>
        </div>
    );
}

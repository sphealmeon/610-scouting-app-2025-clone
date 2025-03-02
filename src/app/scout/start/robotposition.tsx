import { ScoutingData } from "@/app/scout/data";
import { useState, useEffect } from "react";
import { scoringTableSide } from "@/app/globalVars"; // Import the global variable

export default function RobotPosition() {
    const [selectedPosition, setSelectedPosition] = useState<string>("");

    // Handle click on position
    const handleClick = (position: string) => {
        // If scoring table side is true, swap Far and Close
        if (scoringTableSide && (position === 'Far' || position === 'Close')) {
            const swappedPosition = position === 'Far' ? 'Close' : 'Far';
            ScoutingData.start.position = swappedPosition;
            setSelectedPosition(position); // Store the UI position, not the swapped one
        } else {
            ScoutingData.start.position = position;
            setSelectedPosition(position);
        }
    };

    // Update the display based on the actual stored position
    useEffect(() => {
        if (ScoutingData.start.position) {
            // If scoring table side is true, we need to display the opposite of what's stored
            if (scoringTableSide && (ScoutingData.start.position === 'Far' || ScoutingData.start.position === 'Close')) {
                const displayPosition = ScoutingData.start.position === 'Far' ? 'Close' : 'Far';
                setSelectedPosition(displayPosition);
            } else {
                setSelectedPosition(ScoutingData.start.position);
            }
        }
    }, []);

    // Helper function to determine if a button should be highlighted
    const isButtonHighlighted = (buttonPosition: string) => {
        if (scoringTableSide && (buttonPosition === 'Far' || buttonPosition === 'Close')) {
            // For Far and Close buttons when scoring table side is true
            const oppositePosition = buttonPosition === 'Far' ? 'Close' : 'Far';
            return ScoutingData.start.position === oppositePosition;
        } else {
            // Normal case
            return ScoutingData.start.position === buttonPosition;
        }
    };

    return (
        <div className="flex flex-row justify-center items-start items-center gap-x-1">
            <div
                className={`flex-1 ${isButtonHighlighted('Far') ? 'bg-green-700' : 'bg-black-300'} 
                text-gray-300 text-xl flex justify-center items-center cursor-pointer 
                hover:bg-gray-300 hover:text-black active:opacity-60 transition-colors 
                border-2 border-gray-300 w-20 py-3 rounded-lg`}
                onClick={() => handleClick('Far')}
            >
                Far
            </div>
            <div
                className={`flex-1 ${isButtonHighlighted('Middle') ? 'bg-green-700' : 'bg-black-300'} 
                text-gray-300 text-xl flex justify-center items-center cursor-pointer 
                hover:bg-gray-300 hover:text-black active:opacity-60 transition-colors 
                border-2 border-gray-300 w-20 py-3 rounded-lg`}
                onClick={() => handleClick('Middle')}
            >
                Middle
            </div>
            <div
                className={`flex-1 ${isButtonHighlighted('Close') ? 'bg-green-700' : 'bg-black-300'} 
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

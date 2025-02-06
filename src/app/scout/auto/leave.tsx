import { useState } from "react";
import { ScoutingData } from "../data";
import { Checkbox } from "@/components/ui/checkbox";

const Leave = () => {
    const [isChecked, setIsChecked] = useState(ScoutingData.auto.leave === 1);

    const handleCheckboxClick = () => {
        // Toggle the checked state
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);

        // Update ScoutingData.auto.leave based on the new state
        ScoutingData.auto.leave = newCheckedState ? 1 : 0;
    };

    return (
        <div className="w-full p-4 items-center justify-center">
            <label className="flex items-center">
                <Checkbox
                    checked={isChecked}
                    onClick={handleCheckboxClick} // Handle click event
                    className="mr-2"
                />
                Leave
            </label>

            <img 
                src = "field2.png"
                className="w-full h-full"
            />

        </div>
    );
};

export default Leave;

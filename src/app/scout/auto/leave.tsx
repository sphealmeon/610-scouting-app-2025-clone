import { useState } from "react";
import { ScoutingData } from "../data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const Leave = () => {
    const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: "",
    });

    const handleLeaveClick = () => {
        if (ScoutingData.auto.leave === 0) {
            ScoutingData.auto.leave = 1;
            showPopup("Robot left starting zone");
        } else {
            ScoutingData.auto.leave = 0;
            showPopup("Undid robot leaving");
        }
    };

    const showPopup = (message: string) => {
        setPopup({ visible: true, message });
        setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
    };

    return (
        <div className="flex flex-col items-center p-4 space-y-4">
            <h1 className="text-xl font-bold">Auto Leave</h1>
            <Button
                onClick={handleLeaveClick}
                className={`w-32 h-32 text-2xl rounded-full ${
                    ScoutingData.auto.leave > 0 ? "bg-green-500" : "bg-red-500"
                } text-white`}
            >
                {ScoutingData.auto.leave > 0 ? "Left" : "Not Left"}
            </Button>

                Alliance: {ScoutingData.start.alliance}

            {popup.visible && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2
                              bg-black bg-opacity-80 text-white px-4 py-2 rounded">
                    {popup.message}
                </div>
            )}
        </div>
    );
};

export default Leave;

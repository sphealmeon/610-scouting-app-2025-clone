import { useState } from "react";
import { ScoutingData } from "../data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const Leave = ({ leaveState, setLeaveState }: { 
    leaveState: number, 
    setLeaveState: (value: number) => void 
}) => {
    const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: "",
    });

    const handleLeaveClick = () => {
        const newValue = leaveState === 0 ? 1 : 0;
        setLeaveState(newValue);
        showPopup(newValue === 1 ? "Robot left starting zone" : "Undid robot leaving");
    };

    const showPopup = (message: string) => {
        setPopup({ visible: true, message });
        setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-4">
            <h1 className="text-xl font-bold">Auto Leave</h1>
            <Button
                onClick={handleLeaveClick}
                className={`w-32 h-32 text-2xl rounded-full ${
                    leaveState > 0 ? "bg-green-500" : "bg-red-500"
                } text-white`}
            >
                Leave?
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

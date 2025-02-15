import { useState } from "react";
import { ScoutingData } from "../data";
import { Button } from "@/components/ui/button";

const Leave = ({ leaveState, setLeaveState, setMatchState }: { 
    leaveState: number, 
    setLeaveState: (value: number) => void 
    setMatchState: Function,
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
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 mb-4">
            <h1 className="text-xl mb-4 font-bold">Auto Leave</h1>
            <Button
                onClick={handleLeaveClick}
                className={`w-32 h-32 mb-8 text-2xl rounded-full ${
                    leaveState > 0 ? "bg-[#149632]" : "bg-[#C8442E]"
                } text-white`}
            >
                Leave
            </Button>
            <Button className="w-40 h-16 text-xl mt-6 mb-4"
                onClick={() => setMatchState(0)} 
                style={{ backgroundColor: "#C8442E" }} // Changed to red color
            >
                Back to Start
            </Button>
            <Button className="w-40 h-16 text-xl m-4"
                onClick={() => setMatchState(2)} 
                style={{ backgroundColor: "#149632" }} // Kept green color
            >
                To Teleop
            </Button>
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

import { Button } from "@/components/ui/button";

export default function HumanPlayerMain({ setMatchState }: { setMatchState: Function }) {
    const handleClick = () => {
        // Add logic for handling clicks
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <p className="text-3xl mb-6 font-bold text-center">Human Player</p>
            <div className="grid grid-cols-2 gap-4 w-full p-6 border-4 rounded-lg border-gray-300 bg-gray-200">
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-blue-500 hover:bg-blue-400 text-white text-center cursor-pointer rounded-lg"
                    onClick={() => handleClick()}
                >
                    Blue Scored
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-500 hover:bg-red-400 text-white text-white text-center cursor-pointer rounded-lg"
                    onClick={() => handleClick()}
                >
                    Red Scored
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-blue-400 hover:bg-blue-300 text-white text-center cursor-pointer rounded-lg"
                    onClick={() => handleClick()}
                >
                    Blue Missed
                </div>
                <div
                    className="flex items-center justify-center h-60 text-3xl font-bold bg-red-400 hover:bg-red-300 text-white text-center cursor-pointer rounded-lg"
                    onClick={() => handleClick()}
                >
                    Red Missed
                </div>
                <Button className="h-20 text-xl font-bold" onClick={() => setMatchState(0)}>
                    Back to Start
                </Button>
                <Button className="h-20 text-xl font-bold" onClick={() => setMatchState(0)}>
                    Submit
                </Button>
            </div>
            
        </div>
    );
}

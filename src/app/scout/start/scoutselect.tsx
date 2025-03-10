"use client"

import { Button } from "@/components/ui/button";
import { ScoutingData } from "@/app/scout/data";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScoutSelect({ setMatchState }: { setMatchState: Function }) {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkReadyState = () => {
            const ready = (
                ScoutingData.start.scoutName !== "" &&
                ScoutingData.start.position !== "" &&
                ScoutingData.start.match !== 0 &&
                ScoutingData.start.team !== 0
            );
            setIsReady(ready);
        };

        const interval = setInterval(checkReadyState, 100);
        return () => clearInterval(interval);
    }, []);

    const handleRobotScout = () => {
        // Check for secret scout names
        if (ScoutingData.start.scoutName === "admin") {
            // Redirect to admin page
            router.push("/admin");
            return;
        }
        
        setMatchState("auto");
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <Button
                className={`mb-7 w-48 text-xl py-6 px-4 bg-green-900 text-white hover:bg-green-800 border-2 border-green-900`}
                onClick={handleRobotScout}
                disabled={!isReady}
            >
                Robot Scout
            </Button>
            <Button
                className="w-48 text-xl py-6 px-4 bg-green-900 text-white hover:bg-green-800 border-2 border-green-900"
                onClick={() => setMatchState(4)}
            >
                HP Scout
            </Button>
        </div>
    );
}

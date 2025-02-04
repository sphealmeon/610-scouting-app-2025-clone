import { Button } from "@/components/ui/button";
import { ScoutingData } from "@/app/scout/data";
import { useState, useEffect } from "react";

export default function ScoutSelect({setMatchState}: {setMatchState: Function}){
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const checkReadyState = () => {
            const ready = (
                ScoutingData.start.position != "" && 
                ScoutingData.start.match != 0 && 
                ScoutingData.start.team != 0
            );
            setIsReady(ready);
        };

        const interval = setInterval(checkReadyState, 100);
        return () => clearInterval(interval);
    }, []);

    return(
        <div className="flex flex-col justify-center items-center space-y-4">
            <Button 
                className="mb-20 text-xl py-6 px-8"
                onClick={() => setMatchState(1)}
                disabled={!isReady}
            >
                Robot Scout
            </Button>
            <Button 
                className="text-xl py-6 px-8"
                onClick={() => setMatchState(4)}
            >
                HP Scout
            </Button>
        </div>
    );
}
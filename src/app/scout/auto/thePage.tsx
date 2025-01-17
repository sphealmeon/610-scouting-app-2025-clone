'use client';

import { Button } from "@/components/ui/button";
import Algae from "./autoalgae";
import Reef from "./autoreef";


export default function AutoPage({setMatchState}: {setMatchState: Function}){
    return(
        <div className="flex">
            <div className="w-1/2 p-4">
                <Reef setMatchState={setMatchState} />
            </div>
            <div className="w-1/2 p-4">
                <Algae />
            </div>
            
        </div>
    );
}

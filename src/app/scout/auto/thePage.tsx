'use client';

import { Checkbox } from "@/components/ui/checkbox";
import Algae from "./autoalgae";
import Reef from "./autoreef";
import Leave from "./leave";


export default function AutoPage({setMatchState}: {setMatchState: Function}){
    return(
        <div className="flex">
            <div className="w-1/2 p-4">
                <Reef setMatchState={setMatchState} />
            </div>
            <div className="w-1/2 p-4"> 
                <Leave />
            </div>
            <div className="w-1/2 p-4">
                <Algae />
            </div>
        </div>
    );
}

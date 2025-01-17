'use client';

import Algae from "./autoalgae";
import Reef from "./autoreef";


export default function StartPage(){
    return(
        <div className="flex">
            <div className="w-1/2 p-4">
                <Reef />
            </div>
            <div className="w-1/2 p-4">
                <Algae />
            </div>
        </div>
    );
}

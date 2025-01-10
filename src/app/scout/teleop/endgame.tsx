'use client';

import { Button } from "@/components/ui/button";
import React from "react";

export default function EndGame() {
    return (
        <div className="flex flex-col items-center min-h-screen p-6">
            {/* Title Section */}
            <h1 className="font-sans text-2xl">Endgame</h1>
            
            {/* Checkbox Section */}
            <div className="flex flex-col gap-10 w-full flex-grow justify-start p-6">
                <label className="flex items-center gap-4">
                    <input type="checkbox" className="cursor-pointer w-6 h-6" />
                    <span className="text-3xl">Park</span>
                </label>

                <label className="flex items-center gap-4">
                    <input type="checkbox" className="cursor-pointer w-6 h-6" />
                    <span className="text-3xl">Shallow Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <input type="checkbox" className="cursor-pointer w-6 h-6" />
                    <span className="text-3xl">Missed Shallow Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <input type="checkbox" className="cursor-pointer w-6 h-6" />
                    <span className="text-3xl">Deep Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <input type="checkbox" className="cursor-pointer w-6 h-6" />
                    <span className="text-3xl">Missed Deep Cage</span>
                </label>
            </div>
            <div className="mt-auto flex flex-col gap-4 w-full">
                    <Button className="h-20 bg-blue-400 hover:bg-blue-500 text-white font-bold text-3xl">
                        Match Review
                    </Button>
                    <Button className="h-20 bg-green-400 hover:bg-green-500 text-white font-bold text-3xl">
                        Back To Auto
                    </Button>
                </div>  
        </div>
    );
}
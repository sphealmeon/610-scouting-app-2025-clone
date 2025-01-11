'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

export default function EndGame() {
    // State for checkboxes
    const [parkChecked, setParkChecked] = useState(false);
    const [shallowChecked, setShallowChecked] = useState(false);
    const [missedShallowChecked, setMissedShallowChecked] = useState(false);
    const [deepChecked, setDeepChecked] = useState(false);
    const [missedDeepChecked, setMissedDeepChecked] = useState(false);
    const router = useRouter();

    return (
        <div className="flex flex-col items-center min-h-screen p-6">
            {/* Title Section */}
            <h1 className="font-sans text-2xl">Endgame</h1>
            
            {/* Checkbox Section */}
            <div className="flex flex-col gap-10 w-full flex-grow justify-start p-6">
                <label className="flex items-center gap-4">
                    <Checkbox
                        checked={parkChecked}
                        disabled={shallowChecked || deepChecked} 
                        onCheckedChange={(checked) => {
                            setParkChecked(checked == true);
                        }}
                    />
                    <span className="text-3xl">Park</span>
                </label>

                <label className="flex items-center gap-4">
                    <Checkbox className="text-3xl"
                        checked={shallowChecked}
                        disabled={parkChecked || missedShallowChecked || deepChecked} 
                        onCheckedChange={(checked) => {
                            setShallowChecked(checked == true);
                        }}
                    />
                    <span className="text-3xl">Shallow Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <Checkbox
                        checked={missedShallowChecked}
                        disabled={shallowChecked} 
                        onCheckedChange={(checked) => {
                            setMissedShallowChecked(checked == true);
                        }}
                    />
                    <span className="text-3xl">Missed Shallow Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <Checkbox
                        checked={deepChecked}
                        disabled={parkChecked || shallowChecked || missedDeepChecked} 
                        onCheckedChange={(checked) => {
                            setDeepChecked(checked == true);
                        }}
                    />
                    <span className="text-3xl">Deep Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <Checkbox
                        checked={missedDeepChecked}
                        disabled={deepChecked} 
                        onCheckedChange={(checked) => {
                            setMissedDeepChecked(checked == true);
                        }}
                    />
                    <span className="text-3xl">Missed Deep Cage</span>
                </label>
            </div>

            {/* Buttons Section */}
            <div className="mt-auto flex flex-col gap-4 w-full">
                <Button 
                className="h-20 bg-blue-400 hover:bg-blue-500 text-white font-bold text-3xl"
                onClick={() => router.push('/scout/matchreview')}
                >
                    Match Review
                </Button>
                <Button className="h-20 bg-green-400 hover:bg-green-500 text-white font-bold text-3xl">
                    Back To Auto
                </Button>
            </div>
        </div>
    );
}

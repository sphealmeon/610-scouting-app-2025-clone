'use client';

import React from "react";

export default function EndGame({ handlePageChange }: { handlePageChange: (state: string) => void }) {
    return (
        <div className="flex flex-col items-center min-h-screen">
            {/* Title Section */}
            <h1 className="font-sans text-2xl">Endgame</h1>
            
            {/* Checkbox Section */}
            <div className="flex flex-col gap-20 w-full max-w-md flex-grow items-center justify-center">
                <label className="flex items-center gap-4">
                    <input type="checkbox" className="cursor-pointer w-6 h-6" />
                    <span className="text-4xl">Park</span>
                </label>

                <label className="flex items-center gap-4">
                    <input type="checkbox" className="cursor-pointer w-6 h-6" />
                    <span className="text-4xl">Low Cage</span>
                </label>

                <label className="flex items-center gap-4">
                    <input type="checkbox" className="cursor-pointer w-6 h-6" />
                    <span className="text-4xl">Deep Cage</span>
                </label>
            </div>
        </div>
    );
}
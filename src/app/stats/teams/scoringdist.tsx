"use client"

import { useState } from "react"
import { Data } from "@/app/interfaces"

interface ScoringDistProps {
    matches: Data[];
}

export function ScoringDist({ matches }: ScoringDistProps) {
    const [level, setLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1');

    const slots = {
        L1: ["F", "E", "D", "C", "B", "A"],
        L2: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
        L3: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
        L4: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
    };

    // Modify the calculation function to return made and attempts
    const calculateSlotStats = (level: string, slot: string) => {
        const attempts = matches.reduce((acc, match) => {
            const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof match.auto;
            const slotData = match.auto[slotKey];
            if (typeof slotData === 'object' && 'made' in slotData) {
                return acc + (slotData.made || 0) + (slotData.dropped || 0);
            }
            return acc;
        }, 0);

        const made = matches.reduce((acc, match) => {
            const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof match.auto;
            const slotData = match.auto[slotKey];
            if (typeof slotData === 'object' && 'made' in slotData) {
                return acc + (slotData.made || 0);
            }
            return acc;
        }, 0);

        return { made, attempts };
    };

    return (
        <div className="rounded-md border p-4">
            <div className="flex space-x-4 mb-4 justify-center">
                {(['L1', 'L2', 'L3', 'L4'] as const).map((l) => (
                    <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`px-4 py-2 rounded ${
                            level === l 
                            ? "bg-gray-200 text-black" 
                            : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                    >
                        {l}
                    </button>
                ))}
            </div>

            <div className="relative w-[400px] h-[400px] mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {slots[level].map((slot, index) => {
                        const totalSlots = slots[level].length;
                        const isHexagon = level !== 'L1';
                        const angle = isHexagon ? 
                            (index * (360 / totalSlots)) : 
                            (index * (360 / totalSlots)) + 30;
                        const startAngle = angle * (Math.PI / 180);
                        const endAngle = (angle + (360 / totalSlots)) * (Math.PI / 180);
                        const centerX = 50;
                        const centerY = 50;
                        const radius = 40;

                        const x1 = centerX + radius * Math.cos(startAngle);
                        const y1 = centerY + radius * Math.sin(startAngle);
                        const x2 = centerX + radius * Math.cos(endAngle);
                        const y2 = centerY + radius * Math.sin(endAngle);

                        const path = `
                            M ${centerX} ${centerY}
                            L ${x1} ${y1}
                            L ${x2} ${y2}
                            Z
                        `;

                        const stats = calculateSlotStats(level, slot);
                        const percentage = stats.attempts > 0 
                            ? (stats.made / stats.attempts) * 100 
                            : 0;
                        const color = percentage > 0 
                            ? `rgb(${Math.round(255 - (percentage * 2.55))}, ${Math.round(percentage * 2.55)}, 0)`
                            : '#4B5563';

                        return (
                            <g key={slot}>
                                <path
                                    d={path}
                                    fill={color}
                                    stroke="black"
                                    strokeWidth="0.5"
                                    className="cursor-pointer hover:opacity-80"
                                />
                                <text
                                    x={centerX + (radius * 0.7) * Math.cos(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}
                                    y={centerY + (radius * 0.7) * Math.sin(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="4"
                                    className="pointer-events-none"
                                >
                                    <tspan x={centerX + (radius * 0.7) * Math.cos(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}>
                                        {slot}
                                    </tspan>
                                    <tspan 
                                        x={centerX + (radius * 0.7) * Math.cos(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))} 
                                        dy="5"
                                    >
                                        {`${stats.made}/${stats.attempts}`}
                                    </tspan>
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
                Color intensity indicates scoring success rate in auto
            </div>
        </div>
    );
} 
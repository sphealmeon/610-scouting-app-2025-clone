"use client"

import { useState } from "react"
import { Data } from "@/app/interfaces"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatchAutoDisplayProps {
    matches: Data[];
}

export function MatchAutoDisplay({ matches }: MatchAutoDisplayProps) {
    const [selectedMatch, setSelectedMatch] = useState<string>("");
    const [level, setLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1');
    
    const matchOptions = matches
        .filter(match => match?.start?.match)
        .sort((a, b) => Number(a.start.match) - Number(b.start.match))
        .map(match => ({
            value: String(match.start.match),
            label: `Match ${match.start.match}`
        }));
        
    const slots = {
        L1: ["F", "E", "D", "C", "B", "A"],
        L2: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
        L3: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
        L4: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
    };

    const selectedMatchData = selectedMatch 
        ? matches.find(match => String(match.start.match) === selectedMatch) 
        : null;

    // Function to determine if a slot was scored on
    const getSlotStatus = (level: string, slot: string, matchData: Data | null) => {
        if (!matchData) return { made: false, dropped: false };
        
        const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof matchData.auto;
        const slotData = matchData.auto[slotKey];
        
        if (typeof slotData === 'object' && 'made' in slotData && 'dropped' in slotData) {
            return { 
                made: slotData.made > 0, 
                dropped: slotData.dropped > 0 
            };
        }
        
        return { made: false, dropped: false };
    };

    return (
        <div className="rounded-md border p-4">
            <h2 className="text-2xl font-bold mb-4">Match Auto Scoring</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label className="block mb-2">Select Match</label>
                    <Select onValueChange={setSelectedMatch} value={selectedMatch}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select match..." />
                        </SelectTrigger>
                        <SelectContent>
                            {matchOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {selectedMatch && selectedMatchData && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <span className="text-gray-400">Match:</span> 
                            <span className="font-bold ml-2">{selectedMatchData.start.match}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Alliance:</span> 
                            <span className={`font-bold ml-2 ${selectedMatchData.start.alliance === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
                                {selectedMatchData.start.alliance.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400">Position:</span> 
                            <span className="font-bold ml-2">{selectedMatchData.start.position}</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <span className="text-gray-400">Auto Leave:</span> 
                            <span className="font-bold ml-2">
                                {selectedMatchData.auto.leave === 1 ? "Yes" : "No"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400">Auto Coral:</span> 
                            <span className="font-bold ml-2">{selectedMatchData.auto.coral}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Auto Algae:</span> 
                            <span className="font-bold ml-2">{selectedMatchData.auto.algae}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Dropped Coral:</span> 
                            <span className="font-bold ml-2">{selectedMatchData.auto.droppedCoral}</span>
                        </div>
                    </div>

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

                                const status = getSlotStatus(level, slot, selectedMatchData);
                                let color = "#4B5563"; // Default gray
                                
                                if (status.made) {
                                    color = "#22c55e"; // Green for scored
                                } else if (status.dropped) {
                                    color = "#ef4444"; // Red for dropped
                                }

                                return (
                                    <g key={slot}>
                                        <path
                                            d={path}
                                            fill={color}
                                            stroke="black"
                                            strokeWidth="0.5"
                                        />
                                        <text
                                            x={centerX + (radius * 0.7) * Math.cos(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}
                                            y={centerY + (radius * 0.7) * Math.sin(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="white"
                                            fontSize="6"
                                        >
                                            {slot}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#22c55e] mr-2"></div>
                            <span>Made</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#ef4444] mr-2"></div>
                            <span>Dropped</span>
                        </div>
                    </div>
                </>
            )}
            
            {!selectedMatch && (
                <div className="text-center text-gray-400 my-8">
                    Select a match to see auto scoring details
                </div>
            )}
        </div>
    );
} 
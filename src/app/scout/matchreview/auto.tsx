import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoutingData } from "../../data";

interface AutoScores {
    coral: {
        L4: number;
        L3: number;
        L2: number;
        L1: number;
        DroppedCoral: number;
    };
    algae: {
        ProcessorScored: number;
        BargeScored: number;
        DroppedAlgae: number;
    };
}

export default function AutoReview() {
    const [coralLevel, setCoralLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1');
    const [algaeLevel, setAlgaeLevel] = useState<'L2-L3' | 'L3-L4'>('L2-L3');
    const [processorScore, setProcessorScore] = useState(ScoutingData.auto.processor);
    const [bargeScore, setBargeScore] = useState(ScoutingData.auto.barge);
    const [coralScores, setCoralScores] = useState<Record<string, Record<string, number>>>({
        L1: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 },
        L2: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0 },
        L3: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0 },
        L4: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0 }
    });
    const [algaeScores, setAlgaeScores] = useState<Record<string, Record<string, number>>>({
        'L2-L3': { A: 0, E: 0, I: 0 },
        'L3-L4': { A: 0, E: 0, I: 0 }
    });

    const coralBoards: Record<'L1' | 'L2' | 'L3' | 'L4', string[]> = {
        L1: ["A", "B", "C", "D", "E", "F"],
        L2: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
        L3: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
        L4: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    };

    const algaeBoards: Record<'L2-L3' | 'L3-L4', string[]> = {
        'L2-L3': ['A', 'E', 'I'],
        'L3-L4': ['A', 'E', 'I'],
    };
    const handleScoreChange = (category: keyof AutoScores, key: string, increment: number) => {
        const updateScores = (prev: AutoScores) => {
            const newValue = Math.max(0, (prev[category] as any)[key] + increment);
            
            // Update ScoutingData based on the category and key
            if (category === 'coral') {
                switch(key) {
                    case 'L4': ScoutingData.auto.l4 = newValue; break;
                    case 'L3': ScoutingData.auto.l3 = newValue; break;
                    case 'L2': ScoutingData.auto.l2 = newValue; break;
                    case 'L1': ScoutingData.auto.l1 = newValue; break;
                    case 'DroppedCoral': ScoutingData.auto.droppedCoral = newValue; break;
                }
            } else {
                switch(key) {
                    case 'ProcessorScored': ScoutingData.auto.processor = newValue; break;
                    case 'BargeScored': ScoutingData.auto.barge = newValue; break;
                    case 'DroppedAlgae': ScoutingData.auto.droppedAlgae = newValue; break;
                }
            }

            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    [key]: newValue
                }
            };
        });
    };

    const handleProcessorScore = (increment: number) => {
        const newValue = Math.max(0, processorScore + increment);
        setProcessorScore(newValue);
        ScoutingData.auto.processor = newValue;
    };

    const handleBargeScore = (increment: number) => {
        const newValue = Math.max(0, bargeScore + increment);
        setBargeScore(newValue);
        ScoutingData.auto.barge = newValue;
    };

    const handleCoralSlotChange = (slot: string, increment: number) => {
        setCoralScores(prev => ({
            ...prev,
            [coralLevel]: {
                ...prev[coralLevel],
                [slot]: Math.max(0, prev[coralLevel][slot] + increment)
            }
        }));
        // Update ScoutingData here if needed
    };

    const handleAlgaeSlotChange = (slot: string, increment: number) => {
        setAlgaeScores(prev => ({
            ...prev,
            [algaeLevel]: {
                ...prev[algaeLevel],
                [slot]: Math.max(0, prev[algaeLevel][slot] + increment)
            }
        }));
        // Update ScoutingData here if needed
    };

    const renderScoringSection = (title: string, category: keyof AutoScores, items: string[]) => (
        <Card className="mb-4">
            <CardContent>
                <h2 className="text-xl font-bold mb-2">Auto {title}</h2>
                <div className="grid gap-4">
                    {items.map((item) => (
                        <div key={item} className="flex items-center justify-between">
                            <span className="text-lg">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    className="bg-red-500 hover:bg-red-400"
                                    onClick={() => handleScoreChange(category, item, -1)}
                                >
                                    -
                                </Button>
                                <span>{scores[category][item]}</span>
                                <Button
                                    className="bg-green-500 hover:bg-green-400"
                                    onClick={() => handleScoreChange(category, item, 1)}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="flex flex-col gap-8 p-6">
            <Card className="mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Auto Coral Review</h2>
                    <div className="flex space-x-4 mb-4">
                        {(["L1", "L2", "L3", "L4"] as const).map((level) => (
                            <Button
                                key={level}
                                variant={coralLevel === level ? "default" : "outline"}
                                onClick={() => setCoralLevel(level)}
                            >
                                {level}
                            </Button>
                        ))}
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                        {coralBoards[coralLevel].map((slot) => (
                            <div key={slot} className="flex flex-col items-center gap-2">
                                <span className="font-bold">{slot}</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleCoralSlotChange(slot, -1)}
                                    >
                                        -
                                    </Button>
                                    <div className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded">
                                        <span>{coralScores[coralLevel][slot]}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleCoralSlotChange(slot, 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Auto Algae Review</h2>
                    <div className="flex space-x-4 mb-4">
                        {(['L2-L3', 'L3-L4'] as const).map((level) => (
                            <Button
                                key={level}
                                variant={algaeLevel === level ? "default" : "outline"}
                                onClick={() => setAlgaeLevel(level)}
                            >
                                {level}
                            </Button>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {algaeBoards[algaeLevel].map((slot) => (
                            <div key={slot} className="flex flex-col items-center gap-2">
                                <span className="font-bold">{slot}</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleAlgaeSlotChange(slot, -1)}
                                    >
                                        -
                                    </Button>
                                    <div className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded">
                                        <span>{algaeScores[algaeLevel][slot]}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleAlgaeSlotChange(slot, 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-6">
                        <div className="flex flex-col items-center gap-2">
                            <span className="font-bold">Processor Score</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleProcessorScore(-1)}
                                >
                                    -
                                </Button>
                                <div className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded">
                                    <span>{processorScore}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleProcessorScore(1)}
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="font-bold">Barge Score</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleBargeScore(-1)}
                                >
                                    -
                                </Button>
                                <div className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded">
                                    <span>{bargeScore}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleBargeScore(1)}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

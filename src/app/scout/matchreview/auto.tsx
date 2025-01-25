import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoutingData } from "../../data";

export default function AutoReview() {
    const [coralLevel, setCoralLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1');
    const [algaeLevel, setAlgaeLevel] = useState<'L2-L3' | 'L3-L4'>('L2-L3');
    const [processorScore, setProcessorScore] = useState(ScoutingData.auto.processor);
    const [bargeScore, setBargeScore] = useState(ScoutingData.auto.barge);
    const [coralScores, setCoralScores] = useState<Record<string, Record<string, number>>>({
        L1: { A: ScoutingData.auto.L1.A, B: ScoutingData.auto.L1.B, C: ScoutingData.auto.L1.C, D: ScoutingData.auto.L1.D, E: ScoutingData.auto.L1.E, F: ScoutingData.auto.L1.F },
        L2: { A: ScoutingData.auto.L2.A, B: ScoutingData.auto.L2.B, C: ScoutingData.auto.L2.C, D: ScoutingData.auto.L2.D, E: ScoutingData.auto.L2.E, F: ScoutingData.auto.L2.F, G: ScoutingData.auto.L2.G, H: ScoutingData.auto.L2.H, I: ScoutingData.auto.L2.I, J: ScoutingData.auto.L2.J, K: ScoutingData.auto.L2.K, L: ScoutingData.auto.L2.L },
        L3: { A: ScoutingData.auto.L3.A, B: ScoutingData.auto.L3.B, C: ScoutingData.auto.L3.C, D: ScoutingData.auto.L3.D, E: ScoutingData.auto.L3.E, F: ScoutingData.auto.L3.F, G: ScoutingData.auto.L3.G, H: ScoutingData.auto.L3.H, I: ScoutingData.auto.L3.I, J: ScoutingData.auto.L3.J, K: ScoutingData.auto.L3.K, L: ScoutingData.auto.L3.L },
        L4: { A: ScoutingData.auto.L4.A, B: ScoutingData.auto.L4.B, C: ScoutingData.auto.L4.C, D: ScoutingData.auto.L4.D, E: ScoutingData.auto.L4.E, F: ScoutingData.auto.L4.F, G: ScoutingData.auto.L4.G, H: ScoutingData.auto.L4.H, I: ScoutingData.auto.L4.I, J: ScoutingData.auto.L4.J, K: ScoutingData.auto.L4.K, L: ScoutingData.auto.L4.L }
    });
    const [algaeScores, setAlgaeScores] = useState<Record<string, Record<string, number>>>({
        'L2-L3': { A: ScoutingData.auto.algaeSlots['L2-L3'].A, E: ScoutingData.auto.algaeSlots['L2-L3'].E, I: ScoutingData.auto.algaeSlots['L2-L3'].I },
        'L3-L4': { A: ScoutingData.auto.algaeSlots['L3-L4'].A, E: ScoutingData.auto.algaeSlots['L3-L4'].E, I: ScoutingData.auto.algaeSlots['L3-L4'].I }
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

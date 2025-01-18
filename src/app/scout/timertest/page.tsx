'use client'
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Button } from "@/components/ui/button";

export default function MultiHandleSliderTimer() {
    const [totalTime] = useState(135); // Total time in seconds
    const [intervals, setIntervals] = useState([30, 75, 120]); // Initial interval boundaries
    const [timeRemaining, setTimeRemaining] = useState(totalTime);
    const [isRunning, setIsRunning] = useState(false);

    const handleSliderChange = (newIntervals: number[]) => {
        setIntervals(newIntervals);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeRemaining(totalTime);
    };

    const getPhase = () => {
        if (timeRemaining > intervals[2]) return "Default Phase";
        if (timeRemaining > intervals[1]) return "Third Phase";
        if (timeRemaining > intervals[0]) return "Second Phase";
        return "First Phase";
    };

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isRunning && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        } else if (timeRemaining <= 0) {
            setIsRunning(false);
            clearInterval(timer!);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRunning, timeRemaining]);

    return (
        <div className="flex flex-col items-center space-y-6 p-6">
            <h1 className="text-xl font-bold">Multi-Interval Timer</h1>
            <div className="text-center text-2xl font-bold">
                Time Remaining: {timeRemaining}s
            </div>
            <div className="w-full max-w-md">
                <p className="mb-2 text-center">
                    Intervals: {intervals.join(", ")} seconds
                </p>
                <Slider
                    range
                    min={0}
                    max={totalTime}
                    value={intervals}
                    onChange={handleSliderChange}
                    step={1}
                    marks={{
                        0: "Start",
                        [intervals[0]]: `${intervals[0]}s`,
                        [intervals[1]]: `${intervals[1]}s`,
                        [intervals[2]]: `${intervals[2]}s`,
                        [totalTime]: "End",
                    }}
                />
            </div>
            <div className="flex space-x-4">
                <Button onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? "Pause" : "Start"}
                </Button>
                <Button onClick={resetTimer} variant="secondary">
                    Reset
                </Button>
            </div>
            <div className="mt-6 text-center">
                <p>
                    <span className="font-bold">{getPhase()}</span>
                </p>
            </div>
        </div>
    );
}

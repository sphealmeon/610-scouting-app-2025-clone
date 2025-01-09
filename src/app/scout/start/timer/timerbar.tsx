"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TimerBar() {
    const [timeLeft, setTimeLeft] = useState(150); // Initialize timer with 150 seconds
    const [isRunning, setIsRunning] = useState(false); // State to track if timer is running
    const totalTime = 150; // Total time for the countdown

    // Use `useEffect` to update the timer every second when running
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }
        // Clear the interval when the component unmounts or when the timer stops
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    // Start button handler
    const handleStart = () => {
        setIsRunning(true);
    };

    // Stop button handler
    const handleStop = () => {
        setIsRunning(false);
    };

    // Reset button handler
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(totalTime);
    };

    // Calculate the width of the progress bar as a percentage
    const progressBarWidth = (timeLeft / totalTime) * 100;

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center w-full px-4">
                <h1 className="text-2xl font-bold mb-4">Countdown Timer</h1>
                <div className="w-full max-w-3xl bg-gray-300 h-10 rounded-full mx-auto mb-4">
                    <div
                        className="bg-blue-500 h-10 rounded-full transition-all"
                        style={{ width: `${progressBarWidth}%` }}
                    ></div>
                </div>
                <p className="text-lg mb-4">
                    Time left: <span>{timeLeft}s</span>
                </p>
                <div className="space-x-2">
                    <Button onClick={handleStart} disabled={isRunning}>
                        Start
                    </Button>
                    <Button onClick={handleStop} disabled={!isRunning}>
                        Stop
                    </Button>
                    <Button onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}


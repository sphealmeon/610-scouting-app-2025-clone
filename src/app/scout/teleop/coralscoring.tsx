'use client';

import React, { useState, useEffect } from "react";
import { ScoutingData } from "../data";

export default function CoralScoringSection() {
  const [activePickup, setActivePickup] = useState<string | null>(null);
  const [hasPreloadedCoral, setHasPreloadedCoral] = useState(false);
  const [pickupTime, setPickupTime] = useState<number | null>(null);

  // Check if there's a preloaded coral that wasn't used in auto
  useEffect(() => {
    const preloadExists = ScoutingData.start.preload === 1;
    const coralUsedInAuto = 
      ScoutingData.auto.coral > 0 || 
      ScoutingData.auto.droppedCoral > 0 ||
      ScoutingData.auto.l1 > 0 ||
      ScoutingData.auto.l2 > 0 ||
      ScoutingData.auto.l3 > 0 ||
      ScoutingData.auto.l4 > 0;
    
    // If preload exists and wasn't used in auto, set the state
    if (preloadExists && !coralUsedInAuto) {
      setHasPreloadedCoral(true);
      setActivePickup('preload'); // Set a special 'preload' state
      setPickupTime(Date.now()); // Set pickup time for preloaded coral
    }
  }, []);

  const handlePickupClick = (type: string) => {
    // Toggle off if clicking the same button
    if (activePickup === type) {
      setActivePickup(null);
      setPickupTime(null);
      return;
    }
    
    // Record the time when pickup is selected
    const currentTime = Date.now();
    setPickupTime(currentTime);
    setActivePickup(type);
    
    if (type === 'floor') {
      ScoutingData.teleop.coralPickup++;
    } else if (type === 'station') {
      ScoutingData.teleop.coralPickupFromStation++;
    }
  };

  // Helper function to update cycle time for scoring actions
  const updateCycleTime = () => {
    if (pickupTime) {
      const scoringTime = Date.now();
      const cycleTime = scoringTime - pickupTime;
      
      // Update the cycle count
      ScoutingData.teleop.coralCyclesForTimer++;
      
      // Calculate new average time
      if (ScoutingData.teleop.coralAverageScoringTime === 0) {
        // First cycle, just set the time
        ScoutingData.teleop.coralAverageScoringTime = cycleTime;
      } else {
        // Calculate running average
        const currentAvg = ScoutingData.teleop.coralAverageScoringTime;
        const cycleCount = ScoutingData.teleop.coralCyclesForTimer;
        const timeDiff = cycleTime - currentAvg;
        
        // Update average: currentAvg + (newTime - currentAvg) / cycleCount
        const newAverage = currentAvg + (timeDiff / cycleCount);
        ScoutingData.teleop.coralAverageScoringTime = newAverage;
        
        console.log(`Coral cycle #${cycleCount}: Current time: ${cycleTime}ms, Previous avg: ${currentAvg.toFixed(2)}ms, New avg: ${newAverage.toFixed(2)}ms`);
      }
    }
  };

  const handleScoring = (action: () => void, updateAverage: boolean = true) => {
    if (!activePickup) return; // Don't allow scoring if no pickup selected
    
    // Execute the scoring action
    action();
    
    // Only update cycle time if this is a scoring action (not dropped on field)
    if (updateAverage) {
      updateCycleTime();
    }
    
    // If this was a preloaded coral, reset the preload state after scoring
    if (activePickup === 'preload') {
      setHasPreloadedCoral(false);
    }
    
    // Reset pickup state
    setActivePickup(null);
    setPickupTime(null);
  };

  return (
    <div className="col-span-1">
      <div className="flex flex-row items-center justify-center gap-4 mb-8">
        <div className="flex-1 h-[1px] bg-white max-w-[80px]"></div>
        <h2 className="text-xl">Coral Scoring</h2>
        <div className="flex-1 h-[1px] bg-white max-w-[80px]"></div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Show pickup options only if there's no preloaded coral */}
        {!hasPreloadedCoral && (
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`${
                activePickup === 'floor' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
              } text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500 transition-colors`}            
              onClick={() => handlePickupClick('floor')}
            >
              Floor
            </div>
            <div
              className={`${
                activePickup === 'station' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
              } text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500 transition-colors`}
              onClick={() => handlePickupClick('station')}
            >
              Coral station
            </div>
          </div>
        )}

        {/* If there's a preloaded coral, show a message */}
        {hasPreloadedCoral && (
          <div className="bg-blue-500 text-white font-bold py-3 rounded-sm text-center mb-2">
            Using Preloaded Coral
          </div>
        )}

        {/* Scoring Grid */}
        <div className="flex flex-col gap-3">
          {/* L4 Row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } bg-green-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l4Scored++, true)}
            >
              L4 Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l4Dropped++, true)}
            >
              L4 Missed
            </div>
          </div>

          {/* L3 Row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } bg-green-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l3Scored++, true)}
            >
              L3 Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l3Dropped++, true)}
            >
              L3 Missed
            </div>
          </div>

          {/* L2 Row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } bg-green-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l2Scored++, true)}
            >
              L2 Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l2Dropped++, true)}
            >
              L2 Missed
            </div>
          </div>

          {/* L1 Row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } bg-green-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l1Scored++, true)}
            >
              L1 Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l1Dropped++, true)}
            >
              L1 Missed
            </div>
          </div>
        </div>

        {/* Dropped on field */}
        <div
          className={`${
            !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
          } h-16 bg-gray-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center flex items-center justify-center`}
          onClick={() => handleScoring(() => ScoutingData.teleop.droppedOnField++, false)}
        >
          Dropped on field
        </div>
      </div>
    </div>
  );
} 
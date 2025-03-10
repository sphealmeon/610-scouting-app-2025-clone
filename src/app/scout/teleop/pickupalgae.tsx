'use client';

import React, { useState } from "react";
import { ScoutingData } from "../data";

export default function PickupAlgae() {
  const [activePickup, setActivePickup] = useState<string | null>(null);
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });
  const [pickupTime, setPickupTime] = useState<number | null>(null);

  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  const handleKnock = () => {
    ScoutingData.teleop.algaeRemoved++;
    showPopup("Algae Knocked Off Reef");
  };

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
      ScoutingData.teleop.pickupAlgae++;
    } else if (type === 'reef') {
      ScoutingData.teleop.pickupAlgaeFromReef++;
    }
  };

  // Helper function to update processor cycle time
  const updateProcessorCycleTime = () => {
    if (pickupTime) {
      const scoringTime = Date.now();
      const cycleTime = scoringTime - pickupTime;
      
      // Update the cycle count
      ScoutingData.teleop.processorCyclesForTimer++;
      
      // Calculate new average time
      if (ScoutingData.teleop.processorAverageScoringTime === 0) {
        // First cycle, just set the time
        ScoutingData.teleop.processorAverageScoringTime = cycleTime;
      } else {
        // Calculate running average
        const currentAvg = ScoutingData.teleop.processorAverageScoringTime;
        const cycleCount = ScoutingData.teleop.processorCyclesForTimer;
        const timeDiff = cycleTime - currentAvg;
        
        // Update average: currentAvg + (newTime - currentAvg) / cycleCount
        const newAverage = currentAvg + (timeDiff / cycleCount);
        ScoutingData.teleop.processorAverageScoringTime = newAverage;
        
        console.log(`Processor cycle #${cycleCount}: Current time: ${cycleTime}ms, Previous avg: ${currentAvg.toFixed(2)}ms, New avg: ${newAverage.toFixed(2)}ms`);
      }
    }
  };

  // Helper function to update barge cycle time
  const updateBargeCycleTime = () => {
    if (pickupTime) {
      const scoringTime = Date.now();
      const cycleTime = scoringTime - pickupTime;
      
      // Update the cycle count
      ScoutingData.teleop.bargeCyclesForTimer++;
      
      // Calculate new average time
      if (ScoutingData.teleop.bargeAverageScoringTime === 0) {
        // First cycle, just set the time
        ScoutingData.teleop.bargeAverageScoringTime = cycleTime;
      } else {
        // Calculate running average
        const currentAvg = ScoutingData.teleop.bargeAverageScoringTime;
        const cycleCount = ScoutingData.teleop.bargeCyclesForTimer;
        const timeDiff = cycleTime - currentAvg;
        
        // Update average: currentAvg + (newTime - currentAvg) / cycleCount
        const newAverage = currentAvg + (timeDiff / cycleCount);
        ScoutingData.teleop.bargeAverageScoringTime = newAverage;
        
        console.log(`Barge cycle #${cycleCount}: Current time: ${cycleTime}ms, Previous avg: ${currentAvg.toFixed(2)}ms, New avg: ${newAverage.toFixed(2)}ms`);
      }
    }
  };

  const handleScoring = (action: () => void, scoringType: 'processor' | 'barge' | 'none' = 'none') => {
    if (!activePickup) return; // Don't allow scoring if no pickup selected
    
    // Execute the scoring action
    action();
    
    // Update cycle time based on scoring type
    if (scoringType === 'processor') {
      updateProcessorCycleTime();
    } else if (scoringType === 'barge') {
      updateBargeCycleTime();
    }
    
    // Reset pickup state
    setActivePickup(null);
    setPickupTime(null);
  };

  return (
    <div className="col-span-1">
      <div className="flex flex-row items-center justify-center gap-4 mb-8">
        <div className="flex-1 h-[1px] bg-white max-w-[80px]"></div>
        <h2 className="text-xl">Algae Pickup</h2>
        <div className="flex-1 h-[1px] bg-white max-w-[80px]"></div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Pickup Options */}
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
              activePickup === 'reef' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            } text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500 transition-colors`}
            onClick={() => handlePickupClick('reef')}
          >
            Reef
          </div>
        </div>

        {/* Scoring Grid */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } bg-green-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.processorScored++, 'processor')}
            >
              Processor Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.processorDropped++, 'processor')}
            >
              Processor Missed
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } bg-green-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.bargeScored++, 'barge')}
            >
              Net Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.bargeDropped++, 'barge')}
            >
              Net Missed
            </div>
          </div>
        </div>

        {/* Dropped on field */}
        <div
          className={`${
            !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
          } bg-gray-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
          onClick={() => handleScoring(() => ScoutingData.teleop.algaeRemoved++, 'none')}
        >
          Dropped on field
        </div>

        {/* Knocked off reef - Always enabled */}
        <div
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
          onClick={handleKnock}
        >
          Knocked off reef
        </div>

        {popup.visible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2
                      bg-black bg-opacity-80 text-white px-4 py-2 rounded">
          {popup.message}
        </div>
        )}
      </div>
    </div>
  );
}

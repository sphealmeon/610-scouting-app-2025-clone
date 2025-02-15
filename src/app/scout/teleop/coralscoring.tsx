'use client';

import React, { useState } from "react";
import { ScoutingData } from "../data";

export default function CoralScoringSection() {
  const [activePickup, setActivePickup] = useState<string | null>(null);

  const handlePickupClick = (type: string) => {
    // Toggle off if clicking the same button
    if (activePickup === type) {
      setActivePickup(null);
      return;
    }
    setActivePickup(type);
    
    if (type === 'floor') {
      ScoutingData.teleop.coralPickup++;
    } else if (type === 'station') {
      ScoutingData.teleop.coralPickupFromStation++;
    }
  };

  const handleScoring = (action: () => void) => {
    if (!activePickup) return; // Don't allow scoring if no pickup selected
    action();
    setActivePickup(null); // Clear pickup selection after scoring
  };

  return (
    <div className="col-span-1">
      <div className="flex flex-row items-center justify-center gap-4 mb-8">
        <div className="flex-1 h-[1px] bg-white max-w-[80px]"></div>
        <h2 className="text-xl">Coral Scoring</h2>
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
              activePickup === 'station' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            } text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500 transition-colors`}
            onClick={() => handlePickupClick('station')}
          >
            Coral station
          </div>
        </div>

        {/* Scoring Grid */}
        <div className="flex flex-col gap-3">
          {/* L4 Row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } bg-green-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l4Scored++)}
            >
              L4 Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l4Dropped++)}
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
              onClick={() => handleScoring(() => ScoutingData.teleop.l3Scored++)}
            >
              L3 Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l3Dropped++)}
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
              onClick={() => handleScoring(() => ScoutingData.teleop.l2Scored++)}
            >
              L2 Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l2Dropped++)}
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
              onClick={() => handleScoring(() => ScoutingData.teleop.l1Scored++)}
            >
              L1 Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.l1Dropped++)}
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
          onClick={() => handleScoring(() => ScoutingData.teleop.droppedOnField++)}
        >
          Dropped on field
        </div>
      </div>
    </div>
  );
} 
'use client';

import React, { useState } from "react";
import { ScoutingData } from "../data";

export default function PickupAlgae() {
  const [activePickup, setActivePickup] = useState<string | null>(null);

  const handlePickupClick = (type: string) => {
    // Toggle off if clicking the same button
    if (activePickup === type) {
      setActivePickup(null);
      return;
    }
    setActivePickup(type);
    
    if (type === 'floor') {
      ScoutingData.teleop.pickupAlgae++;
    } else if (type === 'reef') {
      ScoutingData.teleop.pickupAlgaeFromReef++;
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
              onClick={() => handleScoring(() => ScoutingData.teleop.processorScored++)}
            >
              Processor Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.processorDropped++)}
            >
              Processor Missed
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } bg-green-700 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.bargeScored++)}
            >
              Net Made
            </div>
            <div
              className={`${
                !activePickup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
              } bg-red-900 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500`}
              onClick={() => handleScoring(() => ScoutingData.teleop.bargeDropped++)}
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
          onClick={() => handleScoring(() => ScoutingData.teleop.algaeRemoved++)}
        >
          Dropped on field
        </div>

        {/* Knocked off reef - Always enabled */}
        <div
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
          onClick={() => {
            ScoutingData.teleop.algaeRemoved++;
          }}
        >
          Knocked off reef
        </div>
      </div>
    </div>
  );
}

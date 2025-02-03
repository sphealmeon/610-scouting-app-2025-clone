'use client';

import React from "react";
import { ScoutingData } from "../data";

export default function PickupAlgae({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  const handleFloorPickup = () => {
    ScoutingData.teleop.pickupAlgae++;
    handlePageChange("algaeScoring");
  };

  const handleReefPickup = () => {
    ScoutingData.teleop.pickupAlgaeFromReef++;
    handlePageChange("algaeScoring");
  };

  const handleKnockedOffReef = () => {
    ScoutingData.teleop.algaeRemoved++;
  };

  return (
    <div className="flex flex-col items-center justify-start items-start min-h-screen p-6 px-0">
      <h1 className="font-sans text-2xl mb-4">Pickup - Algae</h1>
      <div className="flex flex-col text-3xl gap-4 w-full px-6 flex-grow">
        <div
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer p-6"
          onClick={handleFloorPickup} // Call handleFloorPickup on click
        >
          Floor
        </div>

        <div
          className="bg-pink-400 hover:bg-pink-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer p-6"
          onClick={handleReefPickup} // Call handleReefPickup on click
        >
          Reef
        </div>

        <div
          className="bg-green-400 hover:bg-green-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer p-6"
          onClick={handleKnockedOffReef} // Call handleKnockedOffReef on click
        >
          Knocked Off Reef
        </div>
      </div>
    </div>
  );
}

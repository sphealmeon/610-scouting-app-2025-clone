'use client';

import React from "react";
import { ScoutingData } from "../../data";

export default function PickupCoral({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-6 p-6 px-0">
      <h1 className="font-sans text-2xl">Pickup - Coral</h1>
      <div className="flex flex-col gap-4 w-full px-6 flex-grow text-3xl">
        <div
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer p-6"
          onClick={() => {handlePageChange("reefScoring")
          ++ScoutingData.teleop.floorPickup
          }}
        >
          Floor
        </div>

        <div
          className="bg-pink-400 hover:bg-pink-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer p-6"
          onClick={() => {handlePageChange("reefScoring")
            ++ScoutingData.teleop.sourcePickup
            }}
        >
          Coral Station
        </div>
      </div>
    </div>
  );
}
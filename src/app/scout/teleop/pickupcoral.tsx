'use client';

import React from "react";

export default function PickupCoral({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-6">
      <h1 className="font-sans text-xl">Pickup - Coral</h1>
      <div className="flex flex-col gap-4 w-full px-6">
        <div
          className="bg-blue-500 text-white font-bold py-8 w-full h-[20rem] flex items-center justify-center text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("reefScoring")}
        >
          Floor
        </div>

        <div
          className="bg-pink-500 text-white font-bold py-8 w-full h-[20rem] flex items-center justify-center text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("reefScoring")}
        >
          Coral Station
        </div>
      </div>
    </div>
  );
}

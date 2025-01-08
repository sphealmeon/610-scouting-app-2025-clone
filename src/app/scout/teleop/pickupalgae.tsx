'use client';

import React from "react";

export default function PickupAlgae({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-6">
      <h1 className="font-sans text-2xl">Pickup - Algae</h1>
      <div className="flex flex-col gap-4 w-full px-6 flex-grow">
        <div
          className="bg-blue-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("algaeScoring")}
        >
          Floor
        </div>

        <div
          className="bg-pink-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("algaeScoring")}
        >
          Reef
        </div>

        <div
          className="bg-green-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("algaeScoring")}
        >
          Knocked Off Reef
        </div>
      </div>
    </div>
  );
}

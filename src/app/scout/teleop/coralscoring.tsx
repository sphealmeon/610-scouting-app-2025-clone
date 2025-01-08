'use client';

import React from "react";

export default function PickupCoral({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start items-start min-h-screen p-6">
      <h1 className="font-sans text-2xl mb-4">Scoring - Coral</h1>

      {/* Wrapper for Rows */}
      <div className="flex flex-col gap-4 w-full flex-grow">
        {/* L4 Section */}
        <div className="flex gap-4 w-full flex-grow">
          <div
            className="bg-green-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupCoral")}
          >
            L4 Made
          </div>
          <div
            className="bg-red-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupCoral")}
          >
            L4 Missed
          </div>
        </div>

        {/* L3 Section */}
        <div className="flex gap-4 w-full flex-grow">
          <div
            className="bg-green-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupCoral")}
          >
            L3 Made
          </div>
          <div
            className="bg-red-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupCoral")}
          >
            L3 Missed
          </div>
        </div>

        {/* L2 Section */}
        <div className="flex gap-4 w-full flex-grow">
          <div
            className="bg-green-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupCoral")}
          >
            L2 Made
          </div>
          <div
            className="bg-red-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupCoral")}
          >
            L2 Missed
          </div>
        </div>

        {/* L1 Section */}
        <div className="flex gap-4 w-full flex-grow">
          <div
            className="bg-green-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupCoral")}
          >
            L1 Made
          </div>
          <div
            className="bg-red-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupCoral")}
          >
            L1 Missed
          </div>
        </div>

        {/* Dropped - Field Section */}
        <div
          className="bg-blue-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          Dropped - Field
        </div>
      </div>
    </div>
  );
}

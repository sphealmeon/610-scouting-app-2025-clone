'use client';

import React from "react";

export default function PickupCoral({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  return (
    <div className="flex flex-col justify-start items-start min-h-screen p-6">
      <h1 className="font-sans text-xl">Scoring - Coral</h1>

      {/* L4 Section */}
      <div className="flex gap-4 w-full mb-2">
        <div
          className="bg-green-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          L4 Made
        </div>
        <div
          className="bg-red-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          L4 Missed
        </div>
      </div>

      {/* L3 Section */}
      <div className="flex gap-4 w-full mb-2">
        <div
          className="bg-green-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          L3 Made
        </div>
        <div
          className="bg-red-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          L3 Missed
        </div>
      </div>

      {/* L2 Section */}
      <div className="flex gap-4 w-full mb-2">
        <div
          className="bg-green-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          L2 Made
        </div>
        <div
          className="bg-red-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          L2 Missed
        </div>
      </div>

      {/* L1 Section */}
      <div className="flex gap-4 w-full mb-2">
        <div
          className="bg-green-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          L1 Made
        </div>
        <div
          className="bg-red-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupCoral")}
        >
          L1 Missed
        </div>
      </div>

      {/* Dropped - Field Section */}
      <div
        className="bg-blue-400 text-white font-bold py-8 w-full text-center rounded-lg cursor-pointer mt-4"
        onClick={() => handlePageChange("pickupCoral")}
      >
        Dropped - Field
      </div>
    </div>
  );
}

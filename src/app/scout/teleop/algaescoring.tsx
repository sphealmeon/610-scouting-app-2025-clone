'use client';

import React from "react";

export default function AlgaeScoring({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  return (
    <div className="flex flex-col justify-start items-start min-h-screen p-6">
      <h1 className="font-sans text-xl mb-4">Scoring - Algae</h1>
      
      <div className="flex flex-col gap-4 w-full flex-grow">
        <div className="flex gap-4 w-full flex-grow">
          <div
            className="bg-green-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupAlgae")}
          >
            Processor Made
          </div>
          <div
            className="bg-red-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupAlgae")}
          >
            Processor Missed
          </div>
        </div>

        <div className="flex gap-4 w-full flex-grow">
          <div
            className="bg-green-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupAlgae")}
          >
            Net Made
          </div>
          <div
            className="bg-red-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handlePageChange("pickupAlgae")}
          >
            Net Missed
          </div>
        </div>

        {/* Dropped Field Button */}
        <div
          className="bg-blue-400 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupAlgae")}
        >
          Dropped - Field
        </div>
      </div>
    </div>
  );
}

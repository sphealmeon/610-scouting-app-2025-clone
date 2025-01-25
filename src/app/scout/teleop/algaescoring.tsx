'use client';

import React from "react";
import { ScoutingData } from "../../data";

export default function AlgaeScoring({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start items-start min-h-screen p-6">
      <h1 className="font-sans text-2xl mb-4">Scoring - Algae</h1>
      
      <div className="flex flex-col gap-4 w-full flex-grow">
        <div className="flex gap-4 w-full flex-grow">
          <div
            className="bg-green-400 hover:bg-green-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer "
            onClick={() => {handlePageChange("pickupAlgae")
            ++ScoutingData.teleop.processorScored
            }}
          >
            Processor Made
          </div>
          <div
            className="bg-red-400 hover:bg-red-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => {handlePageChange("pickupAlgae")
            ++ScoutingData.teleop.processorDropped
            }}
          >
            Processor Missed
          </div>
        </div>

        <div className="flex gap-4 w-full flex-grow">
          <div
            className="bg-green-400 hover:bg-green-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => {handlePageChange("pickupAlgae")
            ++ScoutingData.teleop.bargeScored
            }}
          >
            Net Made
          </div>
          <div
            className="bg-red-400 hover:bg-red-500 text-white font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => {handlePageChange("pickupAlgae")
            ++ScoutingData.teleop.bargeDropped
            }}
          >
            Net Missed
          </div>
        </div>

        {/* Dropped Field Button */}
        <div
          className="bg-blue-400 hover:bg-blue-500 text-white text-3xl font-bold flex-grow flex items-center justify-center text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupAlgae")}
          // Do we want algae dropped data
        >
          Dropped - Field
        </div>
      </div>
    </div>
  );
}

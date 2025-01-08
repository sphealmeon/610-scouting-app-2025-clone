'use client';

import React from "react";
import { Button } from "@/components/ui/button";

export default function AlgaeScoring({ handlePageChange }: { handlePageChange: (state: string) => void }) {
  return (
    <div className="flex flex-col justify-start items-start min-h-screen p-6">
      <h1 className="font-sans text-xl">Scoring - Algae</h1>
      <div className="flex gap-4 w-full mb-2">
        <div
          className="bg-green-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupAlgae")}
        >
          Processor Made
        </div>
        <div
          className="bg-red-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupAlgae")}
        >
          Processor Missed
        </div>
      </div>

      <div className="flex gap-4 w-full mb-2">
        <div
          className="bg-green-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupAlgae")}
        >
          Net Made
        </div>
        <div
          className="bg-red-400 text-white font-bold py-8 w-1/2 text-center rounded-lg cursor-pointer"
          onClick={() => handlePageChange("pickupAlgae")}
        >
          Net Missed
        </div>
      </div>
      <div
        className="bg-blue-400 text-white font-bold py-8 w-full text-center rounded-lg cursor-pointer mt-4"
        onClick={() => handlePageChange("pickupAlgae")}
      >
        Dropped - Field
      </div>
    </div>
  );
}

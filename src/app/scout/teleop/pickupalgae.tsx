'use client';

import React from "react";
import { ScoutingData } from "../data";

export default function PickupAlgae() {
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
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
            onClick={() => {
              ScoutingData.teleop.pickupAlgae++;
            }}
          >
            Floor
          </div>
          <div
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
            onClick={() => {
              ScoutingData.teleop.pickupAlgaeFromReef++;
            }}
          >
            Reef
          </div>
        </div>

        {/* Scoring Grid */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div
              className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
              onClick={() => {
                ScoutingData.teleop.processorScored++;
              }}
            >
              Processor Made
            </div>
            <div
              className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
              onClick={() => {
                ScoutingData.teleop.processorDropped++;
              }}
            >
              Processor Missed
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
              onClick={() => {
                ScoutingData.teleop.bargeScored++;
              }}
            >
              Net Made
            </div>
            <div
              className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
              onClick={() => {
                ScoutingData.teleop.bargeDropped++;
              }}
            >
              Net Missed
            </div>
          </div>
        </div>

        {/* Dropped on field */}
        <div
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-sm cursor-pointer text-center border border-gray-500"
          onClick={() => {
            ScoutingData.teleop.algaeRemoved++;
          }}
        >
          Dropped on field
        </div>

        {/* Knocked off reef */}
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

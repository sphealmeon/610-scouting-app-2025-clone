import { ScoutingData } from "@/app/scout/data";
import { headerWidth, headerHeight } from "@/app/globalVars";
import React from "react";

export default function ScoutHeader({ name }: { name: string }) {
  return (
    <>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          width: headerWidth,
          height: headerHeight,
        }}
      >
        {name == "Start"
          ? name
          : name +
            " || Team: " +
            ScoutingData.start.team +
            " || Match: " +
            ScoutingData.start.match}
      </h1>
    </>
  );
}
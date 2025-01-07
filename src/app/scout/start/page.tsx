'use client';

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RobotPosition from "./robotposition";
import MatchSelect from "./matchselect";
import ScoutSelect from "./scoutselect";

export default function StartPage(){
    return(
        <div className="relative grid grid-cols-3 gap-4 p-8">
            <div className="col-span-1">
                <RobotPosition />
            </div>
            <div className="col-span-1 flex justify-center">
                <MatchSelect />
            </div>
            <div className="col-span-1 flex justify-center">
                <ScoutSelect />
            </div>
        </div>
    );
}

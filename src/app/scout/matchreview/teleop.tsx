import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoutingData } from "../data";

export default function TeleopReview() {
  const [scores, setScores] = useState({
    l4Made: ScoutingData.teleop.l4Scored,
    l4Missed: ScoutingData.teleop.l4Dropped,
    l3Made: ScoutingData.teleop.l3Scored,
    l3Missed: ScoutingData.teleop.l3Dropped,
    l2Made: ScoutingData.teleop.l2Scored,
    l2Missed: ScoutingData.teleop.l2Dropped,
    l1Made: ScoutingData.teleop.l1Scored,
    l1Missed: ScoutingData.teleop.l1Dropped,
    processorMade: ScoutingData.teleop.processorScored,
    processorMissed: ScoutingData.teleop.processorDropped,
    bargeMade: ScoutingData.teleop.bargeScored,
    bargeMissed: ScoutingData.teleop.bargeDropped,
    algaeRemoved: ScoutingData.teleop.algaeRemoved
  });

  const handleScoreChange = (key: keyof typeof scores, increment: number) => {
    setScores(prev => {
      const newValue = Math.max(0, prev[key] + increment);
      
      // Update ScoutingData based on which key changed
      switch(key) {
        case 'l4Made': ScoutingData.teleop.l4Scored = newValue; break;
        case 'l4Missed': ScoutingData.teleop.l4Dropped = newValue; break;
        case 'l3Made': ScoutingData.teleop.l3Scored = newValue; break;
        case 'l3Missed': ScoutingData.teleop.l3Dropped = newValue; break;
        case 'l2Made': ScoutingData.teleop.l2Scored = newValue; break;
        case 'l2Missed': ScoutingData.teleop.l2Dropped = newValue; break;
        case 'l1Made': ScoutingData.teleop.l1Scored = newValue; break;
        case 'l1Missed': ScoutingData.teleop.l1Dropped = newValue; break;
        case 'processorMade': ScoutingData.teleop.processorScored = newValue; break;
        case 'processorMissed': ScoutingData.teleop.processorDropped = newValue; break;
        case 'bargeMade': ScoutingData.teleop.bargeScored = newValue; break;
        case 'bargeMissed': ScoutingData.teleop.bargeDropped = newValue; break;
        case 'algaeRemoved': ScoutingData.teleop.algaeRemoved = newValue; break;
      }

      return { ...prev, [key]: newValue };
    });
  };

  return (
    <div className="p-4 flex flex-col lg:grid lg:grid-cols-2 gap-4">
      <Card className="min-w-[300px]">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Coral Scoring</h2>
          {[
            { label: "L4 Made", key: "l4Made" },
            { label: "L4 Missed", key: "l4Missed" },
            { label: "L3 Made", key: "l3Made" },
            { label: "L3 Missed", key: "l3Missed" },
            { label: "L2 Made", key: "l2Made" },
            { label: "L2 Missed", key: "l2Missed" },
            { label: "L1 Made", key: "l1Made" },
            { label: "L1 Missed", key: "l1Missed" },
          ].map(({ label, key }) => (
            <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
              <span>{label}</span>
              <div className="flex items-center gap-2">
                <Button 
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => handleScoreChange(key as keyof typeof scores, -1)}
                >
                  -
                </Button>
                <span className="w-8 text-center">{scores[key as keyof typeof scores]}</span>
                <Button 
                  className="bg-green-500 hover:bg-green-400"
                  onClick={() => handleScoreChange(key as keyof typeof scores, 1)}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="min-w-[300px]">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Algae Scoring</h2>
          {[
            { label: "Processor Made", key: "processorMade" },
            { label: "Processor Missed", key: "processorMissed" },
            { label: "Barge Made", key: "bargeMade" },
            { label: "Barge Missed", key: "bargeMissed" },
            { label: "Algae Removed", key: "algaeRemoved" },
          ].map(({ label, key }) => (
            <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
              <span>{label}</span>
              <div className="flex items-center gap-2">
                <Button 
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => handleScoreChange(key as keyof typeof scores, -1)}
                >
                  -
                </Button>
                <span className="w-8 text-center">{scores[key as keyof typeof scores]}</span>
                <Button 
                  className="bg-green-500 hover:bg-green-400"
                  onClick={() => handleScoreChange(key as keyof typeof scores, 1)}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


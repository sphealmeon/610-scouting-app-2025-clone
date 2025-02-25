import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from 'react';
import { ScoutingData } from "../data";

interface Scores {
  coral: {
    L4Made: number;
    L4Missed: number;
    L3Made: number;
    L3Missed: number;
    L2Made: number;
    L2Missed: number;
    L1Made: number;
    L1Missed: number;
  };
  algae: {
    ProcessorMade: number;
    ProcessorMissed: number;
    NetMade: number;
    NetMissed: number;
    KnockedOffReef: number;
  };
}

export default function TeleopReview() {
  const [scores, setScores] = useState<Scores>({
    coral: {
      L4Made: ScoutingData.teleop.l4Scored,
      L4Missed: ScoutingData.teleop.l4Dropped,
      L3Made: ScoutingData.teleop.l3Scored,
      L3Missed: ScoutingData.teleop.l3Dropped,
      L2Made: ScoutingData.teleop.l2Scored,
      L2Missed: ScoutingData.teleop.l2Dropped,
      L1Made: ScoutingData.teleop.l1Scored,
      L1Missed: ScoutingData.teleop.l1Dropped,
    },
    algae: {
      ProcessorMade: ScoutingData.teleop.processorScored,
      ProcessorMissed: ScoutingData.teleop.processorDropped,
      NetMade: ScoutingData.teleop.bargeScored,
      NetMissed: ScoutingData.teleop.bargeDropped,
      KnockedOffReef: ScoutingData.teleop.algaeRemoved,
    },
  });

  const handleScoreChange = <T extends keyof Scores>(category: T, key: keyof Scores[T], increment: number): void => {
    setScores((prev: Scores) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: Math.max(0, (prev[category][key] as number) + increment),
      },
    }));
  };

  const renderScoringButtons = <T extends keyof Scores>(category: T, items: (keyof Scores[T])[]) => (
    <Card className="mb-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Scoring - {category}</h2>
        {items.map((item) => (
          <div key={item as string} className="flex items-center justify-between mb-2">
            <span className="text-lg">{String(item).replace(/([A-Z])/g, ' $1')}</span>
            <div className="flex items-center gap-2">
              <Button
                className="bg-red-500 hover:bg-red-400"
                onClick={() => handleScoreChange(category, item as keyof Scores[T], -1)}
              >
                -
              </Button>
              <span>{String(scores[category][item as keyof Scores[T]])}</span>
              <Button
                className="bg-green-500 hover:bg-green-400"
                onClick={() => handleScoreChange(category, item as keyof Scores[T], 1)}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 w-full mx-auto grid grid-cols-2">
      {renderScoringButtons('coral', Object.keys(scores.coral) as Array<keyof Scores['coral']>)}
      {renderScoringButtons('algae', Object.keys(scores.algae) as Array<keyof Scores['algae']>)}
    </div>
  );
}


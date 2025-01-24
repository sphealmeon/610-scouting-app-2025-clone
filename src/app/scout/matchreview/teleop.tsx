import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Interface } from 'readline';

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
      DroppedField: number;
    };
    algae: {
      ProcessorMade: number;
      ProcessorMissed: number;
      NetMade: number;
      NetMissed: number;
      DroppedField: number;
    };
}

export default function TeleopReview() {
  const [scores, setScores] = useState({
    coral: {
      L4Made: 0,
      L4Missed: 0,
      L3Made: 0,
      L3Missed: 0,
      L2Made: 0,
      L2Missed: 0,
      L1Made: 0,
      L1Missed: 0,
      DroppedField: 0,
    },
    algae: {
      ProcessorMade: 0,
      ProcessorMissed: 0,
      NetMade: 0,
      NetMissed: 0,
      DroppedField: 0,
    },
  });

  const handleScoreChange = (category: keyof Scores, key: keyof Scores["coral" | "algae"], increment: number): void => {
    setScores((prev: Scores) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: Math.max(0, prev[category][key] + increment),
      },
    }));
  };

  const renderScoringButtons = (category, items) => (
    <Card className="mb-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Scoring - {category}</h2>
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between mb-2">
            <span className="text-lg">{item.replace(/([A-Z])/g, ' $1')}</span>
            <div className="flex items-center gap-2">
              <Button
                className="bg-red-500 hover:bg-red-400"
                onClick={() => handleScoreChange(category.toLowerCase(), item, -1)}
              >
                -
              </Button>
              <span>{scores[category.toLowerCase()][item]}</span>
              <Button
                className="bg-green-500 hover:bg-green-400"
                onClick={() => handleScoreChange(category.toLowerCase(), item, 1)}
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
    <div className="m-4 p-4 mx-auto grid grid-cols-2 gap-4">
      {renderScoringButtons('Coral', Object.keys(scores.coral))}
      {renderScoringButtons('Algae', Object.keys(scores.algae))}
    </div>
  );
};

// "use client";

// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button";
// import { useState } from "react";


// export default function TeleopReview({setMatchState}: {setMatchState: Function}) {
//    const [Coral, setCoral] = useState(0);
//    const [Algae, setAlgae] = useState(0);
//    const [Fcoral, setFcoral] = useState(0);
//    const [Palgae, setPalgae] = useState(0);
//    const [Rcoral, setRcoral] = useState(0);
//    const [Ralgae, setRalgae] = useState(0);
//    const [Balgae, setBalgae] = useState(0);

//    function handleProcessorClick(){
//     setPalgae(Palgae + 1);
//     setAlgae(Algae + 1);
// }

// function handleRobotShotClick(){
//     setAlgae(Algae + 1);
//     setBalgae(Balgae + 1);
// }

// function handleFloorPickupClick(){
//     setCoral(Coral + 1);
//     setFcoral(Fcoral + 1);
// }

// function handleRemoveallAlgaeClick(){
//     setAlgae(0);
//     setPalgae(0);
//     setBalgae(0);
// }

// function handleRemoveallCoralClick(){
//     setCoral(0);
//     setFcoral(0);
// }

//    return (
//        <div className="flex flex-col items-center p-6 space-y-6 bg-gray-15 h-screen">
//            {/* <h1 className="text-7xl font-bold text-gray-10000">Match review</h1> */}
//                 <div>
//                     <p className="text-2xl space-y-6">
//                         Coral Scored: <span className="text-3xl font-semibold text-blue-500">{Coral}</span>
//                         Algae Scored: <span className="text-3xl font-semibold text-blue-500">{Algae}</span>
//                     </p>
//                     <div className="text-2xl gap-6">
//                         Floor Pickup Coral Scored: <span className="text-3xl font-semibold text-blue-500">{Fcoral}</span>
//                         Processor Scored: <span className="text-3xl font-semibold text-blue-500">{Palgae}</span>
//                     </div>
//                     <div className="text-2xl gap-6">
//                     Algae Scored in Barge: <span className="text-3xl font-semibold text-blue-500">{Balgae}</span>
//                     </div>
//                 </div>
            
//            <div className="grid grid-cols-4 gap-2"> 
//            {/* can fix this formatting later */}

//            <Button
//                onClick={handleFloorPickupClick}
//                className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
//                Floor Pickup
//            </Button>

//            <Button
//                onClick={handleProcessorClick}
//                className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
//                Processor
//            </Button>

//            <Button
//                onClick={() => setAlgae(Algae + 1)}
//                className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
//                Add Algae
//            </Button>

//            <Button
//                onClick={() => setCoral(Coral + 1)}
//                className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
//                Add Coral 
//            </Button>

//            <Button
//                onClick={handleRobotShotClick}
//                className="w-64 h-24 text-4xl bg-green-800 text-white rounded">
//                Robot Shot
//            </Button>

//            <Button
//                onClick={handleRemoveallCoralClick}
//                className="w-64 h-24 text-4xl bg-red-800 text-white rounded">
//                Remove all Coral
//            </Button>

//            <Button
//                onClick={handleRemoveallAlgaeClick}
//                className="w-64 h-24 text-4xl bg-red-800 text-white rounded">
//                Remove all Algae
//            </Button>
           
//            </div>
//        </div>
//    );
// }



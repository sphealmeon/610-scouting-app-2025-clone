import { ScoutingData } from "../../data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { scoringTableSide } from "@/app/globalVars";


interface ReefScores {
  droppedCoral: number;
  slots: {
    [key: string]: { dropped: number; droppedInL1?: number };
  };
}

const ReefMR = ({ setLeaveState }: { 
    setLeaveState: (value: number) => void 
}) => {
  const [level, setLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1');
  const [scores, setScores] = useState<ReefScores>({
    droppedCoral: ScoutingData.auto.droppedCoral,
    slots: {
      l1A: { dropped: ScoutingData.auto.l1A.dropped },
      l1B: { dropped: ScoutingData.auto.l1B.dropped },
      l1C: { dropped: ScoutingData.auto.l1C.dropped },
      l1D: { dropped: ScoutingData.auto.l1D.dropped },
      l1E: { dropped: ScoutingData.auto.l1E.dropped },
      l1F: { dropped: ScoutingData.auto.l1F.dropped },
      l2A: { dropped: ScoutingData.auto.l2A.dropped, droppedInL1: ScoutingData.auto.l2A.droppedInL1 },
      l2B: { dropped: ScoutingData.auto.l2B.dropped, droppedInL1: ScoutingData.auto.l2B.droppedInL1 },
      l2C: { dropped: ScoutingData.auto.l2C.dropped, droppedInL1: ScoutingData.auto.l2C.droppedInL1 },
      l2D: { dropped: ScoutingData.auto.l2D.dropped, droppedInL1: ScoutingData.auto.l2D.droppedInL1 },
      l2E: { dropped: ScoutingData.auto.l2E.dropped, droppedInL1: ScoutingData.auto.l2E.droppedInL1 },
      l2F: { dropped: ScoutingData.auto.l2F.dropped, droppedInL1: ScoutingData.auto.l2F.droppedInL1 },
      l2G: { dropped: ScoutingData.auto.l2G.dropped, droppedInL1: ScoutingData.auto.l2G.droppedInL1 },
      l2H: { dropped: ScoutingData.auto.l2H.dropped, droppedInL1: ScoutingData.auto.l2H.droppedInL1 },
      l2I: { dropped: ScoutingData.auto.l2I.dropped, droppedInL1: ScoutingData.auto.l2I.droppedInL1 },
      l2J: { dropped: ScoutingData.auto.l2J.dropped, droppedInL1: ScoutingData.auto.l2J.droppedInL1 },
      l2K: { dropped: ScoutingData.auto.l2K.dropped, droppedInL1: ScoutingData.auto.l2K.droppedInL1 },
      l2L: { dropped: ScoutingData.auto.l2L.dropped, droppedInL1: ScoutingData.auto.l2L.droppedInL1 },
      l3A: { dropped: ScoutingData.auto.l3A.dropped, droppedInL1: ScoutingData.auto.l3A.droppedInL1 },
      l3B: { dropped: ScoutingData.auto.l3B.dropped, droppedInL1: ScoutingData.auto.l3B.droppedInL1 },
      l3C: { dropped: ScoutingData.auto.l3C.dropped, droppedInL1: ScoutingData.auto.l3C.droppedInL1 },
      l3D: { dropped: ScoutingData.auto.l3D.dropped, droppedInL1: ScoutingData.auto.l3D.droppedInL1 },
      l3E: { dropped: ScoutingData.auto.l3E.dropped, droppedInL1: ScoutingData.auto.l3E.droppedInL1 },
      l3F: { dropped: ScoutingData.auto.l3F.dropped, droppedInL1: ScoutingData.auto.l3F.droppedInL1 },
      l3G: { dropped: ScoutingData.auto.l3G.dropped, droppedInL1: ScoutingData.auto.l3G.droppedInL1 },
      l3H: { dropped: ScoutingData.auto.l3H.dropped, droppedInL1: ScoutingData.auto.l3H.droppedInL1 },
      l3I: { dropped: ScoutingData.auto.l3I.dropped, droppedInL1: ScoutingData.auto.l3I.droppedInL1 },
      l3J: { dropped: ScoutingData.auto.l3J.dropped, droppedInL1: ScoutingData.auto.l3J.droppedInL1 },
      l3K: { dropped: ScoutingData.auto.l3K.dropped, droppedInL1: ScoutingData.auto.l3K.droppedInL1 },
      l3L: { dropped: ScoutingData.auto.l3L.dropped, droppedInL1: ScoutingData.auto.l3L.droppedInL1 },
      l4A: { dropped: ScoutingData.auto.l4A.dropped, droppedInL1: ScoutingData.auto.l4A.droppedInL1 },
      l4B: { dropped: ScoutingData.auto.l4B.dropped, droppedInL1: ScoutingData.auto.l4B.droppedInL1 },
      l4C: { dropped: ScoutingData.auto.l4C.dropped, droppedInL1: ScoutingData.auto.l4C.droppedInL1 },
      l4D: { dropped: ScoutingData.auto.l4D.dropped, droppedInL1: ScoutingData.auto.l4D.droppedInL1 },
      l4E: { dropped: ScoutingData.auto.l4E.dropped, droppedInL1: ScoutingData.auto.l4E.droppedInL1 },
      l4F: { dropped: ScoutingData.auto.l4F.dropped, droppedInL1: ScoutingData.auto.l4F.droppedInL1 },
      l4G: { dropped: ScoutingData.auto.l4G.dropped, droppedInL1: ScoutingData.auto.l4G.droppedInL1 },
      l4H: { dropped: ScoutingData.auto.l4H.dropped, droppedInL1: ScoutingData.auto.l4H.droppedInL1 },
      l4I: { dropped: ScoutingData.auto.l4I.dropped, droppedInL1: ScoutingData.auto.l4I.droppedInL1 },
      l4J: { dropped: ScoutingData.auto.l4J.dropped, droppedInL1: ScoutingData.auto.l4J.droppedInL1 },
      l4K: { dropped: ScoutingData.auto.l4K.dropped, droppedInL1: ScoutingData.auto.l4K.droppedInL1 },
      l4L: { dropped: ScoutingData.auto.l4L.dropped, droppedInL1: ScoutingData.auto.l4L.droppedInL1 },
    }
  });
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  // Define the slots in counter-clockwise order starting from left (A)
  const slots = (ScoutingData.start.alliance === "blue") !== scoringTableSide ? {
    L1: ["F", "E", "D", "C", "B", "A"],
    L2: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
    L3: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
    L4: ["A", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B"],
  } : {
    L1: ["C", "B", "A", "F", "E", "D"],
    L2: ["G", "F", "E", "D", "C", "B", "A", "L", "K", "J", "I", "H"],
    L3: ["G", "F", "E", "D", "C", "B", "A", "L", "K", "J", "I", "H"],
    L4: ["G", "F", "E", "D", "C", "B", "A", "L", "K", "J", "I", "H"],
  };

  function handleCoral () {
    ScoutingData.auto.coral++;
  }


  function handleScore(l: 'L1' | 'L2' | 'L3' | 'L4') {
    setLevel(l);
    handleCoral();
    if (l === "L1") {
      ScoutingData.auto.l1++;
    }
    if (l === "L2") {
      ScoutingData.auto.l2++;
    }
    if (l === "L3") {
      ScoutingData.auto.l3++;
    }
    if (l === "L4") {
      ScoutingData.auto.l4++;
    }
  }  

  const handleHexagonClick = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    const slotData = ScoutingData.auto[slotKey];
    
    if (typeof slotData === 'object' && 'made' in slotData) {
      if (slotData.made === 0) {
        slotData.made = 1;
        // Only set leave when scoring, not when unscoring
        if (ScoutingData.auto.leave === 0) {
          ScoutingData.auto.leave = 1;
          setLeaveState(1);
        }
        handleScore(level as 'L1' | 'L2' | 'L3' | 'L4');
        showPopup(`Scored at Level ${level}, Slot ${slot}`);
      } else {
        slotData.made = 0;
        // Decrement coral count
        ScoutingData.auto.coral--;
        // Decrement specific level counter
        switch(level) {
          case 'L1': ScoutingData.auto.l1--; break;
          case 'L2': ScoutingData.auto.l2--; break;
          case 'L3': ScoutingData.auto.l3--; break;
          case 'L4': ScoutingData.auto.l4--; break;
        }
        showPopup(`Removed score at Level ${level}, Slot ${slot}`);
      }
    }
  };

  const handleDroppedCoral = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    const slotData = ScoutingData.auto[slotKey];
    
    if (typeof slotData === 'object' && 'dropped' in slotData) {
      if (slotData.dropped === 0) {
        ScoutingData.auto.droppedCoral++;
        setLeaveState(1);
        slotData.dropped++;
        showPopup(`Dropped coral at Level ${level}, Slot ${slot}`);
      } else {
        ScoutingData.auto.droppedCoral--;
        slotData.dropped--;
        showPopup(`Removed dropped coral at Level ${level}, Slot ${slot}`);
      }
    }
  };

  const handleDroppedInL1 = (level: string, slot: string) => {
    // Only applicable for L2, L3, L4
    if (level === 'L1') return;
    
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    const slotData = ScoutingData.auto[slotKey];
    
    if (typeof slotData === 'object' && 'droppedInL1' in slotData) {
      if (slotData.droppedInL1 === 0) {
        // Mark as dropped in L1
        slotData.droppedInL1 = 1;
        // Count as a missed cycle
        ScoutingData.auto.droppedCoral++;
        // No longer incrementing L1 score
        // ScoutingData.auto.l1++;
        // And add one to coral count (just for the attempted coral, not for L1)
        ScoutingData.auto.coral++;
        // Auto-set leave when scoring
        if (ScoutingData.auto.leave === 0) {
          ScoutingData.auto.leave = 1;
        }
        setLeaveState(1);
        showPopup(`Coral dropped in L1 from Level ${level}, Slot ${slot}`);
      } else {
        // Remove the dropped in L1 marking
        slotData.droppedInL1 = 0;
        // Remove from missed count
        ScoutingData.auto.droppedCoral--;
        // No longer decrementing L1 score
        // ScoutingData.auto.l1--;
        // Remove from coral count
        ScoutingData.auto.coral--;
        showPopup(`Removed coral dropped in L1 from Level ${level}, Slot ${slot}`);
      }
    }
  };

  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  // Get the made value for a slot
  const getSlotMade = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    const slotData = ScoutingData.auto[slotKey];
    return typeof slotData === 'object' && 'made' in slotData && slotData.made > 0;
  };

  // Add this helper function
  const getSlotDropped = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    const slotData = ScoutingData.auto[slotKey];
    return typeof slotData === 'object' && 'dropped' in slotData && slotData.dropped > 0;
  };

  const getSlotDroppedInL1 = (level: string, slot: string) => {
    // Only applicable for L2, L3, L4
    if (level === 'L1') return false;
    
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    const slotData = ScoutingData.auto[slotKey];
    return typeof slotData === 'object' && 'droppedInL1' in slotData && slotData.droppedInL1 > 0;
  };

  // Add decrement handler
  const handleDecrementDropped = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    if (scores.slots[slotKey].dropped > 0) {
      setScores(prev => ({
        ...prev,
        droppedCoral: prev.droppedCoral - 1,
        slots: {
          ...prev.slots,
          [slotKey]: { dropped: prev.slots[slotKey].dropped - 1 }
        }
      }));
      ScoutingData.auto.droppedCoral--;
      const slotData = ScoutingData.auto[slotKey];
      if (typeof slotData === 'object' && 'dropped' in slotData) {
        slotData.dropped--;
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Auto Reef Review - Level {level}</h1>

      <div className="flex space-x-4 mb-4">
        {(['L1', 'L2', 'L3', 'L4'] as const).map((l) => (
          <Button
            key={l}
            variant={level === l ? "default" : "outline"}
            onClick={() => setLevel(l)}
          >
            {l}
          </Button>
        ))}
      </div>

      <div className="relative w-[400px] h-[400px]">
        <div className="absolute inset-0">
          <svg viewBox="-10 -10 120 120" className="w-full h-full">
            {slots[level].map((slot, index) => {
              const totalSlots = slots[level].length;
              const isHexagon = level !== 'L1';
              const angle = isHexagon ? 
                (index * (360 / totalSlots)): 
                (index * (360 / totalSlots)) + 30;
              const startAngle = angle * (Math.PI / 180);
              const endAngle = (angle + (360 / totalSlots)) * (Math.PI / 180);
              const centerX = 50;
              const centerY = 50;
              const radius = 40;

              // Calculate positions for the section and buttons
              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);

              // Calculate button positions
              const buttonAngle = (startAngle + endAngle) / 2;
              
              // Missed button position (slightly outside the section)
              const missedButtonRadius = radius + 5;
              const missedButtonX = centerX + missedButtonRadius * Math.cos(buttonAngle);
              const missedButtonY = centerY + missedButtonRadius * Math.sin(buttonAngle);
              
              // Dropped in L1 button position (even further outside)
              const droppedInL1ButtonRadius = radius + 15;
              const droppedInL1ButtonX = centerX + droppedInL1ButtonRadius * Math.cos(buttonAngle);
              const droppedInL1ButtonY = centerY + droppedInL1ButtonRadius * Math.sin(buttonAngle);
              
              // Square button dimensions
              const squareSize = 7;
              const squareX = droppedInL1ButtonX - squareSize / 2;
              const squareY = droppedInL1ButtonY - squareSize / 2;

              const path = `
                M ${centerX} ${centerY}
                L ${x1} ${y1}
                L ${x2} ${y2}
                Z
              `;

              const isMade = getSlotMade(level, slot);
              const isDropped = getSlotDropped(level, slot);
              const isDroppedInL1 = getSlotDroppedInL1(level, slot);

              return (
                <g key={slot}>
                  <g onClick={() => handleHexagonClick(level, slot)} className="cursor-pointer">
                    <path
                      d={path}
                      fill={isMade ? "#22c55e" : "#ef4444"}
                      stroke="black"
                      strokeWidth="0.5"
                      className="hover:opacity-80"
                    />
                    <text
                      x={centerX + (radius * 0.7) * Math.cos(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}
                      y={centerY + (radius * 0.7) * Math.sin(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="5"
                      className="pointer-events-none"
                    >
                      {slot}
                    </text>
                  </g>
                  
                  {/* Missed button */}
                  <circle
                    cx={missedButtonX}
                    cy={missedButtonY}
                    r="2.5"
                    fill={isDropped ? "#ef4444" : "#4B5563"}
                    stroke="gray-700"
                    strokeWidth="0.5"
                    className="cursor-pointer hover:fill-red-800"
                    onClick={() => handleDroppedCoral(level, slot)}
                  />

                  {/* Dropped In L1 Button - Only show for L2, L3, and L4 */}
                  {level !== 'L1' && (
                    <g 
                      onClick={() => handleDroppedInL1(level, slot)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={squareX}
                        y={squareY}
                        width={squareSize}
                        height={squareSize}
                        fill={isDroppedInL1 ? "#FBBF24" : "#4B5563"}
                        stroke="gray-700"
                        strokeWidth="0.4"
                        rx="1"
                        className="hover:fill-yellow-500"
                      />
                      <text
                        x={droppedInL1ButtonX}
                        y={droppedInL1ButtonY + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="3.5"
                        className="pointer-events-none select-none"
                      >
                        L1
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {popup.visible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2
                      bg-black bg-opacity-80 text-white px-4 py-2 rounded-md">
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default ReefMR;


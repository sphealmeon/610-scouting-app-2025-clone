import { ScoutingData } from "../data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { scoringTableSide } from "@/app/globalVars";

const Reef = ({ setLeaveState }: { 
    setLeaveState: (value: number) => void 
}) => {
  const [level, setLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1');
  const [activeSlots, setActiveSlots] = useState<Set<string>>(new Set());
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

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
        // Scoring
        slotData.made = 1;
        // Auto-set leave when scoring
        if (ScoutingData.auto.leave === 0) {
          ScoutingData.auto.leave = 1;
        }
        setLeaveState(1);
        handleScore(level as 'L1' | 'L2' | 'L3' | 'L4');
        showPopup(`Scored at Level ${level}, Slot ${slot}`);
      } else {
        // Unscoring - decrement the counters
        slotData.made = 0;
        ScoutingData.auto.coral--;  // Decrement total coral
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

  // Add helper function to check if slot is scored
  const getSlotMade = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    const slotData = ScoutingData.auto[slotKey];
    return typeof slotData === 'object' && 'made' in slotData && slotData.made > 0;
  };

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
        // Increment the overall droppedInL1 counter
        ScoutingData.auto.droppedInL1++;
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
        // Decrement the overall droppedInL1 counter
        ScoutingData.auto.droppedInL1--;
        showPopup(`Removed coral dropped in L1 from Level ${level}, Slot ${slot}`);
      }
    }
  };

  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 mb-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Auto Coral Scoring</h1>
      <h2 className="text-lg mb-6">Level {level}</h2>

      <div className="flex space-x-4">
        {(['L1', 'L2', 'L3', 'L4'] as const).map((l) => (
          <Button
            key={l}
            variant={level === l ? "default" : "outline"}
            onClick={() => setLevel(l)}
            className={`bg-gray-700 hover:bg-gray-200 text-white ${
                level === l ? "bg-gray-200 text-black" : ""
            }`}
          >
            {l}
          </Button>
        ))}
      </div>

      <div className="relative w-[450px] h-[450px]">
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
              const radius = 35;

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

              return (
                <g key={slot}>
                  {/* Section */}
                  <g onClick={() => handleHexagonClick(level, slot)}>
                    <path
                      d={path}
                      fill={getSlotMade(level, slot) ? "#17803D" : "#7F1C1D"}
                      stroke="black"
                      strokeWidth="0.5" 
                      className="cursor-pointer hover:opacity-80"
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
                  
                  {/* Missed Button */}
                  <circle
                    cx={missedButtonX}
                    cy={missedButtonY}
                    r="2.5"
                    fill={getSlotDropped(level, slot) ? "#EF4444" : "#4B5563"}
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
                        fill={getSlotDroppedInL1(level, slot) ? "#FBBF24" : "#4B5563"}
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
                      bg-black bg-opacity-80 text-white px-4 py-2 rounded">
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default Reef;


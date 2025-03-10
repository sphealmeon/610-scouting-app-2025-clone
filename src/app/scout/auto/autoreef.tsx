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

  const handleDroppedCoral = (level: string, slot: string) => {
    ScoutingData.auto.droppedCoral++;
    setLeaveState(1)
    switch(level) {
      case 'L4':
        switch(slot) {
          case 'A': ScoutingData.auto.l4A.dropped++; break;
          case 'B': ScoutingData.auto.l4B.dropped++; break;
          case 'C': ScoutingData.auto.l4C.dropped++; break;
          case 'D': ScoutingData.auto.l4D.dropped++; break;
          case 'E': ScoutingData.auto.l4E.dropped++; break;
          case 'F': ScoutingData.auto.l4F.dropped++; break;
          case 'G': ScoutingData.auto.l4G.dropped++; break;
          case 'H': ScoutingData.auto.l4H.dropped++; break;
          case 'I': ScoutingData.auto.l4I.dropped++; break;
          case 'J': ScoutingData.auto.l4J.dropped++; break;
          case 'K': ScoutingData.auto.l4K.dropped++; break;
          case 'L': ScoutingData.auto.l4L.dropped++; break;
        }
        break;
      case 'L3':
        switch(slot) {
          case 'A': ScoutingData.auto.l3A.dropped++; break;
          case 'B': ScoutingData.auto.l3B.dropped++; break;
          case 'C': ScoutingData.auto.l3C.dropped++; break;
          case 'D': ScoutingData.auto.l3D.dropped++; break;
          case 'E': ScoutingData.auto.l3E.dropped++; break;
          case 'F': ScoutingData.auto.l3F.dropped++; break;
          case 'G': ScoutingData.auto.l3G.dropped++; break;
          case 'H': ScoutingData.auto.l3H.dropped++; break;
          case 'I': ScoutingData.auto.l3I.dropped++; break;
          case 'J': ScoutingData.auto.l3J.dropped++; break;
          case 'K': ScoutingData.auto.l3K.dropped++; break;
          case 'L': ScoutingData.auto.l3L.dropped++; break;
        }
        break;
      case 'L2':
        switch(slot) {
          case 'A': ScoutingData.auto.l2A.dropped++; break;
          case 'B': ScoutingData.auto.l2B.dropped++; break;
          case 'C': ScoutingData.auto.l2C.dropped++; break;
          case 'D': ScoutingData.auto.l2D.dropped++; break;
          case 'E': ScoutingData.auto.l2E.dropped++; break;
          case 'F': ScoutingData.auto.l2F.dropped++; break;
          case 'G': ScoutingData.auto.l2G.dropped++; break;
          case 'H': ScoutingData.auto.l2H.dropped++; break;
          case 'I': ScoutingData.auto.l2I.dropped++; break;
          case 'J': ScoutingData.auto.l2J.dropped++; break;
          case 'K': ScoutingData.auto.l2K.dropped++; break;
          case 'L': ScoutingData.auto.l2L.dropped++; break;
        }
        break;
      case 'L1':
        switch(slot) {
          case 'A': ScoutingData.auto.l1A.dropped++; break;
          case 'B': ScoutingData.auto.l1B.dropped++; break;
          case 'C': ScoutingData.auto.l1C.dropped++; break;
          case 'D': ScoutingData.auto.l1D.dropped++; break;
          case 'E': ScoutingData.auto.l1E.dropped++; break;
          case 'F': ScoutingData.auto.l1F.dropped++; break;
        }
        break;
    }
    showPopup(`Dropped at Level ${level}, Slot ${slot}`);
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

      <div className="relative w-[400px] h-[400px]">
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
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

              // Calculate positions for the section and drop button
              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);

              // Calculate drop button position (slightly outside the section)
              const buttonAngle = (startAngle + endAngle) / 2;
              const buttonRadius = radius + 5;
              const buttonX = centerX + buttonRadius * Math.cos(buttonAngle);
              const buttonY = centerY + buttonRadius * Math.sin(buttonAngle);

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
                      fill={getSlotMade(level, slot) ? "#17803D" : "#7F1C1D"} // Updated colors
                      stroke="black" // Updated stroke color
                      strokeWidth="0.5" 
                      className="cursor-pointer hover:opacity-80"
                    />
                    <text
                      x={centerX + (radius * 0.7) * Math.cos(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}
                      y={centerY + (radius * 0.7) * Math.sin(startAngle + (360 / totalSlots / 2) * (Math.PI / 180))}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="6"
                      className="pointer-events-none"
                    >
                      {slot}
                    </text>
                  </g>
                  
                  {/* Drop Button */}
                  <circle
                    cx={buttonX}
                    cy={buttonY}
                    r="2"
                    fill="#4B5563" // Updated to dark grey
                    stroke="gray-700"
                    strokeWidth="0.5" 
                    className="cursor-pointer hover:fill-red-800"
                    onClick={() => {
                      handleDroppedCoral(level, slot);
                      showPopup(`Dropped coral at Level ${level}, Slot ${slot}`);
                    }}
                  />
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


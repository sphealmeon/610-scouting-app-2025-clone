import { ScoutingData } from "../../data";
import { Button } from "@/components/ui/button";
import { useState } from "react";


interface ReefScores {
  droppedCoral: number;
  slots: {
    [key: string]: { dropped: number };
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
      l2A: { dropped: ScoutingData.auto.l2A.dropped },
      l2B: { dropped: ScoutingData.auto.l2B.dropped },
      l2C: { dropped: ScoutingData.auto.l2C.dropped },
      l2D: { dropped: ScoutingData.auto.l2D.dropped },
      l2E: { dropped: ScoutingData.auto.l2E.dropped },
      l2F: { dropped: ScoutingData.auto.l2F.dropped },
      l2G: { dropped: ScoutingData.auto.l2G.dropped },
      l2H: { dropped: ScoutingData.auto.l2H.dropped },
      l2I: { dropped: ScoutingData.auto.l2I.dropped },
      l2J: { dropped: ScoutingData.auto.l2J.dropped },
      l2K: { dropped: ScoutingData.auto.l2K.dropped },
      l2L: { dropped: ScoutingData.auto.l2L.dropped },
      l3A: { dropped: ScoutingData.auto.l3A.dropped },
      l3B: { dropped: ScoutingData.auto.l3B.dropped },
      l3C: { dropped: ScoutingData.auto.l3C.dropped },
      l3D: { dropped: ScoutingData.auto.l3D.dropped },
      l3E: { dropped: ScoutingData.auto.l3E.dropped },
      l3F: { dropped: ScoutingData.auto.l3F.dropped },
      l3G: { dropped: ScoutingData.auto.l3G.dropped },
      l3H: { dropped: ScoutingData.auto.l3H.dropped },
      l3I: { dropped: ScoutingData.auto.l3I.dropped },
      l3J: { dropped: ScoutingData.auto.l3J.dropped },
      l3K: { dropped: ScoutingData.auto.l3K.dropped },
      l3L: { dropped: ScoutingData.auto.l3L.dropped },
      l4A: { dropped: ScoutingData.auto.l4A.dropped },
      l4B: { dropped: ScoutingData.auto.l4B.dropped },
      l4C: { dropped: ScoutingData.auto.l4C.dropped },
      l4D: { dropped: ScoutingData.auto.l4D.dropped },
      l4E: { dropped: ScoutingData.auto.l4E.dropped },
      l4F: { dropped: ScoutingData.auto.l4F.dropped },
      l4G: { dropped: ScoutingData.auto.l4G.dropped },
      l4H: { dropped: ScoutingData.auto.l4H.dropped },
      l4I: { dropped: ScoutingData.auto.l4I.dropped },
      l4J: { dropped: ScoutingData.auto.l4J.dropped },
      l4K: { dropped: ScoutingData.auto.l4K.dropped },
      l4L: { dropped: ScoutingData.auto.l4L.dropped },
    }
  });
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  // Define the slots in counter-clockwise order starting from left (A)
  const slots = ScoutingData.start.alliance === "red" ? {
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
        showPopup(`Removed score at Level ${level}, Slot ${slot}`);
      }
    }
  };

  const handleDroppedCoral = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}`;
    setScores(prev => ({
      ...prev,
      droppedCoral: prev.droppedCoral + 1,
      slots: {
        ...prev.slots,
        [slotKey]: { dropped: prev.slots[slotKey].dropped + 1 }
      }
    }));
    ScoutingData.auto.droppedCoral++;
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

  // Get the made value for a slot
  const getSlotMade = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}` as keyof typeof ScoutingData.auto;
    const slotData = ScoutingData.auto[slotKey];
    return typeof slotData === 'object' && 'made' in slotData && slotData.made > 0;
  };

  // Add this helper function
  const getSlotDropped = (level: string, slot: string) => {
    const slotKey = `${level.toLowerCase()}${slot}`;
    return scores.slots[slotKey].dropped;
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

              const isMade = getSlotMade(level, slot);

              return (
                <g key={slot} onClick={() => handleHexagonClick(level, slot)} className="cursor-pointer">
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
                    fontSize="6"
                  >
                    {slot}
                  </text>

                  
                  {/* Add dropped count and incrementor */}
                  <g onClick={(e) => e.stopPropagation()}>
                    <text
                      x={buttonX - 5}
                      y={buttonY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="4"
                      className="cursor-pointer"
                      onClick={() => handleDecrementDropped(level, slot)}
                    >
                      -
                    </text>
                    <text
                      x={buttonX}
                      y={buttonY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="4"
                    >
                      {getSlotDropped(level, slot)}
                    </text>
                    <text
                      x={buttonX + 5}
                      y={buttonY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="4"
                      className="cursor-pointer"
                      onClick={() => handleDroppedCoral(level, slot)}
                    >
                      +
                    </text>
                  </g>
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

export default ReefMR;


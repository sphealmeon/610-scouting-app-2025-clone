import { ScoutingData } from "../data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Reef = ({setMatchState}: {setMatchState: Function}) => {
  const [level, setLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1');
  const [activeSlots, setActiveSlots] = useState<Set<string>>(new Set());
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  // Define the slots in counter-clockwise order starting from left (A)
  const slots = {
    L1: ["C", "B", "A", "F", "E", "D"],
    L2: ["G", "F", "E", "D", "C", "B", "A", "L", "K", "J", "I", "H"],
    L3: ["G", "F", "E", "D", "C", "B", "A", "L", "K", "J", "I", "H"],
    L4: ["G", "F", "E", "D", "C", "B", "A", "L", "K", "J", "I", "H"],
  };

  function handleCoral () {
    ScoutingData.auto.coral++;
  }

  function handleDroppedCoral () {
    ScoutingData.auto.droppedCoral++;
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
    const slotKey = `${level}-${slot}`;
    const newActiveSlots = new Set(activeSlots);
    handleScore(level as 'L1' | 'L2' | 'L3' | 'L4');
    
    if (activeSlots.has(slotKey)) {
      newActiveSlots.delete(slotKey);
      switch(level) {
        case 'L4': 
          switch(slot) {
            case 'A': ScoutingData.auto.l4A = 0; break;
            case 'B': ScoutingData.auto.l4B = 0; break;
            case 'C': ScoutingData.auto.l4C = 0; break;
            case 'D': ScoutingData.auto.l4D = 0; break;
            case 'E': ScoutingData.auto.l4E = 0; break;
            case 'F': ScoutingData.auto.l4F = 0; break;
            case 'G': ScoutingData.auto.l4G = 0; break;
            case 'H': ScoutingData.auto.l4H = 0; break;
            case 'I': ScoutingData.auto.l4I = 0; break;
            case 'J': ScoutingData.auto.l4J = 0; break;
            case 'K': ScoutingData.auto.l4K = 0; break;
            case 'L': ScoutingData.auto.l4L = 0; break;
          }
          break;
        case 'L3':
          switch(slot) {
            case 'A': ScoutingData.auto.l3A = 0; break;
            case 'B': ScoutingData.auto.l3B = 0; break;
            case 'C': ScoutingData.auto.l3C = 0; break;
            case 'D': ScoutingData.auto.l3D = 0; break;
            case 'E': ScoutingData.auto.l3E = 0; break;
            case 'F': ScoutingData.auto.l3F = 0; break;
            case 'G': ScoutingData.auto.l3G = 0; break;
            case 'H': ScoutingData.auto.l3H = 0; break;
            case 'I': ScoutingData.auto.l3I = 0; break;
            case 'J': ScoutingData.auto.l3J = 0; break;
            case 'K': ScoutingData.auto.l3K = 0; break;
            case 'L': ScoutingData.auto.l3L = 0; break;
          }
          break;
        case 'L2':
          switch(slot) {
            case 'A': ScoutingData.auto.l2A = 0; break;
            case 'B': ScoutingData.auto.l2B = 0; break;
            case 'C': ScoutingData.auto.l2C = 0; break;
            case 'D': ScoutingData.auto.l2D = 0; break;
            case 'E': ScoutingData.auto.l2E = 0; break;
            case 'F': ScoutingData.auto.l2F = 0; break;
            case 'G': ScoutingData.auto.l2G = 0; break;
            case 'H': ScoutingData.auto.l2H = 0; break;
            case 'I': ScoutingData.auto.l2I = 0; break;
            case 'J': ScoutingData.auto.l2J = 0; break;
            case 'K': ScoutingData.auto.l2K = 0; break;
            case 'L': ScoutingData.auto.l2L = 0; break;
          }
          break;
        case 'L1':
          switch(slot) {
            case 'A': ScoutingData.auto.l1A = 0; break;
            case 'B': ScoutingData.auto.l1B = 0; break;
            case 'C': ScoutingData.auto.l1C = 0; break;
            case 'D': ScoutingData.auto.l1D = 0; break;
            case 'E': ScoutingData.auto.l1E = 0; break;
            case 'F': ScoutingData.auto.l1F = 0; break;
          }
          break;
      }
    } else {
      newActiveSlots.add(slotKey);
      switch(level) {
        case 'L4': 
          switch(slot) {
            case 'A': ScoutingData.auto.l4A = 1; break;
            case 'B': ScoutingData.auto.l4B = 1; break;
            case 'C': ScoutingData.auto.l4C = 1; break;
            case 'D': ScoutingData.auto.l4D = 1; break;
            case 'E': ScoutingData.auto.l4E = 1; break;
            case 'F': ScoutingData.auto.l4F = 1; break;
            case 'G': ScoutingData.auto.l4G = 1; break;
            case 'H': ScoutingData.auto.l4H = 1; break;
            case 'I': ScoutingData.auto.l4I = 1; break;
            case 'J': ScoutingData.auto.l4J = 1; break;
            case 'K': ScoutingData.auto.l4K = 1; break;
            case 'L': ScoutingData.auto.l4L = 1; break;
          }
          break;
        case 'L3':
          switch(slot) {
            case 'A': ScoutingData.auto.l3A = 1; break;
            case 'B': ScoutingData.auto.l3B = 1; break;
            case 'C': ScoutingData.auto.l3C = 1; break;
            case 'D': ScoutingData.auto.l3D = 1; break;
            case 'E': ScoutingData.auto.l3E = 1; break;
            case 'F': ScoutingData.auto.l3F = 1; break;
            case 'G': ScoutingData.auto.l3G = 1; break;
            case 'H': ScoutingData.auto.l3H = 1; break;
            case 'I': ScoutingData.auto.l3I = 1; break;
            case 'J': ScoutingData.auto.l3J = 1; break;
            case 'K': ScoutingData.auto.l3K = 1; break;
            case 'L': ScoutingData.auto.l3L = 1; break;
          }
          break;
        case 'L2':
          switch(slot) {
            case 'A': ScoutingData.auto.l2A = 1; break;
            case 'B': ScoutingData.auto.l2B = 1; break;
            case 'C': ScoutingData.auto.l2C = 1; break;
            case 'D': ScoutingData.auto.l2D = 1; break;
            case 'E': ScoutingData.auto.l2E = 1; break;
            case 'F': ScoutingData.auto.l2F = 1; break;
            case 'G': ScoutingData.auto.l2G = 1; break;
            case 'H': ScoutingData.auto.l2H = 1; break;
            case 'I': ScoutingData.auto.l2I = 1; break;
            case 'J': ScoutingData.auto.l2J = 1; break;
            case 'K': ScoutingData.auto.l2K = 1; break;
            case 'L': ScoutingData.auto.l2L = 1; break;
          }
          break;
        case 'L1':
          switch(slot) {
            case 'A': ScoutingData.auto.l1A = 1; break;
            case 'B': ScoutingData.auto.l1B = 1; break;
            case 'C': ScoutingData.auto.l1C = 1; break;
            case 'D': ScoutingData.auto.l1D = 1; break;
            case 'E': ScoutingData.auto.l1E = 1; break;
            case 'F': ScoutingData.auto.l1F = 1; break;
          }
          break;
      }
    }
    
    setActiveSlots(newActiveSlots);
    showPopup(`${activeSlots.has(slotKey) ? 'Unscored from' : 'Scored in'} Level ${level}, Slot ${slot}`);
  };

  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Auto Coral Scoring - Level {level}</h1>

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
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {slots[level].map((slot, index) => {
              const totalSlots = slots[level].length;
              // For L2-L4, use hexagon shape
              const isHexagon = level !== 'L1';
              const angle = isHexagon ? 
                (index * (360 / totalSlots)): 
                (index * (360 / totalSlots)) + 30;       // Regular shape for L1
              const startAngle = angle * (Math.PI / 180);
              const endAngle = (angle + (360 / totalSlots)) * (Math.PI / 180);
              const centerX = 50;
              const centerY = 50;
              const radius = 40;

              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);

              // Use straight lines instead of arc
              const path = `
                M ${centerX} ${centerY}
                L ${x1} ${y1}
                L ${x2} ${y2}
                Z
              `;

              const isActive = activeSlots.has(`${level}-${slot}`);

              return (
                <g key={slot} onClick={() => handleHexagonClick(level, slot)}>
                  <path
                    d={path}
                    fill={isActive ? "#22c55e" : "#ef4444"}
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
                    fontSize="6"
                    className="pointer-events-none"
                  >
                    {slot}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button onClick={() => setMatchState(0)}>Back to Start</Button>
        <Button onClick={() => setMatchState(2)}>To Teleop</Button>
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


import { ScoutingData } from "../data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Algae = ({ setLeaveState }: { 
    setLeaveState: (value: number) => void 
}) => {
  const [level, setLevel] = useState<'L2-L3' | 'L3-L4'>('L2-L3');
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  // Define which slots can have algae for each level
  const algaePositions = {
    'L2-L3': new Set(['A', 'E', 'C']),
    'L3-L4': new Set(['F', 'D', 'B']),
  };

  const slots = ScoutingData.start.alliance === "red" 
    ? ["F", "E", "D", "C", "B", "A"]
    : ["C", "B", "A", "F", "E", "D"];

  const getSlotKnocked = (level: string, slot: string) => {
    if (level === 'L2-L3') {
      switch(slot) {
        case 'A': return ScoutingData.auto.algaeA > 0;
        case 'E': return ScoutingData.auto.algaeE > 0;
        case 'C': return ScoutingData.auto.algaeC > 0;
        default: return false;
      }
    } else {
      switch(slot) {
        case 'B': return ScoutingData.auto.algaeB > 0;
        case 'F': return ScoutingData.auto.algaeF > 0;
        case 'D': return ScoutingData.auto.algaeD > 0;
        default: return false;
      }
    }
  };

  const handleHexagonClick = (level: string, slot: string) => {
    if (!algaePositions[level as keyof typeof algaePositions].has(slot)) return;
    
    const isKnocked = getSlotKnocked(level, slot);
    
    if (!isKnocked) {
      ScoutingData.auto.algae++;
      if (ScoutingData.auto.leave === 0) {
        ScoutingData.auto.leave = 1;
      }
      setLeaveState(1);

      if (level === 'L2-L3') {
        switch(slot) {
          case 'A': ScoutingData.auto.algaeA++; break;
          case 'E': ScoutingData.auto.algaeE++; break;
          case 'C': ScoutingData.auto.algaeC++; break;
        }
      } else {
        switch(slot) {
          case 'B': ScoutingData.auto.algaeB++; break;
          case 'F': ScoutingData.auto.algaeF++; break;
          case 'D': ScoutingData.auto.algaeD++; break;
        }
      }
      showPopup(`Knocked off algae at ${level}, Slot ${slot}`);
    } else {
      ScoutingData.auto.algae--;
      if (level === 'L2-L3') {
        switch(slot) {
          case 'A': ScoutingData.auto.algaeA = 0; break;
          case 'E': ScoutingData.auto.algaeE = 0; break;
          case 'C': ScoutingData.auto.algaeC = 0; break;
        }
      } else {
        switch(slot) {
          case 'B': ScoutingData.auto.algaeB = 0; break;
          case 'F': ScoutingData.auto.algaeF = 0; break;
          case 'D': ScoutingData.auto.algaeD = 0; break;
        }
      }
      showPopup(`Removed algae at ${level}, Slot ${slot}`);
    }
  };

  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  return (
    <div className="flex flex-col items-center p-6 mb-4 space-y-4">
      <h1 className="text-xl font-bold">Auto Algae Knock Off</h1>
      <h2 className="text-lg mt-0">Level {level}</h2>

      <div className="flex space-x-4">
        {(['L2-L3', 'L3-L4'] as const).map((l) => (
          <Button
            key={l}
            variant={level === l ? "default" : "outline"}
            style={{ backgroundColor: "#149632" }}
            onClick={() => setLevel(l)}
          >
            {l}
          </Button>
        ))}
      </div>

      <div className="relative w-[400px] h-[400px]">
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {slots.map((slot, index) => {
              const totalSlots = slots.length;
              const angle = (index * (360 / totalSlots)) + 30;
              const startAngle = angle * (Math.PI / 180);
              const endAngle = (angle + (360 / totalSlots)) * (Math.PI / 180);
              const centerX = 50;
              const centerY = 50;
              const radius = 40;

              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);

              const path = `
                M ${centerX} ${centerY}
                L ${x1} ${y1}
                L ${x2} ${y2}
                Z
              `;

              const hasAlgae = algaePositions[level].has(slot);
              const isActive = getSlotKnocked(level, slot);
              const fillColor = !hasAlgae ? "#4B5563" : 
                              isActive ? "#149632" : 
                              "#C8442E";

              return (
                <g 
                  key={slot} 
                  onClick={() => handleHexagonClick(level, slot)}
                  className={hasAlgae ? "cursor-pointer" : ""}
                >
                  <path
                    d={path}
                    fill={fillColor}
                    stroke="black"
                    strokeWidth="0.5"
                    className={hasAlgae ? "hover:opacity-80" : ""}
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
        <Button 
            onClick={() => ScoutingData.auto.barge++} 
            style={{ backgroundColor: "#149632" }}
            className="text-white hover:bg-opacity-80 w-40 h-16 text-lg"
        >
            Barge Scored
        </Button>
        <Button 
            onClick={() => ScoutingData.auto.processor++} 
            style={{ backgroundColor: "#149632" }}
            className="text-white hover:bg-opacity-80 w-40 h-16 text-lg"
        >
            Processor Scored
        </Button>
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

export default Algae;
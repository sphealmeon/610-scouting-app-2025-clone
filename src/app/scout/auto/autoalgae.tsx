import { ScoutingData } from "../data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Algae = () => {
  const [level, setLevel] = useState<'L2-L3' | 'L3-L4'>('L2-L3');
  const [activeSlots, setActiveSlots] = useState<Set<string>>(new Set());
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  // Define which slots can have algae for each level
  const algaePositions = {
    'L2-L3': new Set(['A', 'E', 'C']),
    'L3-L4': new Set(['F', 'D', 'B']),
  };

  const slots = ["C", "B", "A", "F", "E", "D"];

  const handleHexagonClick = (level: string, slot: string) => {
    if (!algaePositions[level as keyof typeof algaePositions].has(slot)) return;
    
    const slotKey = `${level}-${slot}`;
    const newActiveSlots = new Set(activeSlots);
    
    if (activeSlots.has(slotKey)) {
      newActiveSlots.delete(slotKey);
    } else {
      newActiveSlots.add(slotKey);
      ScoutingData.auto.algae++;
      // Auto-set leave when scoring
      if (ScoutingData.auto.leave === 0) {
        ScoutingData.auto.leave = 1;
      }
      
      if (level === 'L2-L3') {
        switch(slot) {
          case 'A':
            ScoutingData.auto.algaeA++;
            break;
          case 'E':
            ScoutingData.auto.algaeE++;
            break;
          case 'C':
            ScoutingData.auto.algaeC++;
            break;
        }
      } else { // L3-L4
        switch(slot) {
          case 'B':
            ScoutingData.auto.algaeB++;
            break;
          case 'F':
            ScoutingData.auto.algaeF++;
            break;
          case 'D':
            ScoutingData.auto.algaeD++;
            break;
        }
      }
    }
    
    setActiveSlots(newActiveSlots);
    showPopup(`${activeSlots.has(slotKey) ? 'Removed' : 'Knocked off'} algae at ${level}, Slot ${slot}`);
  };

  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Auto Algae Knock Off - {level}</h1>

      <div className="flex space-x-4 mb-4">
        {(['L2-L3', 'L3-L4'] as const).map((l) => (
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
              const isActive = activeSlots.has(`${level}-${slot}`);
              const fillColor = !hasAlgae ? "#9ca3af" : // grey for non-algae spots
                              isActive ? "#22c55e" : // green for knocked off
                              "#ef4444"; // red for algae not knocked off

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
        <Button onClick={() => ScoutingData.auto.barge++}>Barge Scored</Button>
        <Button onClick={() => ScoutingData.auto.processor++}>Processor Scored</Button>
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
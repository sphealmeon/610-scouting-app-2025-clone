import { ScoutingData } from "@/app/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Reef = ({setMatchState}: {setMatchState: Function}) => {

  function handleLeave () {
    ScoutingData.auto.leave = 1;
  }

  function handleCoral () {
    ScoutingData.auto.coral++;
  }

  function handleAlgae () {
    ScoutingData.auto.algae++;
  }

  function handleDroppedCoral () {
    ScoutingData.auto.droppedCoral++;
  }

  function handleDroppedAlgae () {
    ScoutingData.auto.droppedAlgae++;
  }

  function handleScore(l: 'L1' | 'L2' | 'L3' | 'L4') {
    setLevel(l);
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

  function handleProcessor () {
    ScoutingData.auto.processor++;
  }

  function handleBarge () {
    ScoutingData.auto.barge++;
  }

  const [level, setLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1');
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  const boards: Record<'L1' | 'L2' | 'L3' | 'L4', string[]> = {
    L1: ["A", "B", "C", "D", "E", "F"],
    L2: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    L3: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    L4: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
  };

  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Auto Coral Scoring</h1>
      <h1 className="text-xl font-bold">Current Level: {level}</h1>

      <div className="flex space-x-4">
        {(["L1", "L2", "L3", "L4"] as const).map((l) => (
          <Button
            key={l}
            className="text-white px-4 py-2 rounded"
            onClick={() => handleScore(l)}
          >
            {l}
          </Button>
        ))}
      </div>

      <div className="hexagonal-container">
        {boards[level].map((label, index) => (
          <div
            key={index}
            className="hexagon hover:neumorphic"
            onClick={() => showPopup(`Level: ${level}, Button: ${label}`)}
          >
            {label}
          </div>
        ))}
        
      </div>
      <div className="flex flex-row gap-4">
        <Button
          onClick={() => setMatchState(0)}
        >
          Back to Start
        </Button>
        <Button
          onClick={() => setMatchState(2)}
        >
        To Teleop
        </Button>
      </div>

      {popup.visible && (
        <div className="popup">
          <span>{popup.message}</span>
        </div>
      )}

      <style jsx>{`
        .hexagonal-container {
          display: grid;
          justify-content: center;
          align-items: center;
          margin: auto;
          gap: 10px;
          height: 300px; /* Adjust the height as needed */
          display: flex;
          flex-wrap: wrap;
        }

        .hexagon {
          width: 60px;
          height: 60px;
          background: #e0e0e0;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          text-align: center;
          cursor: pointer;
          box-shadow: 4px 4px 6px #b8b8b8, -4px -4px 6px #ffffff;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .hexagon.hover:hover {
          transform: scale(1.1);
          box-shadow: inset 4px 4px 6px #b8b8b8, inset -4px -4px 6px #ffffff;
        }

        @media (max-width: 768px) {
          .hexagonal-container {
            grid-template-columns: repeat(4, 1fr);
          }

          .hexagon {
            width: 40px;
            height: 40px;
          }
        }

        /* For L2, L3, and L4, set a two-row layout */
        .hexagonal-container.L2,
        .hexagonal-container.L3,
        .hexagonal-container.L4 {
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(2, 1fr);
        }

        .popup {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border-radius: 5px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Reef;


import { ScoutingData } from "@/app/scout/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Algae = () => {
  const [level, setLevel] = useState<'L2-L3' | 'L3-L4'>('L2-L3');
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  const boards: Record<'L2-L3' | 'L3-L4', string[]> = {
    'L2-L3': ['A', 'E', 'I'],
    'L3-L4': ['c', 'G', 'J'],
  };

  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  function handleProcessor () {
    showPopup("Score Processor button clicked")
    ScoutingData.auto.processor++;
  }
  
  function handleBarge () {
    showPopup("Score Barge button clicked")
    ScoutingData.auto.barge++;
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Auto Algae Knock Off</h1>
      <h1 className="text-xl font-bold">Current Toggle: {level}</h1>

      <div className="flex space-x-4">
        {(['L2-L3', 'L3-L4'] as const).map((l) => (
          <Button
            key={l}
            className="text-white px-4 py-2 rounded"
            onClick={() => setLevel(l)}
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
            onClick={() => showPopup(`Toggle: ${level}, Button: ${label}`)}
          >
            {label}
          </div>
        ))}
      </div>

      {popup.visible && (
        <div className="popup">
          <span>{popup.message}</span>
        </div>
      )}

      <div className="flex space-x-4 mt-4">
        <Button
          className="text-white px-4 py-2 rounded bg-blue-500"
          onClick={handleBarge}
        >
          Score Barge?
        </Button>
        <Button
          className="text-white px-4 py-2 rounded bg-green-500"
          onClick={handleProcessor}
        >
          Score Processor?
        </Button>
      </div>

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

        /* For L2-L3 and L3-L4, set grid layout */
        .hexagonal-container.L2-L3,
        .hexagonal-container.L3-L4 {
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: 1fr;
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

export default Algae;
import { useState } from "react";

const Reef = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(0); // Default to L1
  const [toggleStates, setToggleStates] = useState([
    new Array(6).fill(false), // L1
    new Array(12).fill(false), // L2
    new Array(12).fill(false), // L3
    new Array(12).fill(false), // L4
  ]); // Separate toggle states for each level
  const hexagonRadius = 100; // Radius of the hexagon
  const levels = ["L1", "L2", "L3", "L4"]; // Button labels
  const segments = [6, 12, 12, 12]; // Number of segments for each level
  
  const drawHexagonSegment = (radius: number, totalSegments: number, segmentIndex: number) => {
    const angleStep = (360 / totalSegments) * (Math.PI / 180); // Divide the 360 degrees by the total segments
    const startAngle = segmentIndex * angleStep;
    const endAngle = (segmentIndex + 1) * angleStep;

    const startX = radius * Math.cos(startAngle);
    const startY = radius * Math.sin(startAngle);
    const endX = radius * Math.cos(endAngle);
    const endY = radius * Math.sin(endAngle);

    return {
      segmentPath: `M0,0 L${startX},${startY} L${endX},${endY} Z`,
    };
  };

  const handleClick = (segmentIndex: number) => {
    if (selectedLevel !== null && selectedLevel >= 0) {
      const newToggleStates = [...toggleStates];
      newToggleStates[selectedLevel][segmentIndex] = !newToggleStates[selectedLevel][segmentIndex];
      setToggleStates(newToggleStates);
    }
  };

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="w-1/3 p-4">
        <h2>Basic Info</h2>
        <div>
          <label>
            <input type="checkbox" /> Leave?
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" /> Preload?
          </label>
        </div>
      </div>

      <div className="w-1/3 p-4 flex flex-col items-center">
        <div className="mb-4">
          {levels.map((level, index) => (
            <button
              key={level}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedLevel(index)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="relative w-[300px] h-[300px]">
          {selectedLevel !== null && (
            <svg viewBox="-150 -150 300 300" className="absolute w-full h-full">
              <polygon
                points={Array.from({ length: 6 })
                  .map((_, i) => {
                    const angle = (i * 60 * Math.PI) / 180; // Hexagon
                    const x = hexagonRadius * Math.cos(angle);
                    const y = hexagonRadius * Math.sin(angle);
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="black"
                strokeWidth="2"
              />

              {selectedLevel === 0 &&
                Array.from({ length: segments[selectedLevel] }).map((_, segmentIndex) => {
                  const { segmentPath } = drawHexagonSegment(
                    hexagonRadius,
                    segments[selectedLevel],
                    segmentIndex
                  );

                  return (
                    <path
                      key={segmentIndex}
                      d={segmentPath}
                      fill="rgba(0, 0, 255, 0.1)"
                      stroke="black"
                      strokeWidth="1"
                      className="cursor-pointer hover:fill-blue-300"
                      onClick={() => handleClick(segmentIndex)}
                    />
                  );
                })}

              {(selectedLevel === 1 || selectedLevel === 2 || selectedLevel === 3) &&
                Array.from({ length: segments[selectedLevel] }).map((_, segmentIndex) => {
                  const { segmentPath } = drawHexagonSegment(
                    hexagonRadius,
                    12,
                    segmentIndex
                  );

                  const isActive = toggleStates[selectedLevel][segmentIndex];
                  const fillColor = isActive ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 255, 0.1)";

                  return (
                    <path
                      key={segmentIndex}
                      d={segmentPath}
                      fill={fillColor}
                      stroke="black"
                      strokeWidth="1"
                      className="cursor-pointer"
                      onClick={() => handleClick(segmentIndex)}
                    />
                  );
                })}
            </svg>
          )}
        </div>
      </div>

      <div className="w-1/3 p-4">
        <h2>Reef Algae</h2>
        <div className="mb-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            L2
          </button>
        </div>
        <div className="mb-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            L3
          </button>
        </div>
        <div className="mb-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            L4
          </button>
        </div>

        <div className="relative w-[300px] h-[300px]">
          <svg viewBox="-150 -150 300 300" className="absolute w-full h-full">
            <polygon
              points={Array.from({ length: 6 })
                .map((_, i) => {
                  const angle = (i * 60 * Math.PI) / 180;
                  const x = hexagonRadius * Math.cos(angle);
                  const y = hexagonRadius * Math.sin(angle);
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            
            {selectedLevel === 1 &&
              Array.from({ length: segments[1] }).map((_, segmentIndex) => {
                const { segmentPath } = drawHexagonSegment(
                  hexagonRadius,
                  segments[1],
                  segmentIndex
                );

                const isActive = toggleStates[1][segmentIndex];
                const fillColor = isActive ? "rgba(0, 255, 0, 0.5)" : "rgba(0, 255, 0, 0.1)";

                return (
                  <path
                    key={segmentIndex}
                    d={segmentPath}
                    fill={fillColor}
                    stroke="black"
                    strokeWidth="1"
                    className="cursor-pointer"
                    onClick={() => handleClick(segmentIndex)}
                  />
                );
              })}

            {selectedLevel === 2 &&
              Array.from({ length: segments[2] }).map((_, segmentIndex) => {
                const { segmentPath } = drawHexagonSegment(
                  hexagonRadius,
                  segments[2],
                  segmentIndex
                );

                const isActive = toggleStates[2][segmentIndex];
                const fillColor = isActive ? "rgba(255, 0, 0, 0.5)" : "rgba(255, 0, 0, 0.1)";

                return (
                  <path
                    key={segmentIndex}
                    d={segmentPath}
                    fill={fillColor}
                    stroke="black"
                    strokeWidth="1"
                    className="cursor-pointer"
                    onClick={() => handleClick(segmentIndex)}
                  />
                );
              })}

            {selectedLevel === 3 &&
              Array.from({ length: segments[3] }).map((_, segmentIndex) => {
                const { segmentPath } = drawHexagonSegment(
                  hexagonRadius,
                  segments[3],
                  segmentIndex
                );

                const isActive = toggleStates[3][segmentIndex];
                const fillColor = isActive ? "rgba(255, 255, 0, 0.5)" : "rgba(255, 255, 0, 0.1)";

                return (
                  <path
                    key={segmentIndex}
                    d={segmentPath}
                    fill={fillColor}
                    stroke="black"
                    strokeWidth="1"
                    className="cursor-pointer"
                    onClick={() => handleClick(segmentIndex)}
                  />
                );
              })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Reef;
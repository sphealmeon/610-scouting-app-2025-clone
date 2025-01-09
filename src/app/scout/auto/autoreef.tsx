import { useState } from "react";

const Reef = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const hexagonRadius = 100; // Radius of the hexagon
  const perpendicularDistance = 86; // Perpendicular Distance
  const levels = ["L1", "L2", "L3", "L4"]; // Button labels
  const segments = [6, 12, 12, 12]; // Number of sections for each level

  const drawHexagonSegment = (radius: number, totalSegments: number, segmentIndex: number) => {
    const angleStep = (360 / totalSegments) * (Math.PI / 180); // Divide the 360 degrees by the total segments

    // Find the angle for this segment
    const startAngle = (segmentIndex) * angleStep;
    const endAngle = (segmentIndex + 1) * angleStep;

    // Calculate the points for the segment within the hexagon
    const startX = radius * Math.cos(startAngle);
    const startY = radius * Math.sin(startAngle);
    const endX = radius * Math.cos(endAngle);
    const endY = radius * Math.sin(endAngle);

    return {
      segmentPath: `M0,0 L${startX},${startY} L${endX},${endY} Z`,
    };
  };

  const drawPerpendicularSegment = (radius: number, totalSegments: number, segmentIndex: number) => {
    const angleStep = (360 / totalSegments) * (Math.PI / 180); // Divide the 360 degrees by the total segments

    // Find the angle for this segment
    const startAngle = (segmentIndex) * angleStep;
    const endAngle = (segmentIndex + 0.5) * angleStep;

    // Calculate the points for the segment within the hexagon
    const startX = radius * Math.cos(startAngle);
    const startY = radius * Math.sin(startAngle);
    const endX = radius * Math.cos(endAngle);
    const endY = radius * Math.sin(endAngle);

    return {
      perpendicularPath: `M0,0 L${startX},${startY} L${endX},${endY} Z`,
    };
  };

  const handleClick = (segmentIndex: number) => {
    alert(`Clicked segment ${segmentIndex + 1}`);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Buttons */}
      <div className="mb-4 flex gap-2">
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

      {/* Hexagon */}
      <div className="relative w-[300px] h-[300px]">
        {selectedLevel !== null && (
          <svg viewBox="-150 -150 300 300" className="absolute w-full h-full">
            {/* Draw hexagon outline */}
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

            {/* Draw segments for L1 (6 segments) */}
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

            {/* Draw segments for L2, L3, L4 (12 segments) */}
            {(selectedLevel === 1 || selectedLevel === 2 || selectedLevel === 3) &&
              Array.from({ length: segments[selectedLevel] }).map((_, segmentIndex) => {
                const { segmentPath } = drawHexagonSegment(
                  hexagonRadius,
                  12, // Always 12 segments for these levels
                  segmentIndex
                );

                const { perpendicularPath } = drawPerpendicularSegment(
                  perpendicularDistance,
                  6,
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
          </svg>
        )}
      </div>
    </div>
  );
};

export default Reef;
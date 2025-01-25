import React from 'react';

interface LevelPolygonProps {
  slots: string[];
  onSlotClick: (slot: string) => void;
  level: string;
}

export const LevelPolygon = ({ slots, onSlotClick, level }: LevelPolygonProps) => {
  const size = 300;
  const center = size / 2;
  const points = [];
  const edges = [];
  const isExtendedLevel = level !== 'L1';
  const numSides = 6;
  
  // Calculate points for hexagon, starting with flat side at bottom
  for (let i = 0; i < numSides; i++) {
    const angle = (i * Math.PI) / 3 + (Math.PI / 6); // Rotate 30 degrees to get flat bottom
    const x = center + size * 0.4 * Math.cos(angle);
    const y = center + size * 0.4 * Math.sin(angle);
    points.push([x, y]);
    
    const nextIndex = (i + 1) % numSides;
    const nextAngle = (nextIndex * Math.PI) / 3 + Math.PI / 6;
    const nextX = center + size * 0.4 * Math.cos(nextAngle);
    const nextY = center + size * 0.4 * Math.sin(nextAngle);
    
    if (isExtendedLevel) {
      // For L2, L3, L4: Two slots per edge
      const slot1Index = i * 2;
      const slot2Index = i * 2 + 1;
      
      // Calculate the midpoint for splitting the edge
      const midX = (x + nextX) / 2;
      const midY = (y + nextY) / 2;
      
      if (slot1Index < slots.length) {
        edges.push({
          x1: x,
          y1: y,
          x2: midX,
          y2: midY,
          labelX: (x + midX) / 2,
          labelY: (y + midY) / 2,
          slot: slots[slot1Index],
          id: `edge-${slot1Index}`
        });
      }
      
      if (slot2Index < slots.length) {
        edges.push({
          x1: midX,
          y1: midY,
          x2: nextX,
          y2: nextY,
          labelX: (midX + nextX) / 2,
          labelY: (midY + nextY) / 2,
          slot: slots[slot2Index],
          id: `edge-${slot2Index}`
        });
      }
    } else {
      // For L1: One slot per edge
      edges.push({
        x1: x,
        y1: y,
        x2: nextX,
        y2: nextY,
        labelX: (x + nextX) / 2,
        labelY: (y + nextY) / 2,
        slot: slots[i],
        id: `edge-${i}`
      });
    }
  }

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Base hexagon */}
      <polygon
        points={points.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Clickable edges with labels */}
      {edges.map((edge) => (
        <g key={edge.id}>
          <line
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="#e2e8f0"  // Light gray base color
            strokeWidth="30"
            className="hover:stroke-blue-500 transition-colors cursor-pointer"
            onClick={() => onSlotClick(edge.slot)}
          />
          <text
            x={edge.labelX}
            y={edge.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-bold pointer-events-none"
            fill="black"
          >
            {edge.slot}
          </text>
        </g>
      ))}
    </svg>
  );
}; 
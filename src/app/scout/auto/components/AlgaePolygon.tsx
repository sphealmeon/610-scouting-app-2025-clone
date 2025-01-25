import React from 'react';

interface AlgaePolygonProps {
  slots: string[];
  onSlotClick: (slot: string) => void;
  level: string;
}

export const AlgaePolygon = ({ slots, onSlotClick, level }: AlgaePolygonProps) => {
  const size = 300;
  const center = size / 2;
  const points = [];
  const edges = [];
  const fillerEdges = [];
  const numSides = 6;
  
  // Calculate all corner points for the hexagon
  for (let i = 0; i < numSides; i++) {
    const angle = (i * Math.PI) / 3 + (Math.PI / 6);
    const x = center + size * 0.4 * Math.cos(angle);
    const y = center + size * 0.4 * Math.sin(angle);
    points.push([x, y]);
  }

  // Define the active edges we want (bottom-left, top-right, bottom-right)
  const activeEdges = [
    { start: 4, end: 5, slot: slots[0] }, // Bottom-left edge (A/B)
    { start: 1, end: 2, slot: slots[1] }, // Top-right edge (C/D)
    { start: 2, end: 3, slot: slots[2] }, // Bottom-right edge (E/F)
  ];

  // Create active edges
  activeEdges.forEach((edge, idx) => {
    const startX = center + size * 0.4 * Math.cos((edge.start * Math.PI) / 3 + (Math.PI / 6));
    const startY = center + size * 0.4 * Math.sin((edge.start * Math.PI) / 3 + (Math.PI / 6));
    const endX = center + size * 0.4 * Math.cos((edge.end * Math.PI) / 3 + (Math.PI / 6));
    const endY = center + size * 0.4 * Math.sin((edge.end * Math.PI) / 3 + (Math.PI / 6));

    edges.push({
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      labelX: (startX + endX) / 2,
      labelY: (startY + endY) / 2,
      slot: edge.slot,
      id: `edge-${idx}`
    });
  });

  // Create filler edges for the remaining sides
  const fillerPositions = [[0,1], [3,4], [5,0]]; // Remaining edge positions
  fillerPositions.forEach((pos, idx) => {
    const startX = center + size * 0.4 * Math.cos((pos[0] * Math.PI) / 3 + (Math.PI / 6));
    const startY = center + size * 0.4 * Math.sin((pos[0] * Math.PI) / 3 + (Math.PI / 6));
    const endX = center + size * 0.4 * Math.cos((pos[1] * Math.PI) / 3 + (Math.PI / 6));
    const endY = center + size * 0.4 * Math.sin((pos[1] * Math.PI) / 3 + (Math.PI / 6));

    fillerEdges.push({
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      id: `filler-${idx}`
    });
  });

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Base hexagon */}
      <polygon
        points={points.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Filler edges (unclickable) */}
      {fillerEdges.map((edge) => (
        <line
          key={edge.id}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke="#f0f0f0"  // Lighter gray for inactive edges
          strokeWidth="30"
          className="cursor-not-allowed"
        />
      ))}
      
      {/* Active edges with labels */}
      {edges.map((edge) => (
        <g key={edge.id}>
          <line
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="#e2e8f0"
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
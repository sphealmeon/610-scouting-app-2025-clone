"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AggregateData } from "../interfaces"

interface RadarChartProps {
    teamsData: { [key: string]: AggregateData }
}

interface RadarChartData {
    stat: string
    [key: string]: any
}

// Custom tooltip component to display original values
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-green-800 border rounded-md shadow-md p-2">
                <p className="font-medium">{label}</p>
                {payload.map((entry: any, index: number) => {
                    const teamKey = entry.dataKey;
                    const valueKey = `${teamKey}Value`;
                    const value = entry.payload[valueKey];
                    
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
                            <p style={{ color: entry.color }}>
                                {entry.name}: {value !== undefined ? value.toFixed(2) : "N/A"}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

// Define colors for teams
const teamColors = [
    "hsl(12, 100%, 40%)",  // Red
    "hsl(200, 100%, 40%)", // Blue
    "hsl(152, 100%, 30%)", // Green
    "hsl(45, 100%, 45%)",  // Yellow
    "hsl(280, 100%, 45%)", // Purple
    "hsl(25, 100%, 45%)"   // Orange
]

const RadarChart = ({ teamsData }: RadarChartProps) => {
    const formatData = (): RadarChartData[] => {
        if (!teamsData || Object.keys(teamsData).length === 0) {
            return [];
        }

        const stats = [
            { key: 'coralCyclesScored', label: 'Coral Cycles', multiplier: 1 },
            { key: 'algaeCyclesScored', label: 'Algae Cycles', multiplier: 1 },
            { 
                key: 'autoPieces', 
                label: 'Auto Pieces', 
                multiplier: 1,
                calculateValue: (teamData: AggregateData) => {
                    // Calculate auto pieces from the match aggregate data
                    // This is an approximation based on auto scoring
                    const autoData = teamData.matchAggregateData?.auto || {};
                    const coral = autoData.coral || 0;
                    const algae = autoData.algae || 0;
                    return coral + algae;
                }
            },
            { 
                key: 'totalPPG', 
                label: 'Total PPG', 
                multiplier: 1,
                calculateValue: (teamData: AggregateData) => {
                    return (teamData.autoPPG || 0) + (teamData.teleopPPG || 0) + (teamData.endgamePPG || 0);
                }
            },
            { key: 'endgamePPG', label: 'Endgame PPG', multiplier: 1 },
        ];

        // First pass: collect all values to find maximums for each stat
        const maxValues: Record<string, number> = {};
        stats.forEach(({ key, calculateValue }) => {
            maxValues[key] = 0;
            Object.values(teamsData).forEach((teamData) => {
                if (teamData) {
                    let value: number;
                    
                    // Use the calculateValue function if provided, otherwise use the key directly
                    if (calculateValue) {
                        value = calculateValue(teamData);
                    } else if (teamData[key as keyof AggregateData] !== undefined) {
                        value = teamData[key as keyof AggregateData] as number;
                    } else {
                        value = 0;
                    }
                    
                    if (value > maxValues[key]) {
                        maxValues[key] = value;
                    }
                }
            });
        });

        return stats.map(({ key, label, multiplier, calculateValue }) => {
            const dataPoint: RadarChartData = { stat: label };
            Object.entries(teamsData).forEach(([teamNumber, teamData]) => {
                if (teamData) {
                    let value: number;
                    
                    // Use the calculateValue function if provided, otherwise use the key directly
                    if (calculateValue) {
                        value = calculateValue(teamData);
                    } else if (teamData[key as keyof AggregateData] !== undefined) {
                        value = teamData[key as keyof AggregateData] as number;
                    } else {
                        value = 0;
                    }
                    
                    // Store the original value for tooltip display
                    dataPoint[`team${teamNumber}Value`] = value;
                    // Store the normalized value (0-90 scale) for radar visualization
                    // Using 90 instead of 100 to leave a small gap around the edges
                    dataPoint[`team${teamNumber}`] = maxValues[key] > 0 ? (value / maxValues[key]) * 90 : 0;
                } else {
                    dataPoint[`team${teamNumber}Value`] = 0;
                    dataPoint[`team${teamNumber}`] = 0;
                }
            });
            return dataPoint;
        });
    };

    // Return early if no data
    if (!teamsData || Object.keys(teamsData).length === 0) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">Select teams to view comparison</p>
            </div>
        );
    }

    // Debug - display data
    console.log("Formatted data:", formatData());
    
    return (
        <Card className="w-full">
            <CardHeader>
                {/* <CardTitle>Team Comparison</CardTitle> */}
            </CardHeader>
            <CardContent>
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsRadarChart data={formatData()}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="stat" />
                            <Tooltip content={<CustomTooltip />} />
                            {Object.keys(teamsData).map((teamNumber, index) => (
                                <Radar
                                    key={teamNumber}
                                    name={`Team ${teamNumber}`}
                                    dataKey={`team${teamNumber}`}
                                    fill={teamColors[index % teamColors.length]}
                                    fillOpacity={0.6}
                                    stroke={teamColors[index % teamColors.length]}
                                />
                            ))}
                            <Legend />
                        </RechartsRadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-xs text-center text-muted-foreground mt-2">
                    Chart displays data proportionally. Hover for actual values.
                </div>
            </CardContent>
        </Card>
    );
};

export default RadarChart;
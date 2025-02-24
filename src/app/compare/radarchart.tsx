"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AggregateData } from "../interfaces"

interface RadarChartProps {
    teamsData: { [key: string]: AggregateData }
}

interface RadarChartData {
    stat: string
    [key: string]: any
}

// Define colors for teams
const teamColors = [
    "hsl(152, 100%, 30%)", // Green
    "hsl(12, 100%, 40%)",  // Red
    "hsl(200, 100%, 40%)", // Blue
    "hsl(45, 100%, 45%)",  // Yellow
    "hsl(280, 100%, 45%)", // Purple
    "hsl(25, 100%, 45%)"   // Orange
]

const chartConfig = {
    team1: { label: "Team 1", color: teamColors[0] },
    team2: { label: "Team 2", color: teamColors[1] },
    team3: { label: "Team 3", color: teamColors[2] },
    team4: { label: "Team 4", color: teamColors[3] },
    team5: { label: "Team 5", color: teamColors[4] },
    team6: { label: "Team 6", color: teamColors[5] },
} satisfies ChartConfig

const RadarChart = ({ teamsData }: RadarChartProps) => {
    const formatData = (): RadarChartData[] => {
        if (!teamsData || Object.keys(teamsData).length === 0) {
            return [];
        }

        const stats = [
            { key: 'coralCyclesScored', label: 'Teleop Coral Cycles', multiplier: 3 },
            { key: 'algaeCyclesScored', label: 'Teleop Algae Cycles', multiplier: 5 },
            { key: 'autoPPG', label: 'Auto PPG', multiplier: 1 },
            { key: 'teleopPPG', label: 'Teleop PPG', multiplier: 0.7 },
            { key: 'endgamePPG', label: 'Endgame PPG', multiplier: 1.2 },
        ];

        return stats.map(({ key, label, multiplier }) => {
            const dataPoint: RadarChartData = { stat: label };
            Object.entries(teamsData).forEach(([teamNumber, teamData]) => {
                if (teamData && teamData[key as keyof AggregateData] !== undefined) {
                    const value = teamData[key as keyof AggregateData] as number;
                    dataPoint[`team${teamNumber}`] = value * multiplier;
                } else {
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

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px]"
        >
            <RechartsRadarChart 
                data={formatData()}
                outerRadius="80%"
            >
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey="stat" />
                <PolarGrid />
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
        </ChartContainer>
    );
}

export default RadarChart;
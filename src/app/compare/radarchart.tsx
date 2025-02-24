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

const chartConfig = {
    // Define a color for each potential team (you can add more)
    team1: {
        label: "Team 1",
        color: "hsl(var(--chart-1))",
    },
    team2: {
        label: "Team 2",
        color: "hsl(var(--chart-2))",
    },
    team3: {
        label: "Team 3",
        color: "hsl(var(--chart-3))",
    },
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
                        fill={`hsl(var(--chart-${index + 1}))`}
                        fillOpacity={0.6}
                    />
                ))}
                <Legend />
            </RechartsRadarChart>
        </ChartContainer>
    );
}

export default RadarChart;
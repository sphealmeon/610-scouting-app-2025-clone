'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { calculateQuartiles } from './boxplotUtils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define custom BoxPlot plugin for Chart.js
const boxplotPlugin = {
  id: 'boxplot',
  beforeDraw: (chart: any) => {
    const ctx = chart.ctx;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    
    // Draw boxplots for each team
    dataset.data.forEach((boxplotData: any, index: number) => {
      const { min, q1, median, q3, max, outliers } = boxplotData;
      
      // Get x-position for this boxplot
      const xScale = chart.scales.x;
      const x = xScale.getPixelForValue(index);
      
      // Get y-positions for the boxplot elements
      const yScale = chart.scales.y;
      const yMin = yScale.getPixelForValue(min);
      const yQ1 = yScale.getPixelForValue(q1);
      const yMedian = yScale.getPixelForValue(median);
      const yQ3 = yScale.getPixelForValue(q3);
      const yMax = yScale.getPixelForValue(max);
      
      const boxWidth = xScale.getPixelForValue(1) - xScale.getPixelForValue(0);
      const boxHalfWidth = boxWidth * 0.25; // Box width is 50% of category width
      
      // Set drawing styles
      ctx.lineWidth = 2;
      ctx.strokeStyle = dataset.borderColor;
      ctx.fillStyle = dataset.backgroundColor;
      
      // Draw the box (IQR)
      ctx.beginPath();
      ctx.fillRect(x - boxHalfWidth, yQ3, boxHalfWidth * 2, yQ1 - yQ3);
      ctx.strokeRect(x - boxHalfWidth, yQ3, boxHalfWidth * 2, yQ1 - yQ3);
      
      // Draw the median line
      ctx.beginPath();
      ctx.moveTo(x - boxHalfWidth, yMedian);
      ctx.lineTo(x + boxHalfWidth, yMedian);
      ctx.strokeStyle = 'black';
      ctx.stroke();
      
      // Reset stroke style
      ctx.strokeStyle = dataset.borderColor;
      
      // Draw the whiskers
      // Upper whisker
      ctx.beginPath();
      ctx.moveTo(x, yQ3);
      ctx.lineTo(x, yMax);
      ctx.stroke();
      
      // Lower whisker
      ctx.beginPath();
      ctx.moveTo(x, yQ1);
      ctx.lineTo(x, yMin);
      ctx.stroke();
      
      // Draw whisker caps
      const capWidth = boxHalfWidth * 0.8;
      
      // Upper cap
      ctx.beginPath();
      ctx.moveTo(x - capWidth, yMax);
      ctx.lineTo(x + capWidth, yMax);
      ctx.stroke();
      
      // Lower cap
      ctx.beginPath();
      ctx.moveTo(x - capWidth, yMin);
      ctx.lineTo(x + capWidth, yMin);
      ctx.stroke();
      
      // Draw outliers
      if (outliers && outliers.length > 0) {
        ctx.fillStyle = 'red';
        outliers.forEach((outlier: any) => {
          const yOutlier = yScale.getPixelForValue(outlier);
          ctx.beginPath();
          ctx.arc(x, yOutlier, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
  }
};

interface BoxPlotChartProps {
  teamsData: Record<string, string[]>;
  title?: string;
}

const BoxPlotChart = ({ teamsData, title = 'Team Coral Cycles Boxplot' }: BoxPlotChartProps) => {
  // Process data for the boxplot
  const labels: string[] = [];
  const boxplotData: any[] = [];
  
  // Process data for each team
  Object.entries(teamsData)
    .filter(([_, cyclesArray]) => cyclesArray && cyclesArray.length > 0)
    .sort(([_, cyclesA], [__, cyclesB]) => {
      // Sort by median (descending)
      const medianA = calculateQuartiles(cyclesA.map(Number)).median;
      const medianB = calculateQuartiles(cyclesB.map(Number)).median;
      return medianB - medianA;
    })
    .forEach(([team, cyclesArray]) => {
      // Calculate boxplot statistics
      const stats = calculateQuartiles(cyclesArray.map(Number));
      
      // Add to dataset
      labels.push(team);
      boxplotData.push(stats);
    });
  
  // Chart data structure
  const data = {
    labels,
    datasets: [
      {
        label: 'Coral Cycles',
        data: boxplotData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        // These will be hidden but are needed for the scale
        pointRadius: 0,
        showLine: false,
      }
    ]
  };
  
  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const boxplotItem = boxplotData[context.dataIndex];
            return [
              `Team: ${labels[context.dataIndex]}`,
              `Min: ${boxplotItem.min}`,
              `Q1: ${boxplotItem.q1}`,
              `Median: ${boxplotItem.median}`,
              `Q3: ${boxplotItem.q3}`,
              `Max: ${boxplotItem.max}`,
              `Mean: ${boxplotItem.mean}`,
              `Matches: ${boxplotItem.outliers ? boxplotData.length - boxplotItem.outliers.length : boxplotData.length}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Coral Cycles'
        },
        beginAtZero: true,
        min: 0,
        max: 30,
        ticks: {
          stepSize: 5
        }
      },
      x: {
        title: {
          display: true,
          text: 'Teams'
        }
      }
    }
  };
  
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <Chart 
        type='line' 
        data={data} 
        options={options} 
        plugins={[boxplotPlugin]}
      />
    </div>
  );
};

export default BoxPlotChart; 
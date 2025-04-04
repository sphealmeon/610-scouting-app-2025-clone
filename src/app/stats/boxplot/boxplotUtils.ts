/**
 * Calculate quartiles from an array of numbers
 */
export const calculateQuartiles = (data: number[]): { 
  min: number, 
  q1: number, 
  median: number, 
  q3: number, 
  max: number,
  mean: number,
  outliers: number[]
} => {
  if (!data || data.length === 0) {
    return {
      min: 0,
      q1: 0,
      median: 0,
      q3: 0,
      max: 0,
      mean: 0,
      outliers: []
    };
  }

  // Sort the data
  const sortedData = [...data].sort((a, b) => a - b);
  
  // Calculate mean
  const sum = sortedData.reduce((acc, val) => acc + val, 0);
  const mean = parseFloat((sum / sortedData.length).toFixed(2));
  
  // Calculate median (Q2)
  const mid = Math.floor(sortedData.length / 2);
  const median = sortedData.length % 2 === 0
    ? (sortedData[mid - 1] + sortedData[mid]) / 2
    : sortedData[mid];
  
  // Calculate Q1 and Q3
  const lowerHalf = sortedData.slice(0, mid);
  const upperHalf = sortedData.length % 2 === 0
    ? sortedData.slice(mid)
    : sortedData.slice(mid + 1);
  
  const lowerMid = Math.floor(lowerHalf.length / 2);
  const q1 = lowerHalf.length % 2 === 0
    ? (lowerHalf[lowerMid - 1] + lowerHalf[lowerMid]) / 2
    : lowerHalf[lowerMid];
  
  const upperMid = Math.floor(upperHalf.length / 2);
  const q3 = upperHalf.length % 2 === 0
    ? (upperHalf[upperMid - 1] + upperHalf[upperMid]) / 2
    : upperHalf[upperMid];
  
  // Calculate IQR and bounds for outliers
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  // Identify outliers and non-outlier min/max
  const outliers = sortedData.filter(val => val < lowerBound || val > upperBound);
  const nonOutliers = sortedData.filter(val => val >= lowerBound && val <= upperBound);
  
  const min = nonOutliers.length > 0 ? Math.min(...nonOutliers) : sortedData[0];
  const max = nonOutliers.length > 0 ? Math.max(...nonOutliers) : sortedData[sortedData.length - 1];
  
  return {
    min,
    q1,
    median,
    q3,
    max,
    mean,
    outliers
  };
};

/**
 * Process coral cycles data for multiple teams into boxplot format
 */
export const processTeamsData = (teamsData: Record<string, string[]>) => {
  const boxplotData: Record<string, any> = {};
  const teamNames: string[] = [];
  const medians: number[] = [];
  const boxplotStats: any[] = [];
  
  // Process each team's data
  Object.entries(teamsData).forEach(([team, cyclesArray]) => {
    if (!cyclesArray || cyclesArray.length === 0) return;
    
    // Convert string array to number array
    const numericData = cyclesArray.map(val => Number(val));
    
    // Calculate statistics
    const stats = calculateQuartiles(numericData);
    
    // Store data
    teamNames.push(team);
    medians.push(stats.median);
    boxplotStats.push(stats);
  });
  
  // Sort teams by median coral cycles (descending)
  const indices = medians
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .map(item => item.index);
  
  // Reorder the data based on sorted indices
  boxplotData.labels = indices.map(i => teamNames[i]);
  boxplotData.datasets = indices.map(i => boxplotStats[i]);
  
  return boxplotData;
}; 
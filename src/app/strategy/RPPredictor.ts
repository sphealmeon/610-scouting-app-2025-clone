import { AggregateData } from "@/app/interfaces";

export interface TeamCapabilities {
  teamNumber: number;
  autoPPG: number;
  teleopPPG: number;
  endgamePPG: number;
  autoCoralPieces: number; // Average auto coral pieces scored
  teleopCoralPieces: number; // Average teleop coral pieces scored
  autoAlgaePieces: number; // Average auto algae pieces scored
  teleopAlgaePieces: number; // Average teleop algae pieces scored
  maxAutoCoralPieces: number; // Maximum auto coral pieces scored in a match
  maxTeleopCoralPieces: number; // Maximum teleop coral pieces scored in a match
  hasProcessor: boolean;
  hasBarge: boolean;
  reliability: number; // 0-1 factor representing robot reliability
  coralCyclesScored?: number; // Average coral cycles per match
  algaeCyclesScored?: number; // Average algae cycles per match
  autoL1Accuracy?: number; // 0-1 factor
  autoL2Accuracy?: number; // 0-1 factor
  autoL3Accuracy?: number; // 0-1 factor
  autoL4Accuracy?: number; // 0-1 factor
  teleopL1Accuracy?: number; // 0-1 factor
  teleopL2Accuracy?: number; // 0-1 factor
  teleopL3Accuracy?: number; // 0-1 factor
  teleopL4Accuracy?: number; // 0-1 factor
  teleopBargeAccuracy?: number; // 0-1 factor
  teleopProcessorAccuracy?: number; // 0-1 factor
  shallowAccuracy?: number; // 0-1 factor for successful shallow hangs
  deepAccuracy?: number; // 0-1 factor for successful deep hangs
}

export interface AllianceCapabilities {
  teams: TeamCapabilities[];
}

export interface MatchPrediction {
  redAlliance: AllianceCapabilities;
  blueAlliance: AllianceCapabilities;
  redScore: number;
  blueScore: number;
  redAutoRP: boolean;
  redCoralRP: boolean;
  redBargeRP: boolean;
  blueAutoRP: boolean;
  blueCoralRP: boolean;
  blueBargeRP: boolean;
  winner: 'red' | 'blue' | 'tie';
  redRP: number;
  blueRP: number;
}

// Enhanced score calculation for branches
export const calculateEnhancedScore = (alliance: AllianceCapabilities): number => {
  // Constants for scoring
  const AUTO_L1_POINTS = 3;
  const AUTO_L2_POINTS = 4;
  const AUTO_L3_POINTS = 6;
  const AUTO_L4_POINTS = 7;
  const AUTO_LEAVE_POINTS = 3;
  const TELEOP_L1_POINTS = 2;
  const TELEOP_L2_POINTS = 3;
  const TELEOP_L3_POINTS = 4;
  const TELEOP_L4_POINTS = 5;
  const PARK_POINTS = 2;
  const SHALLOW_HANG_POINTS = 6;
  const DEEP_HANG_POINTS = 12;
  const PROCESSOR_POINTS = 6;
  const BARGE_POINTS = 4;
  
  // Calculate baseline score from auto, teleop, and endgame
  let totalScore = 0;
  
  // Sum up team scores
  alliance.teams.forEach(team => {
    totalScore += team.autoPPG + team.teleopPPG + team.endgamePPG;
    
    // Apply reliability factor
    totalScore *= team.reliability;
  });
  
  // Simulate branch filling logic
  // There are 12 branches for L4, L3, and L2, and each section in L1 can hold ~4 pieces
  const branchCapacity = {
    l4: 12, // 12 branches
    l3: 12, // 12 branches
    l2: 12, // 12 branches
    l1: 24, // 6 sections x 4 pieces
  };
  
  // Calculate total coral pieces the alliance can place
  const totalCoralPieces = alliance.teams.reduce((sum, team) => {
    return sum + (team.coralCyclesScored || 0);
  }, 0);
  
  // Distribute coral pieces to branches based on alliance's accuracy patterns
  let remainingPieces = totalCoralPieces;
  let filledL4 = 0, filledL3 = 0, filledL2 = 0, filledL1 = 0;
  
  // Calculate weighted average accuracy for each level across alliance
  const allianceL4Accuracy = alliance.teams.reduce((sum, team) => sum + (team.teleopL4Accuracy || 0), 0) / alliance.teams.length;
  const allianceL3Accuracy = alliance.teams.reduce((sum, team) => sum + (team.teleopL3Accuracy || 0), 0) / alliance.teams.length;
  const allianceL2Accuracy = alliance.teams.reduce((sum, team) => sum + (team.teleopL2Accuracy || 0), 0) / alliance.teams.length;
  const allianceL1Accuracy = alliance.teams.reduce((sum, team) => sum + (team.teleopL1Accuracy || 0), 0) / alliance.teams.length;
  
  // Distribution weights based on accuracy
  const totalAccuracy = allianceL4Accuracy + allianceL3Accuracy + allianceL2Accuracy + allianceL1Accuracy;
  const l4Weight = totalAccuracy > 0 ? allianceL4Accuracy / totalAccuracy : 0.1;
  const l3Weight = totalAccuracy > 0 ? allianceL3Accuracy / totalAccuracy : 0.2;
  const l2Weight = totalAccuracy > 0 ? allianceL2Accuracy / totalAccuracy : 0.3;
  const l1Weight = totalAccuracy > 0 ? allianceL1Accuracy / totalAccuracy : 0.4;
  
  // Distribute pieces
  filledL4 = Math.min(branchCapacity.l4, Math.round(remainingPieces * l4Weight));
  remainingPieces -= filledL4;
  
  filledL3 = Math.min(branchCapacity.l3, Math.round(remainingPieces * l3Weight / (l3Weight + l2Weight + l1Weight)));
  remainingPieces -= filledL3;
  
  filledL2 = Math.min(branchCapacity.l2, Math.round(remainingPieces * l2Weight / (l2Weight + l1Weight)));
  remainingPieces -= filledL2;
  
  filledL1 = Math.min(branchCapacity.l1, remainingPieces);
  
  // Calculate branch-filling bonus
  // Logic: If all branches in a level are filled, additional bonus points
  const l4FilledPercent = filledL4 / branchCapacity.l4;
  const l3FilledPercent = filledL3 / branchCapacity.l3;
  const l2FilledPercent = filledL2 / branchCapacity.l2;
  const l1FilledPercent = filledL1 / branchCapacity.l1;
  
  // Bonus for filling branches
  let branchBonus = 0;
  if (l4FilledPercent >= 0.8) branchBonus += 10; // Nearly filled L4
  if (l3FilledPercent >= 0.8) branchBonus += 8; // Nearly filled L3
  if (l2FilledPercent >= 0.8) branchBonus += 6; // Nearly filled L2
  if (l1FilledPercent >= 0.8) branchBonus += 4; // Nearly filled L1
  
  // Additional bonus if alliance has processors
  const processorsCount = alliance.teams.filter(team => team.hasProcessor).length;
  if (processorsCount >= 2) {
    branchBonus += 10; // Processor cooperation bonus
  }
  
  return Math.round(totalScore + branchBonus);
};

// Main prediction function that combines all the scoring logic
export const predictMatch = (
  redAlliance: AllianceCapabilities,
  blueAlliance: AllianceCapabilities
): MatchPrediction => {
  const redScore = calculateEnhancedScore(redAlliance);
  const blueScore = calculateEnhancedScore(blueAlliance);
  
  const redAutoRP = predictAutoRP(redAlliance);
  const redCoralRP = predictCoralRP(redAlliance);
  const redBargeRP = predictBargeRP(redAlliance);
  
  const blueAutoRP = predictAutoRP(blueAlliance);
  const blueCoralRP = predictCoralRP(blueAlliance);
  const blueBargeRP = predictBargeRP(blueAlliance);
  
  let winner: 'red' | 'blue' | 'tie' = 'tie';
  let redRP = 0;
  let blueRP = 0;
  
  // Determine winner and RP
  if (redScore > blueScore) {
    winner = 'red';
    redRP = 3;
    blueRP = 0;
  } else if (blueScore > redScore) {
    winner = 'blue';
    redRP = 0;
    blueRP = 3;
  } else {
    winner = 'tie';
    redRP = 1;
    blueRP = 1;
  }
  
  // Add RP for qualification matches
  if (redAutoRP) redRP += 1;
  if (redCoralRP) redRP += 1;
  if (redBargeRP) redRP += 1;
  
  if (blueAutoRP) blueRP += 1;
  if (blueCoralRP) blueRP += 1;
  if (blueBargeRP) blueRP += 1;
  
  return {
    redAlliance,
    blueAlliance,
    redScore,
    blueScore,
    redAutoRP,
    redCoralRP,
    redBargeRP,
    blueAutoRP,
    blueCoralRP,
    blueBargeRP,
    winner,
    redRP,
    blueRP
  };
};

// New RP Prediction functions

// Auto RP - earned by scoring at least 1 coral piece in auto (3 leaves)
export const predictAutoRP = (alliance: AllianceCapabilities): boolean => {
  const totalAutoCoralPieces = alliance.teams.reduce((sum, team) => sum + (team.autoCoralPieces || 0), 0);
  // Apply reliability factor
  const adjustedAutoCoralPieces = totalAutoCoralPieces * alliance.teams.reduce((product, team) => product * team.reliability, 1);
  return adjustedAutoCoralPieces >= 1; // Threshold for Auto RP
};

// Coral RP - earned by filling 6 branches (50% of the 12 branches)
export const predictCoralRP = (alliance: AllianceCapabilities): boolean => {
  // Calculate total coral pieces the alliance can place
  const totalCoralPieces = alliance.teams.reduce((sum, team) => sum + (team.coralCyclesScored || 0), 0);
  
  // Apply reliability factor
  const adjustedCoralPieces = totalCoralPieces * alliance.teams.reduce((product, team) => product * team.reliability, 1);
  
  // We need about 6 branches filled, which requires approximately 6 coral pieces
  return adjustedCoralPieces >= 24;
};

// Barge RP - earned by filling the barge (requires at least 2 robots with barge capabilities)
// OR having at least one robot with deep hang capabilities
export const predictBargeRP = (alliance: AllianceCapabilities): boolean => {
  // Check if any robot has deep hang capabilities
  const deepHangCapableRobots = alliance.teams.filter(team => 
    (team.deepAccuracy || 0) > 0).length;
  
  // If at least one robot has deep hang capabilities, grant the RP
  if (deepHangCapableRobots >= 1) return true;
  
  // Otherwise, check traditional barge criteria
  const shallowHangCapableRobots = alliance.teams.filter(team => team.shallowAccuracy || 0 > 0).length;
  
  if (shallowHangCapableRobots < 2) return false;
  
  // Calculate average barge accuracy across the alliance
  const allianceBargeAccuracy = alliance.teams.reduce((sum, team) => 
    sum + (team.teleopBargeAccuracy || 0), 0) / alliance.teams.length;
  
  // Apply reliability factor
  const adjustedBargeAccuracy = allianceBargeAccuracy * alliance.teams.reduce((product, team) => 
    product * team.reliability, 1);
  
  // Threshold - need good barge accuracy and at least 2 barge-capable robots
  return adjustedBargeAccuracy >= 0.6 && shallowHangCapableRobots >= 2;
};

/**
 * Convert AggregateData to TeamCapabilities
 * @param teamData The aggregate data from Firebase
 * @returns TeamCapabilities object for prediction
 */
export const convertToTeamCapabilities = (teamData: AggregateData): TeamCapabilities => {
  // Fill in default values for missing fields
  const defaultReliability = 0.9; // Default reliability if not provided
  const autoCoralEstimate = Math.ceil((teamData.autoPPG || 0) / 3); // Estimate auto coral from auto PPG
  const teleopCoralEstimate = Math.ceil((teamData.teleopPPG || 0) / 4); // Estimate teleop coral from teleop PPG
  
  return {
    teamNumber: teamData.team,
    autoPPG: teamData.autoPPG || 0,
    teleopPPG: teamData.teleopPPG || 0,
    endgamePPG: teamData.endgamePPG || 0,
    // Use autoNotes if it exists, otherwise fall back to estimate
    autoCoralPieces: teamData.autoNotes || autoCoralEstimate,
    teleopCoralPieces: teamData.teleopNotes || teleopCoralEstimate,
    autoAlgaePieces: Math.ceil((teamData.algaeCyclesScored || 0) * 0.3),
    teleopAlgaePieces: Math.ceil((teamData.algaeCyclesScored || 0) * 0.7),
    // Use maxAutoNotes if it exists, otherwise fall back to estimate
    maxAutoCoralPieces: teamData.maxAutoNotes || autoCoralEstimate * 1.5,
    maxTeleopCoralPieces: teamData.maxTeleopNotes || teleopCoralEstimate * 1.5,
    hasProcessor: (teamData.teleopProcessorAccuracy || 0) > 0,
    hasBarge: (teamData.teleopBargeAccuracy || 0) > 0,
    reliability: teamData.reliability || (1 - (teamData.weightedBrokePercentage || 0)) || defaultReliability,
    coralCyclesScored: teamData.coralCyclesScored || 0,
    algaeCyclesScored: teamData.algaeCyclesScored || 0,
    autoL1Accuracy: teamData.autoL1Accuracy || 0,
    autoL2Accuracy: teamData.autoL2Accuracy || 0,
    autoL3Accuracy: teamData.autoL3Accuracy || 0,
    autoL4Accuracy: teamData.autoL4Accuracy || 0,
    teleopL1Accuracy: teamData.teleopL1Accuracy || 0,
    teleopL2Accuracy: teamData.teleopL2Accuracy || 0,
    teleopL3Accuracy: teamData.teleopL3Accuracy || 0,
    teleopL4Accuracy: teamData.teleopL4Accuracy || 0,
    teleopBargeAccuracy: teamData.teleopBargeAccuracy || 0,
    teleopProcessorAccuracy: teamData.teleopProcessorAccuracy || 0,
    shallowAccuracy: teamData.shallowAccuracy || 0,
    deepAccuracy: teamData.deepAccuracy || 0,
  };
}; 
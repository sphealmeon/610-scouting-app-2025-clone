import { AllianceCapabilities, MatchPrediction, predictMatch } from "./RPPredictor";

export interface Alliance {
  allianceNumber: number;
  teams: number[];
  capabilities?: AllianceCapabilities;
}

export interface PlayoffMatch {
  matchNumber: number;
  redAlliance: Alliance;
  blueAlliance: Alliance;
  prediction?: MatchPrediction;
}

export interface PlayoffRound {
  name: string;
  matches: PlayoffMatch[];
}

export interface PlayoffBracket {
  rounds: PlayoffRound[];
  winner?: Alliance;
}

// Enhanced score calculation for branches
const calculateEnhancedScore = (alliance: AllianceCapabilities): number => {
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
    if ('reliability' in team) {
      totalScore *= (team as any).reliability;
    }
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
    return sum + ((team as any).coralCyclesScored || 0);
  }, 0);
  
  // Distribute coral pieces to branches based on alliance's accuracy patterns
  let remainingPieces = totalCoralPieces;
  let filledL4 = 0, filledL3 = 0, filledL2 = 0, filledL1 = 0;
  
  // Calculate weighted average accuracy for each level across alliance
  const allianceL4Accuracy = alliance.teams.reduce((sum, team) => sum + ((team as any).teleopL4Accuracy || 0), 0) / alliance.teams.length;
  const allianceL3Accuracy = alliance.teams.reduce((sum, team) => sum + ((team as any).teleopL3Accuracy || 0), 0) / alliance.teams.length;
  const allianceL2Accuracy = alliance.teams.reduce((sum, team) => sum + ((team as any).teleopL2Accuracy || 0), 0) / alliance.teams.length;
  const allianceL1Accuracy = alliance.teams.reduce((sum, team) => sum + ((team as any).teleopL1Accuracy || 0), 0) / alliance.teams.length;
  
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

// Enhanced prediction logic
const enhancedPredictMatch = (
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
    redRP = 3; // A win is 3 RP
    blueRP = 0;
  } else if (blueScore > redScore) {
    winner = 'blue';
    redRP = 0;
    blueRP = 3; // A win is 3 RP
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

// Import RP prediction functions
const { predictAutoRP, predictCoralRP, predictBargeRP } = require('./RPPredictor');

// Simulate a best of 3 series
export const simulateBestOf3 = (
  redAlliance: Alliance,
  blueAlliance: Alliance
): Alliance => {
  if (!redAlliance.capabilities || !blueAlliance.capabilities) {
    throw new Error("Alliance capabilities must be defined");
  }

  let redWins = 0;
  let blueWins = 0;

  // Simulate up to 3 matches
  for (let i = 0; i < 3; i++) {
    // If one alliance already has 2 wins, they win the series
    if (redWins === 2) return redAlliance;
    if (blueWins === 2) return blueAlliance;

    // Use enhanced prediction
    const prediction = enhancedPredictMatch(
      redAlliance.capabilities,
      blueAlliance.capabilities
    );

    if (prediction.winner === "red") {
      redWins++;
    } else if (prediction.winner === "blue") {
      blueWins++;
    } else {
      // If there's a tie, give slight advantage to higher seeded alliance
      if (redAlliance.allianceNumber < blueAlliance.allianceNumber) {
        redWins++;
      } else {
        blueWins++;
      }
    }
  }

  // Return the alliance with more wins
  return redWins > blueWins ? redAlliance : blueAlliance;
};

// Generate initial quarterfinal matchups
export const generateQuarterfinals = (alliances: Alliance[]): PlayoffMatch[] => {
  return [
    {
      matchNumber: 1,
      redAlliance: alliances[0], // Alliance 1
      blueAlliance: alliances[7], // Alliance 8
    },
    {
      matchNumber: 2,
      redAlliance: alliances[3], // Alliance 4
      blueAlliance: alliances[4], // Alliance 5
    },
    {
      matchNumber: 3,
      redAlliance: alliances[2], // Alliance 3
      blueAlliance: alliances[5], // Alliance 6
    },
    {
      matchNumber: 4,
      redAlliance: alliances[1], // Alliance 2
      blueAlliance: alliances[6], // Alliance 7
    },
  ];
};

// Generate semifinal matchups based on quarterfinal results
export const generateSemifinals = (
  quarterfinalMatches: PlayoffMatch[],
  results: Alliance[]
): PlayoffMatch[] => {
  return [
    {
      matchNumber: 5,
      redAlliance: results[0], // Winner of QF1
      blueAlliance: results[1], // Winner of QF2
    },
    {
      matchNumber: 6,
      redAlliance: results[2], // Winner of QF3
      blueAlliance: results[3], // Winner of QF4
    },
  ];
};

// Generate finals matchup based on semifinal results
export const generateFinals = (
  semifinalMatches: PlayoffMatch[],
  results: Alliance[]
): PlayoffMatch[] => {
  return [
    {
      matchNumber: 7,
      redAlliance: results[0], // Winner of SF1
      blueAlliance: results[1], // Winner of SF2
    },
  ];
};

// Simulate the entire playoff bracket
export const simulatePlayoffs = (alliances: Alliance[]): PlayoffBracket => {
  // Step 1: Generate quarterfinals
  const quarterfinalsMatches = generateQuarterfinals(alliances);
  
  // Step 2: Simulate quarterfinals
  const quarterfinalResults: Alliance[] = [];
  quarterfinalsMatches.forEach((match) => {
    // Add predictions to each match
    if (match.redAlliance.capabilities && match.blueAlliance.capabilities) {
      match.prediction = enhancedPredictMatch(
        match.redAlliance.capabilities,
        match.blueAlliance.capabilities
      );
    }
    
    // Simulate and store results
    const winner = simulateBestOf3(match.redAlliance, match.blueAlliance);
    quarterfinalResults.push(winner);
  });
  
  // Step 3: Generate and simulate semifinals
  const semifinalsMatches = generateSemifinals(quarterfinalsMatches, quarterfinalResults);
  const semifinalResults: Alliance[] = [];
  semifinalsMatches.forEach((match) => {
    // Add predictions to each match
    if (match.redAlliance.capabilities && match.blueAlliance.capabilities) {
      match.prediction = enhancedPredictMatch(
        match.redAlliance.capabilities,
        match.blueAlliance.capabilities
      );
    }
    
    // Simulate and store results
    const winner = simulateBestOf3(match.redAlliance, match.blueAlliance);
    semifinalResults.push(winner);
  });
  
  // Step 4: Generate and simulate finals
  const finalsMatches = generateFinals(semifinalsMatches, semifinalResults);
  let champion: Alliance | undefined;
  
  finalsMatches.forEach((match) => {
    // Add predictions to each match
    if (match.redAlliance.capabilities && match.blueAlliance.capabilities) {
      match.prediction = enhancedPredictMatch(
        match.redAlliance.capabilities,
        match.blueAlliance.capabilities
      );
    }
    
    // Simulate and store results
    champion = simulateBestOf3(match.redAlliance, match.blueAlliance);
  });
  
  // Return the complete bracket with all rounds and the champion
  return {
    rounds: [
      { name: "Quarterfinals", matches: quarterfinalsMatches },
      { name: "Semifinals", matches: semifinalsMatches },
      { name: "Finals", matches: finalsMatches },
    ],
    winner: champion,
  };
};
import { Data } from "../interfaces";
import { TeamMatchesData } from "./teamMatchesData";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Calculate total coral cycles for a match
 * @param match Match data
 * @returns Number of coral cycles in the match
 */
const calculateTotalCoralCycles = (match: Data): number => {
  // Count all coral pieces scored
  let total = 0;
  
  // Auto coral
  if (match.auto?.coral) {
    total += match.auto.coral;
  }
  
  // Teleop coral (L1-L4)
  if (match.teleop?.l1Scored) total += match.teleop.l1Scored;
  if (match.teleop?.l2Scored) total += match.teleop.l2Scored;
  if (match.teleop?.l3Scored) total += match.teleop.l3Scored;
  if (match.teleop?.l4Scored) total += match.teleop.l4Scored;
  
  return total;
};

/**
 * Given a team number, check if it exists in Firebase and return an array of coral cycles for each match
 * @param teamNumber The team number to check
 * @returns A promise that resolves to an array of coral cycles for each match as string literals, or null if the team doesn't exist
 */
export const getTeamCoralCyclesArray = async (teamNumber: number): Promise<string[] | null> => {
  try {
    // Check if the team exists in Firebase
    const teamCollection = collection(db, teamNumber.toString());
    const querySnapshot = await getDocs(teamCollection);
    
    // If team doesn't exist or has no documents, return null
    if (querySnapshot.empty) {
      console.log(`No data found for team ${teamNumber}`);
      return null;
    }
    
    // Team exists, fetch their match data
    const matchesData = await TeamMatchesData({ team: teamNumber });
    
    // Filter out invalid matches, match 0, and the aggregate data
    const validMatches = matchesData.filter((match): match is Data => 
      match !== undefined && 
      match.start?.match !== undefined && 
      match.start.match !== 0 && 
      typeof match.start.match === 'number' // Only include numeric match numbers
    );
    
    // First create an array with match numbers and cycles
    const matchCoralData = validMatches.map(match => ({
      match: match.start.match as number,
      cycles: calculateTotalCoralCycles(match)
    }));
    
    // Sort by match number (numerically)
    matchCoralData.sort((a, b) => a.match - b.match);
    
    // Extract just the cycles data as strings in the sorted order
    const coralCyclesArray = matchCoralData.map(item => `${item.cycles}`);
    
    return coralCyclesArray;
  } catch (error) {
    console.error(`Error fetching coral cycles for team ${teamNumber}:`, error);
    return null;
  }
};

import { Data } from "../interfaces";
import { TeamMatchesData } from "./teamMatchesData";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Calculate total algae cycles for a match
 * @param match Match data
 * @returns Number of algae cycles in the match
 */
const calculateTotalAlgaeCycles = (match: Data): number => {
  // Count all algae pieces scored
  let total = 0;
  
  // Auto algae
  if (match.auto?.algae) {
    total += match.auto.algae;
  }
  
  // Teleop barge
  if (match.teleop?.bargeScored) total += match.teleop.bargeScored;
  
  return total;
};

/**
 * Given a team number, check if it exists in Firebase and return an array of algae cycles for each match
 * @param teamNumber The team number to check
 * @returns A promise that resolves to an array of algae cycles for each match as string literals, or null if the team doesn't exist
 */
export const getTeamAlgaeCyclesArray = async (teamNumber: number): Promise<string[] | null> => {
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
    const matchAlgaeData = validMatches.map(match => ({
      match: match.start.match as number,
      cycles: calculateTotalAlgaeCycles(match)
    }));
    
    // Sort by match number (numerically)
    matchAlgaeData.sort((a, b) => a.match - b.match);
    
    // Extract just the cycles data as strings in the sorted order
    const algaeCyclesArray = matchAlgaeData.map(item => `${item.cycles}`);
    
    return algaeCyclesArray;
  } catch (error) {
    console.error(`Error fetching algae cycles for team ${teamNumber}:`, error);
    return null;
  }
};

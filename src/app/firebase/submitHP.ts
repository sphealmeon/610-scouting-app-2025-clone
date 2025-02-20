import { HumanPlayerData } from "../interfaces";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const SubmitHP = async ({
  team1,
  team2,
  matchData,
}: {
  team1: number;
  team2: number;
  matchData: HumanPlayerData;
}) => {
  try {
    console.log("Starting submission with data:", { team1, team2, matchData });

    // Update team1 (red)
    const team1Ref = doc(db, "humanplayers", team1.toString());
    const team1Doc = await getDoc(team1Ref);
    const team1Data = team1Doc.data() || { 
      totalScored: 0, 
      totalMissed: 0,
      matchesPlayed: 0,
      fieldGoalPercentage: 0,
      pointsPerGame: 0
    };
    
    // Calculate new stats for team1
    const redTotal = (team1Data.totalScored || 0) + matchData.red.redScored;
    const redMissed = (team1Data.totalMissed || 0) + matchData.red.redMissed;
    const redMatches = (team1Data.matchesPlayed || 0) + 1;
    const redFGPercentage = (redTotal + redMissed) > 0 ? 
      Math.round((redTotal / (redTotal + redMissed)) * 1000) / 10 : 0;
    const redPPG = redMatches > 0 ? 
      Math.round((redTotal * 4 / redMatches) * 10) / 10 : 0;

    const team1NewData = {
      team: team1,
      totalScored: redTotal,
      totalMissed: redMissed,
      matchesPlayed: redMatches,
      fieldGoalPercentage: redFGPercentage,
      pointsPerGame: redPPG
    };

    console.log("Saving team 1 data:", team1NewData);
    await setDoc(team1Ref, team1NewData, { merge: true });

    // Update team2 (blue)
    const team2Ref = doc(db, "humanplayers", team2.toString());
    const team2Doc = await getDoc(team2Ref);
    const team2Data = team2Doc.data() || { 
      totalScored: 0, 
      totalMissed: 0,
      matchesPlayed: 0,
      fieldGoalPercentage: 0,
      pointsPerGame: 0
    };

    // Calculate new stats for team2
    const blueTotal = (team2Data.totalScored || 0) + matchData.blue.blueScored;
    const blueMissed = (team2Data.totalMissed || 0) + matchData.blue.blueMissed;
    const blueMatches = (team2Data.matchesPlayed || 0) + 1;
    const blueFGPercentage = (blueTotal + blueMissed) > 0 ? 
      Math.round((blueTotal / (blueTotal + blueMissed)) * 1000) / 10 : 0;
    const bluePPG = blueMatches > 0 ? 
      Math.round((blueTotal * 4 / blueMatches) * 10) / 10 : 0;

    const team2NewData = {
      team: team2,
      totalScored: blueTotal,
      totalMissed: blueMissed,
      matchesPlayed: blueMatches,
      fieldGoalPercentage: blueFGPercentage,
      pointsPerGame: bluePPG
    };

    console.log("Saving team 2 data:", team2NewData);
    await setDoc(team2Ref, team2NewData, { merge: true });

    console.log("Successfully saved both team data");
    return true;
  } catch (e) {
    console.error("Error submitting HP data:", e);
    throw e;
  }
};

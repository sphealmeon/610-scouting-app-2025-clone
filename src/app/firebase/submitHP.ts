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
    const team1Data = team1Doc.data() || { totalScored: 0, totalMissed: 0 };
    
    console.log("Team 1 existing data:", team1Data);
    console.log("Team 1 new match data:", matchData.red);
    
    const redTotal = (team1Data.totalScored || 0) + matchData.red.redScored;
    const redMissed = (team1Data.totalMissed || 0) + matchData.red.redMissed;
    const redAccuracy = (redTotal + redMissed) > 0 ? 
      Math.round((redTotal / (redTotal + redMissed)) * 100) : 0;

    const team1NewData = {
      accuracy: redAccuracy,
      team: team1,
      totalMissed: redMissed,
      totalScored: redTotal,
      matchesPlayed: (team1Data.matchesPlayed || 0) + 1
    };

    console.log("Saving team 1 data:", team1NewData);
    await setDoc(team1Ref, team1NewData, { merge: true });

    // Update team2 (blue)
    const team2Ref = doc(db, "humanplayers", team2.toString());
    const team2Doc = await getDoc(team2Ref);
    const team2Data = team2Doc.data() || { totalScored: 0, totalMissed: 0 };

    console.log("Team 2 existing data:", team2Data);
    console.log("Team 2 new match data:", matchData.blue);

    const blueTotal = (team2Data.totalScored || 0) + matchData.blue.blueScored;
    const blueMissed = (team2Data.totalMissed || 0) + matchData.blue.blueMissed;
    const blueAccuracy = (blueTotal + blueMissed) > 0 ? 
      Math.round((blueTotal / (blueTotal + blueMissed)) * 100) : 0;

    const team2NewData = {
      accuracy: blueAccuracy,
      team: team2,
      totalMissed: blueMissed,
      totalScored: blueTotal,
      matchesPlayed: (team2Data.matchesPlayed || 0) + 1
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

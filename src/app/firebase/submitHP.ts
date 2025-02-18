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
    // Debug logs
    console.log("Submitting data:", { team1, team2, matchData });

    // Update team1 (red)
    const team1Ref = doc(db, team1.toString(), "humanplayer");
    const team1Doc = await getDoc(team1Ref);
    const team1Data = team1Doc.data();
    
    console.log("Existing team1 data:", team1Data);
    console.log("New red data:", matchData.red);

    const redTotal = (team1Data?.totalScored || 0) + matchData.red.redScored;
    const redMissed = (team1Data?.totalMissed || 0) + matchData.red.redMissed;
    const redAccuracy = (redTotal + redMissed) > 0 ? 
      Math.round((redTotal / (redTotal + redMissed)) * 100) : 0;

    console.log("Calculated red values:", { redTotal, redMissed, redAccuracy });

    await setDoc(team1Ref, {
      accuracy: redAccuracy,
      team: team1,
      totalMissed: redMissed,
      totalScored: redTotal
    });

    // Update team2 (blue)
    const team2Ref = doc(db, team2.toString(), "humanplayer");
    const team2Doc = await getDoc(team2Ref);
    const team2Data = team2Doc.data() || { totalScored: 0, totalMissed: 0 };

    // Add new match data to existing totals
    const blueTotal = team2Data.totalScored + matchData.blue.blueScored;
    const blueMissed = team2Data.totalMissed + matchData.blue.blueMissed;
    const blueAccuracy = (blueTotal + blueMissed) > 0 ? 
      Math.round((blueTotal / (blueTotal + blueMissed)) * 100) : 0;

    await setDoc(team2Ref, {
      totalScored: blueTotal,
      totalMissed: blueMissed,
      accuracy: blueAccuracy,
      team: team2,
      matchesPlayed: (team2Data.matchesPlayed || 0) + 1
    });

  } catch (e) {
    console.error("Error submitting HP data:", e);
  }
};

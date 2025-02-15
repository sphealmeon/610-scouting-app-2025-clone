import { HumanPlayerData } from "../interfaces";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

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
    // Calculate accuracies
    const redTotal = matchData.red.redScored + matchData.red.redMissed;
    const redAccuracy = redTotal > 0 ? 
      (matchData.red.redScored / redTotal) * 100 : 0;

    const blueTotal = matchData.blue.blueScored + matchData.blue.blueMissed;
    const blueAccuracy = blueTotal > 0 ? 
      (matchData.blue.blueScored / blueTotal) * 100 : 0;

    // Update team1 (red)
    const team1Ref = doc(db, team1.toString(), "humanplayer");
    await setDoc(team1Ref, {
      aggregateData: {
        humanPlayerAccuracy: redAccuracy,
        matchesPlayed: 1,
        team: team1
      },
      red: {
        redScored: matchData.red.redScored,
        redMissed: matchData.red.redMissed,
        match: matchData.red.match,
        team: team1
      }
    });

    // Update team2 (blue)
    const team2Ref = doc(db, team2.toString(), "humanplayer");
    await setDoc(team2Ref, {
      aggregateData: {
        humanPlayerAccuracy: blueAccuracy,
        matchesPlayed: 1,
        team: team2
      },
      blue: {
        blueScored: matchData.blue.blueScored,
        blueMissed: matchData.blue.blueMissed,
        match: matchData.blue.match,
        team: team2
      }
    });

  } catch (e) {
    console.error("Error submitting HP data:", e);
  }
};

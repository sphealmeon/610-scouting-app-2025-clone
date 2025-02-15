import { HumanPlayerData } from "../interfaces";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

/**
 * Submits the match data to the database
 * @param team the team to set match data for
 * @param match the match number
 * @param matchData matchData for the corresponding team and match
 */
export const SubmitHP = async ({
  team1,
  team2,
  matchData,
}: {
  team1: number;
  team2: number;
  matchData: HumanPlayerData;
}) => {
  console.log(matchData);

  try {
    await setDoc(doc(db, team1 + "", "humanplayer" + ""), {
      red: matchData.red,
    });
    await setDoc(doc(db, team2 + "", "humanplayer" + ""), {
      blue: matchData.blue,
    });
  } catch (e) {
    console.error(e);
  }

  console.log("Match submitted");
};

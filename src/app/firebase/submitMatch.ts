import { Data } from "../interfaces";
import { CalculateAggregate } from "./calculateAggregate";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

/**
 * Submits the match data to the database
 * @param team the team to set match data for
 * @param match the match number
 * @param matchData matchData for the corresponding team and match
 */
export const SubmitMatch = async ({
  team,
  match,
  matchData,
}: {
  team: number;
  match: number;
  matchData: Data;
}) => {
  await setDoc(doc(db, team.toString(), match.toString()), {
    matchData,
  });
  CalculateAggregate({ team });
};
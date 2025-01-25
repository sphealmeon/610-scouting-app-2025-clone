import { Data } from "../interfaces";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Gets all match data from a team
 * @param team the team
 * @returns returns a Data array of all the team's matches
 */
export const TeamMatchesData = async ({ team }: { team: number }) => {
  const querySnapshot = await getDocs(collection(db, team + ""));
  const teamMatches: Data[] = [];
  querySnapshot.forEach((document) => {
    if (document.id == "aggregate") {
      teamMatches.push(document.data()?.aggregateData.matchAggregateData);
    } else {
      teamMatches.push(document.data()?.matchData);
    }
  });

  return teamMatches;
};

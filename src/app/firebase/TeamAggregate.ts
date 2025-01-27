import { AggregateData } from "../interfaces";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Gets aggregate data from a team
 * @param team the team
 * @returns an AggregateData object containg team Aggergate Data
 */
export const TeamAggregate = async ({ team }: { team: number }) => {
  const document = await getDoc(doc(db, team + "", "aggregate"));
  const rawData = document.data();
  console.log("Raw data from Firebase for team", team, ":", rawData);
  const teamData: AggregateData = rawData?.aggregateData;
  console.log("Processed team data:", teamData);
  return teamData;
};

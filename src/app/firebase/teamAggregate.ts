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
  const teamData: AggregateData = document.data()?.aggregateData;

  return teamData;
};
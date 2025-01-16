import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Data } from "../interfaces";

export async function getMatchData(team: number, match: number): Promise<Data> {
    const document = await getDoc(doc(db, team + "", match + ""));
    return document.data()?.matchData
}
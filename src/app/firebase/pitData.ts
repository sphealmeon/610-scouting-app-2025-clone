import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { PitData as PitDataInterface } from "@/app/interfaces";


export const PitData = async ({ team }: {team: number}) => {
    const document = await getDoc(doc(db, "pitscout", team +""));
    const teamData = document.data();
    console.log("Pit data from Firebase for team", team, ":", teamData);
    return teamData;
}
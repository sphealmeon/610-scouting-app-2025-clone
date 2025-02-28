import { db } from "@/app/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface HPData {
    red: {
        team: number;
        match: number;
        redScored: number;
        redMissed: number;
    };
    blue: {
        team: number;
        match: number;
        blueScored: number;
        blueMissed: number;
    };
}

export const submitHPData = async (data: HPData) => {
    try {
        // Update red team aggregate
        const redTeamRef = doc(db, "humanplayers", data.red.team.toString());
        const redTeamDoc = await getDoc(redTeamRef);
        const redTeamData = redTeamDoc.data() || { totalScored: 0, totalMissed: 0, matchesPlayed: 0 };

        const redNewTotal = redTeamData.totalScored + data.red.redScored;
        const redNewMissed = redTeamData.totalMissed + data.red.redMissed;
        const redAccuracy = (redNewTotal + redNewMissed) > 0 
            ? Math.round((redNewTotal / (redNewTotal + redNewMissed)) * 100) 
            : 0;

        await setDoc(redTeamRef, {
            accuracy: redAccuracy,
            team: data.red.team,
            totalScored: redNewTotal,
            totalMissed: redNewMissed,
            matchesPlayed: redTeamData.matchesPlayed + 1
        });

        // Update blue team aggregate
        const blueTeamRef = doc(db, "humanplayers", data.blue.team.toString());
        const blueTeamDoc = await getDoc(blueTeamRef);
        const blueTeamData = blueTeamDoc.data() || { totalScored: 0, totalMissed: 0, matchesPlayed: 0 };

        const blueNewTotal = blueTeamData.totalScored + data.blue.blueScored;
        const blueNewMissed = blueTeamData.totalMissed + data.blue.blueMissed;
        const blueAccuracy = (blueNewTotal + blueNewMissed) > 0 
            ? Math.round((blueNewTotal / (blueNewTotal + blueNewMissed)) * 100) 
            : 0;

        await setDoc(blueTeamRef, {
            accuracy: blueAccuracy,
            team: data.blue.team,
            totalScored: blueNewTotal,
            totalMissed: blueNewMissed,
            matchesPlayed: blueTeamData.matchesPlayed + 1
        });

        return { success: true, message: "HP data submitted for both teams" };
    } catch (error) {
        console.error("Error submitting HP data:", error);
        return { success: false, message: "Failed to submit HP data" };
    }
};

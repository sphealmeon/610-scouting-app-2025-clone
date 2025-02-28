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
        const redTeamData = redTeamDoc.data() || { 
            team: data.red.team,
            totalScored: 0, 
            totalMissed: 0, 
            matchesPlayed: 0 
        };

        // Calculate new values
        const redNewTotal = redTeamData.totalScored + data.red.redScored;
        const redNewMissed = redTeamData.totalMissed + data.red.redMissed;
        const redNewMatches = redTeamData.matchesPlayed + 1;
        const redFGPercentage = ((redNewTotal / (redNewTotal + redNewMissed)) * 100) || 0;
        const redPPG = redNewTotal / redNewMatches;

        await setDoc(redTeamRef, {
            team: data.red.team,
            totalScored: redNewTotal,
            totalMissed: redNewMissed,
            matchesPlayed: redNewMatches,
            fieldGoalPercentage: redFGPercentage,
            pointsPerGame: redPPG
        });

        // Update blue team aggregate
        const blueTeamRef = doc(db, "humanplayers", data.blue.team.toString());
        const blueTeamDoc = await getDoc(blueTeamRef);
        const blueTeamData = blueTeamDoc.data() || { 
            team: data.blue.team,
            totalScored: 0, 
            totalMissed: 0, 
            matchesPlayed: 0 
        };

        // Calculate new values
        const blueNewTotal = blueTeamData.totalScored + data.blue.blueScored;
        const blueNewMissed = blueTeamData.totalMissed + data.blue.blueMissed;
        const blueNewMatches = blueTeamData.matchesPlayed + 1;
        const blueFGPercentage = ((blueNewTotal / (blueNewTotal + blueNewMissed)) * 100) || 0;
        const bluePPG = blueNewTotal / blueNewMatches;

        await setDoc(blueTeamRef, {
            team: data.blue.team,
            totalScored: blueNewTotal,
            totalMissed: blueNewMissed,
            matchesPlayed: blueNewMatches,
            fieldGoalPercentage: blueFGPercentage,
            pointsPerGame: bluePPG
        });

        return { success: true, message: "HP data submitted for both teams" };
    } catch (error) {
        console.error("Error submitting HP data:", error);
        return { success: false, message: "Failed to submit HP data" };
    }
};

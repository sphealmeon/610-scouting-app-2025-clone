import { db } from "@/app/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface TeamPickupData {
    scored: number;
    missed: number;
}

interface TeamPickupCollection {
    [teamNumber: string]: TeamPickupData;
}

export interface HPData {
    red: {
        team: number;
        match: number;
        redScored: number;
        redMissed: number;
        teams: TeamPickupCollection;
    };
    blue: {
        team: number;
        match: number;
        blueScored: number;
        blueMissed: number;
        teams: TeamPickupCollection;
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

        // Store individual team data for this match
        if (data.red.teams) {
            for (const teamNumber in data.red.teams) {
                const teamData = data.red.teams[teamNumber];
                const teamRef = doc(db, "teamHumanplayers", teamNumber);
                const teamDoc = await getDoc(teamRef);
                const existingTeamData = teamDoc.data() || {
                    teamNumber: parseInt(teamNumber),
                    totalScored: 0,
                    totalMissed: 0,
                    matchesPlayed: 0,
                    matches: {}
                };

                // Add match-specific data
                const matchKey = `match_${data.red.match}`;
                existingTeamData.matches[matchKey] = {
                    match: data.red.match,
                    scored: teamData.scored,
                    missed: teamData.missed,
                    percentage: teamData.scored + teamData.missed > 0 
                        ? (teamData.scored / (teamData.scored + teamData.missed)) * 100 
                        : 0
                };

                // Update aggregate data
                existingTeamData.totalScored += teamData.scored;
                existingTeamData.totalMissed += teamData.missed;
                existingTeamData.matchesPlayed = Object.keys(existingTeamData.matches).length;

                // Calculate total percentage
                existingTeamData.pickupPercentage = existingTeamData.totalScored + existingTeamData.totalMissed > 0 
                    ? (existingTeamData.totalScored / (existingTeamData.totalScored + existingTeamData.totalMissed)) * 100 
                    : 0;

                await setDoc(teamRef, existingTeamData);
            }
        }

        if (data.blue.teams) {
            for (const teamNumber in data.blue.teams) {
                const teamData = data.blue.teams[teamNumber];
                const teamRef = doc(db, "teamHumanplayers", teamNumber);
                const teamDoc = await getDoc(teamRef);
                const existingTeamData = teamDoc.data() || {
                    teamNumber: parseInt(teamNumber),
                    totalScored: 0,
                    totalMissed: 0,
                    matchesPlayed: 0,
                    matches: {}
                };

                // Add match-specific data
                const matchKey = `match_${data.blue.match}`;
                existingTeamData.matches[matchKey] = {
                    match: data.blue.match,
                    scored: teamData.scored,
                    missed: teamData.missed,
                    percentage: teamData.scored + teamData.missed > 0 
                        ? (teamData.scored / (teamData.scored + teamData.missed)) * 100 
                        : 0
                };

                // Update aggregate data
                existingTeamData.totalScored += teamData.scored;
                existingTeamData.totalMissed += teamData.missed;
                existingTeamData.matchesPlayed = Object.keys(existingTeamData.matches).length;

                // Calculate total percentage
                existingTeamData.pickupPercentage = existingTeamData.totalScored + existingTeamData.totalMissed > 0 
                    ? (existingTeamData.totalScored / (existingTeamData.totalScored + existingTeamData.totalMissed)) * 100 
                    : 0;

                await setDoc(teamRef, existingTeamData);
            }
        }

        return { success: true, message: "HP data submitted for both teams" };
    } catch (error) {
        console.error("Error submitting HP data:", error);
        return { success: false, message: "Failed to submit HP data" };
    }
};

import { db } from "@/app/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export interface PitScoutData {
    robotWeight: number;
    robotSpeed: number;
    bumperClearance: number;
    centerOfGravity: string;
    drivetrainType: string;
    defenseComfort: number;
    // algaeCapability: number;
    // coralCapability: number;
    l1Capability: number;
    l2Capability: number;
    l3Capability: number;
    l4Capability: number;
    netCapability: number;
    processorCapability: number;
    driverExperience: number;
    climbAbility: string;
    pickupLocation: string;
    notes: string;
}

export const submitPitData = async (team: string, data: PitScoutData) => {
    try {
        await setDoc(
            doc(db, "pitscout", team),
            {
                team: parseInt(team),
                ...data,
                timestamp: new Date().toISOString()
            }
        );
        return { success: true, message: "Pit data submitted successfully" };
    } catch (error) {
        console.error("Error submitting pit data:", error);
        return { success: false, message: "Failed to submit pit data" };
    }
};

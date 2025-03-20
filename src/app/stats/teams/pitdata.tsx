"use client"

import { useState, useEffect } from "react"
import { db } from "@/app/firebase/firebase"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { PitScoutData } from "@/app/pitscout/submitPitData"

interface PitDataProps {
    team: number;
}

export function PitData({ team }: PitDataProps) {
    const [pitData, setPitData] = useState<PitScoutData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPitData = async () => {
            try {
                const docRef = doc(db, "pitscout", team.toString());
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setPitData(docSnap.data() as PitScoutData);
                } else {
                    setPitData(null);
                }
            } catch (error) {
                console.error("Error fetching pit data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (team) {
            fetchPitData();
        }
    }, [team]);

    if (loading) {
        return <div>Loading pit data...</div>;
    }

    if (!pitData) {
        return <div className="text-gray-500 italic">No pit data available</div>;
    }

    return (
        <div className="rounded-md border p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <h3 className="font-semibold text-gray-400">Robot Weight</h3>
                    <p>{pitData.robotWeight} lbs</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Robot Speed</h3>
                    <p>{pitData.robotSpeed} ft/s</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Bumper Tolerance</h3>
                    <p>{pitData.bumperTolerance} in</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Center of Gravity</h3>
                    <p>{pitData.centerOfGravity}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Drivetrain Type</h3>
                    <p>{pitData.drivetrainType}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Defense Comfort</h3>
                    <p>{pitData.defenseComfort}/5</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Algae Capability</h3>
                    <p>{pitData.algaeCapability}/5</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Coral Capability</h3>
                    <p>{pitData.coralCapability}/5</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Driver Experience</h3>
                    <p>{pitData.driverExperience}/4</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Climb Ability</h3>
                    <p>{pitData.climbAbility}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Pickup Location</h3>
                    <p>{pitData.pickupLocation}</p>
                </div>
            </div>
            {pitData.notes && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-400">Notes</h3>
                    <p className="mt-1 text-sm">{pitData.notes}</p>
                </div>
            )}
        </div>
    );
} 
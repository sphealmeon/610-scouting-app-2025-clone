/*
    Pit Scouting Categories
    - Robot Weight
    - Robot Speed
    - Tippyness/CoG 
    - Type of Drivetrain
    - Comfortability playing Defense
    - Algae and Coral Scoring Capabilities
    - Climb Ability
*/

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitPitData, PitScoutData } from "./submitPitData";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/app/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PitScoutCategories({ teamNumber }: { teamNumber: string }) {
    const [robotWeight, setRobotWeight] = useState<number>(0);
    const [robotSpeed, setRobotSpeed] = useState<number>(0);
    const [centerOfGravity, setCenterOfGravity] = useState<string>("");
    const [drivetrainType, setDrivetrainType] = useState<string>("");
    const [defenseComfort, setDefenseComfort] = useState<number>(1);
    const [algaeCapability, setAlgaeCapability] = useState<number>(1);
    const [coralCapability, setCoralCapability] = useState<number>(1);
    const [climbAbility, setClimbAbility] = useState<string>("");
    const [pickupLocation, setPickupLocation] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [existingData, setExistingData] = useState<boolean>(false);

    // Load existing pit data when team changes
    useEffect(() => {
        const loadPitData = async () => {
            if (!teamNumber) return;
            
            setIsLoading(true);
            try {
                const pitDocRef = doc(db, "pitscout", teamNumber);
                const pitDocSnap = await getDoc(pitDocRef);
                
                if (pitDocSnap.exists()) {
                    const data = pitDocSnap.data() as PitScoutData & { timestamp?: string };
                    
                    // Update all state values with existing data
                    setRobotWeight(data.robotWeight || 0);
                    setRobotSpeed(data.robotSpeed || 0);
                    setCenterOfGravity(data.centerOfGravity || "");
                    setDrivetrainType(data.drivetrainType || "");
                    setDefenseComfort(data.defenseComfort || 1);
                    setAlgaeCapability(data.algaeCapability || 1);
                    setCoralCapability(data.coralCapability || 1);
                    setClimbAbility(data.climbAbility || "");
                    setPickupLocation(data.pickupLocation || "");
                    setNotes(data.notes || "");
                    
                    setExistingData(true);
                    toast.info(`Loaded existing pit data from ${new Date(data.timestamp || "").toLocaleString()}`);
                } else {
                    // Reset form for new team
                    setRobotWeight(0);
                    setRobotSpeed(0);
                    setCenterOfGravity("");
                    setDrivetrainType("");
                    setDefenseComfort(1);
                    setAlgaeCapability(1);
                    setCoralCapability(1);
                    setClimbAbility("");
                    setPickupLocation("");
                    setNotes("");
                    
                    setExistingData(false);
                }
            } catch (error) {
                console.error("Error loading pit data:", error);
                toast.error("Failed to load existing pit data");
            } finally {
                setIsLoading(false);
            }
        };
        
        loadPitData();
    }, [teamNumber]);

    const handleSubmit = async () => {
        if (!teamNumber) {
            toast.error("Please select a team first");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitPitData(teamNumber, {
                robotWeight,
                robotSpeed,
                centerOfGravity,
                drivetrainType,
                defenseComfort,
                algaeCapability,
                coralCapability,
                climbAbility,
                pickupLocation,
                notes
            });

            if (result.success) {
                toast.success(existingData ? "Pit data updated successfully" : "Pit data submitted successfully");
                setExistingData(true);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred while submitting data");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <p className="text-lg">Loading pit data...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-4 max-w-[1400px] mx-auto">
            {existingData && (
                <div className="bg-blue-500/20 border border-blue-500 rounded-md p-4 text-center">
                    <p className="text-lg">
                        Editing existing pit data for Team {teamNumber}
                    </p>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - with self-start alignment */}
                <div className="flex flex-col gap-8 self-start">
                    {/* Numeric Inputs */}
                    <div className="grid gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="weight">Robot Weight (lbs)</Label>
                            <Input 
                                type="number"
                                id="weight"
                                value={robotWeight}
                                onChange={(e) => setRobotWeight(Number(e.target.value))}
                                className="bg-gray-700"
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="speed">Robot Speed (ft/s)</Label>
                            <Input 
                                type="number"
                                id="speed"
                                value={robotSpeed}
                                onChange={(e) => setRobotSpeed(Number(e.target.value))}
                                className="bg-gray-700"
                            />
                        </div>
                    </div>

                    {/* Center of Gravity Selection */}
                    <Card>
                        <CardContent className="pt-6">
                            <Label>Center of Gravity</Label>
                            <RadioGroup 
                                value={centerOfGravity} 
                                onValueChange={setCenterOfGravity}
                                className="flex flex-col gap-2 mt-2"
                            >
                                {[
                                    { value: "low", label: "Low" },
                                    { value: "middle", label: "Middle" },
                                    { value: "high", label: "High" }
                                ].map((item) => (
                                    <div key={item.value} className="flex items-center space-x-2">
                                        <div className={`
                                            flex items-center rounded-md border-2 px-3 py-2 w-full
                                            ${centerOfGravity === item.value 
                                                ? 'border-green-500 bg-green-500/20' 
                                                : 'border-gray-700'
                                            }
                                        `}>
                                            <RadioGroupItem value={item.value} id={`cog-${item.value}`} />
                                            <Label htmlFor={`cog-${item.value}`} className="ml-2 cursor-pointer w-full">
                                                {item.label}
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* Drivetrain Type Selection */}
                    <Card>
                        <CardContent className="pt-6">
                            <Label>Drivetrain Type</Label>
                            <RadioGroup 
                                value={drivetrainType} 
                                onValueChange={setDrivetrainType}
                                className="flex flex-col gap-2 mt-2"
                            >
                                {[
                                    { value: "tank", label: "Tank" },
                                    { value: "swerve", label: "Swerve" },
                                    { value: "mecanum", label: "Mecanum" },
                                    { value: "other", label: "Other" }
                                ].map((item) => (
                                    <div key={item.value} className="flex items-center space-x-2">
                                        <div className={`
                                            flex items-center rounded-md border-2 px-3 py-2 w-full
                                            ${drivetrainType === item.value 
                                                ? 'border-green-500 bg-green-500/20' 
                                                : 'border-gray-700'
                                            }
                                        `}>
                                            <RadioGroupItem value={item.value} id={`dt-${item.value}`} />
                                            <Label htmlFor={`dt-${item.value}`} className="ml-2 cursor-pointer w-full">
                                                {item.label}
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - with self-start alignment */}
                <div className="flex flex-col gap-8 self-start">
                    {/* Sliders Card */}
                    <Card>
                        <CardContent className="pt-6 space-y-8">
                            <div className="space-y-4">
                                <Label>Defense Comfortability (1-5)</Label>
                                <Slider 
                                    value={[defenseComfort]}
                                    onValueChange={(value) => setDefenseComfort(value[0])}
                                    min={1}
                                    max={5}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="text-right">Value: {defenseComfort}</div>
                            </div>

                            <div className="space-y-4">
                                <Label>Algae Scoring Capability (1-5)</Label>
                                <Slider 
                                    value={[algaeCapability]}
                                    onValueChange={(value) => setAlgaeCapability(value[0])}
                                    min={1}
                                    max={5}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="text-right">Value: {algaeCapability}</div>
                            </div>

                            <div className="space-y-4">
                                <Label>Coral Scoring Capability (1-5)</Label>
                                <Slider 
                                    value={[coralCapability]}
                                    onValueChange={(value) => setCoralCapability(value[0])}
                                    min={1}
                                    max={5}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="text-right">Value: {coralCapability}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Climb Ability Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <Label>Climb Ability</Label>
                            <RadioGroup 
                                value={climbAbility} 
                                onValueChange={setClimbAbility}
                                className="flex flex-col gap-2 mt-2"
                            >
                                {[
                                    { value: "none", label: "No Climb" },
                                    { value: "shallow", label: "Shallow" },
                                    { value: "deep", label: "Deep" }
                                ].map((item) => (
                                    <div key={item.value} className="flex items-center space-x-2">
                                        <div className={`
                                            flex items-center rounded-md border-2 px-3 py-2 w-full
                                            ${climbAbility === item.value 
                                                ? 'border-green-500 bg-green-500/20' 
                                                : 'border-gray-700'
                                            }
                                        `}>
                                            <RadioGroupItem value={item.value} id={`climb-${item.value}`} />
                                            <Label htmlFor={`climb-${item.value}`} className="ml-2 cursor-pointer w-full">
                                                {item.label}
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Pickup Location Buttons */}
            <Card className="w-full">
                <CardContent className="pt-6">
                    <Label className="mb-4 block text-lg">Pickup Location Preference</Label>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {[
                            { value: "floor", label: "Floor" },
                            { value: "hybrid", label: "Hybrid" },
                            { value: "station", label: "Coral Station" }
                        ].map((item) => (
                            <Button
                                key={item.value}
                                onClick={() => setPickupLocation(item.value)}
                                className={`flex-1 py-6 text-lg ${
                                    pickupLocation === item.value
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Extra Notes Section */}
            <Card className="w-full">
                <CardContent className="pt-6">
                    <Label className="mb-4 block text-lg">Extra Notes</Label>
                    <Textarea
                        placeholder="Add any additional observations about the robot..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px] bg-gray-700"
                    />
                </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-6 text-xl ${
                    existingData 
                        ? "bg-yellow-600 hover:bg-yellow-700" 
                        : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {isSubmitting 
                    ? "Submitting..." 
                    : existingData 
                        ? "Update Pit Data" 
                        : "Submit Pit Data"
                }
            </Button>
        </div>
    );
}


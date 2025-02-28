"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitHPData } from "./submitHP";
import { toast } from "sonner";

export default function HPCategories() {
    const [redTeam, setRedTeam] = useState<number>(0);
    const [redMatch, setRedMatch] = useState<number>(0);
    const [redScored, setRedScored] = useState<number>(0);
    const [redMissed, setRedMissed] = useState<number>(0);
    const [blueTeam, setBlueTeam] = useState<number>(0);
    const [blueMatch, setBlueMatch] = useState<number>(0);
    const [blueScored, setBlueScored] = useState<number>(0);
    const [blueMissed, setBlueMissed] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!redTeam || !blueTeam) {
            toast.error("Please enter both team numbers");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitHPData({
                red: {
                    team: redTeam,
                    match: redMatch,
                    redScored: redScored,
                    redMissed: redMissed,
                },
                blue: {
                    team: blueTeam,
                    match: blueMatch,
                    blueScored: blueScored,
                    blueMissed: blueMissed,
                }
            });

            if (result.success) {
                toast.success(result.message);
                // Reset form
                setRedTeam(0);
                setRedMatch(0);
                setRedScored(0);
                setRedMissed(0);
                setBlueTeam(0);
                setBlueMatch(0);
                setBlueScored(0);
                setBlueMissed(0);
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

    return (
        <div className="flex flex-col gap-8 p-4 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Red Alliance */}
                <Card>
                    <CardContent className="pt-6">
                        <Label className="text-red-500 text-xl mb-4 block">Red Alliance</Label>
                        <div className="space-y-4">
                            <div>
                                <Label>Team Number</Label>
                                <Input 
                                    type="number"
                                    value={redTeam}
                                    onChange={(e) => setRedTeam(Number(e.target.value))}
                                    className="bg-gray-700"
                                />
                            </div>
                            <div>
                                <Label>Match Number</Label>
                                <Input 
                                    type="number"
                                    value={redMatch}
                                    onChange={(e) => setRedMatch(Number(e.target.value))}
                                    className="bg-gray-700"
                                />
                            </div>
                            <div>
                                <Label>Scored</Label>
                                <Input 
                                    type="number"
                                    value={redScored}
                                    onChange={(e) => setRedScored(Number(e.target.value))}
                                    className="bg-gray-700"
                                />
                            </div>
                            <div>
                                <Label>Missed</Label>
                                <Input 
                                    type="number"
                                    value={redMissed}
                                    onChange={(e) => setRedMissed(Number(e.target.value))}
                                    className="bg-gray-700"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Blue Alliance */}
                <Card>
                    <CardContent className="pt-6">
                        <Label className="text-blue-500 text-xl mb-4 block">Blue Alliance</Label>
                        <div className="space-y-4">
                            <div>
                                <Label>Team Number</Label>
                                <Input 
                                    type="number"
                                    value={blueTeam}
                                    onChange={(e) => setBlueTeam(Number(e.target.value))}
                                    className="bg-gray-700"
                                />
                            </div>
                            <div>
                                <Label>Match Number</Label>
                                <Input 
                                    type="number"
                                    value={blueMatch}
                                    onChange={(e) => setBlueMatch(Number(e.target.value))}
                                    className="bg-gray-700"
                                />
                            </div>
                            <div>
                                <Label>Scored</Label>
                                <Input 
                                    type="number"
                                    value={blueScored}
                                    onChange={(e) => setBlueScored(Number(e.target.value))}
                                    className="bg-gray-700"
                                />
                            </div>
                            <div>
                                <Label>Missed</Label>
                                <Input 
                                    type="number"
                                    value={blueMissed}
                                    onChange={(e) => setBlueMissed(Number(e.target.value))}
                                    className="bg-gray-700"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-6 text-xl bg-blue-600 hover:bg-blue-700"
            >
                {isSubmitting ? "Submitting..." : "Submit HP Data"}
            </Button>
        </div>
    );
} 
import React from "react";
import { Button } from "@/components/ui/button";
import { resetData, ScoutingData } from "../data";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SubmitMatch } from "@/app/firebase/submitMatch";

export default function Popup({ 
    setConfirm,
    setMatchState,
    }: { 
        setConfirm: React.Dispatch<React.SetStateAction<boolean>>
        setMatchState: Function
    }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Confirmation</CardTitle>
                    <CardDescription>Are you sure you want to proceed?</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Click "Yes" to confirm or "No" to cancel.</p>
                </CardContent>
                <CardFooter className="flex justify-start gap-4">
                    <Button
                        className="bg-red-400 hover:bg-red-300"
                        onClick={() => setConfirm(false)}
                    >
                        No
                    </Button>
                    <Button
                        className="bg-green-500 hover:bg-green-400"
                        onClick={() => {
                            SubmitMatch({team: ScoutingData.start.team, match: ScoutingData.start.match, matchData: ScoutingData})
                            setMatchState(0);
                            resetData();
                            setConfirm(false);
                        }}
                    >
                        Yes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

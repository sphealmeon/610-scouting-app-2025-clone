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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-1/2 relative">
                <button
                    onClick={() => setConfirm(false)}
                    className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl font-bold"
                >
                    ×
                </button>
                <div className="text-white">
                    <CardHeader>
                        <CardTitle>Confirmation</CardTitle>
                        <CardDescription>Are you sure you want to proceed?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Click Yes to confirm or No to cancel.</p>
                    </CardContent>
                    <CardFooter className="flex justify-start gap-4">
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
                        <Button
                            className="bg-red-400 hover:bg-red-300"
                            onClick={() => setConfirm(false)}
                        >
                            No
                        </Button>
                    </CardFooter>
                </div>
            </div>
        </div>
    );
}

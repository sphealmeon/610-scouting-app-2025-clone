import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react"
import { ScoutingData } from "../data";
import { Button } from "@/components/ui/button";

export default function NotesReview() {
    const [parkChecked, setParkChecked] = useState(ScoutingData.teleop.park === 1);
    const [shallowChecked, setShallowChecked] = useState(ScoutingData.teleop.shallow === 1);
    const [missedShallowChecked, setMissedShallowChecked] = useState(ScoutingData.teleop.missedShallow === 1);
    const [deepChecked, setDeepChecked] = useState(ScoutingData.teleop.deep === 1);
    const [missedDeepChecked, setMissedDeepChecked] = useState(ScoutingData.teleop.missedDeep === 1);
    const [generalNotes, setGeneralNotes] = useState(ScoutingData.teleop.general);
    const [robotIssues, setRobotIssues] = useState(ScoutingData.teleop.reason);
    const [playedDefenseChecked, setPlayedDefenseChecked] = useState(ScoutingData.teleop.playedDefense === 1);
    const [brokenChecked, setBrokenChecked] = useState(false);
    const [fouls, setFouls] = useState(ScoutingData.teleop.fouls);

    useEffect(() => {
        ScoutingData.teleop.fouls = fouls;
    }, [fouls]);

    const incrementFouls = () => {
        setFouls(prev => {
            const newValue = prev + 1;
            ScoutingData.teleop.fouls = newValue;
            return newValue;
        });
    };

    const decrementFouls = () => {
        if (fouls > 0) {
            setFouls(prev => {
                const newValue = prev - 1;
                ScoutingData.teleop.fouls = newValue;
                return newValue;
            });
        }
    };

    const handleBrokenChange = (checked: boolean) => {
        setBrokenChecked(checked);
        if (checked) {
            const defaultText = "Robot issue is:";
            setRobotIssues(defaultText);
            ScoutingData.teleop.reason = defaultText;
        }
    };

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="space-y-6">
                <div className="grid gap-4">
                    <label className="flex items-center gap-4">
                        <Checkbox
                            className="h-6 w-6 hover:bg-gray-500"
                            checked={parkChecked}
                            disabled={shallowChecked || deepChecked}
                            onCheckedChange={(checked: boolean) => {
                                setParkChecked(checked);
                                ScoutingData.teleop.park = checked ? 1 : 0;
                            }}
                        />
                        <span className="text-2xl">Park</span>
                    </label>

                    <label className="flex items-center gap-4">
                        <Checkbox 
                            className="h-6 w-6 hover:bg-gray-500"
                            checked={shallowChecked}
                            disabled={parkChecked || missedShallowChecked || deepChecked} 
                            onCheckedChange={(checked: boolean) => {
                                setShallowChecked(checked);
                                ScoutingData.teleop.shallow = checked ? 1 : 0;
                            }}
                        />
                        <span className="text-2xl">Shallow Cage</span>
                    </label>

                    <label className="flex items-center gap-4">
                        <Checkbox
                            className="h-6 w-6 hover:bg-gray-500"
                            checked={missedShallowChecked}
                            disabled={shallowChecked} 
                            onCheckedChange={(checked: boolean) => {
                                setMissedShallowChecked(checked);
                                ScoutingData.teleop.missedShallow = checked ? 1 : 0;
                            }}
                        />
                        <span className="text-2xl">Missed Shallow Cage</span>
                    </label>

                    <label className="flex items-center gap-4">
                        <Checkbox
                            className="h-6 w-6 hover:bg-gray-500"
                            checked={deepChecked}
                            disabled={parkChecked || shallowChecked || missedDeepChecked} 
                            onCheckedChange={(checked: boolean) => {
                                setDeepChecked(checked);
                                ScoutingData.teleop.deep = checked ? 1 : 0;
                            }}
                        />
                        <span className="text-2xl">Deep Cage</span>
                    </label>

                    <label className="flex items-center gap-4">
                        <Checkbox
                            className="h-6 w-6 hover:bg-gray-500"
                            checked={missedDeepChecked}
                            disabled={deepChecked} 
                            onCheckedChange={(checked: boolean) => {
                                setMissedDeepChecked(checked);
                                ScoutingData.teleop.missedDeep = checked ? 1 : 0;
                            }}
                        />
                        <span className="text-2xl">Missed Deep Cage</span>
                    </label>
                    <label className="flex items-center gap-4">
                        <Checkbox
                            className="h-6 w-6 hover:bg-gray-500"
                            checked={playedDefenseChecked}
                            onCheckedChange={(checked: boolean) => {
                                setPlayedDefenseChecked(checked);
                                ScoutingData.teleop.playedDefense = checked ? 1 : 0;
                            }}
                        />
                        <span className="text-2xl">Played Defense</span>
                    </label>

                    {/* Fouls Counter Section */}
                    <div className="flex items-center gap-4">
                        <span className="text-2xl">Fouls: {fouls}</span>
                        <div className="flex gap-2">
                            <Button
                                onClick={decrementFouls}
                                className="w-8 h-8 text-xl bg-red-700 hover:bg-red-600 text-white p-0"
                            >
                                -
                            </Button>
                            <Button
                                onClick={incrementFouls}
                                className="w-8 h-8 text-xl bg-green-700 hover:bg-green-600 text-white p-0"
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">Additional Notes</h2>
                <div className="space-y-4">
                    <div>
                        <Label className="text-xl mb-2">Match Notes</Label>
                        <Textarea 
                            value={generalNotes}
                            onChange={(e) => {
                                setGeneralNotes(e.target.value);
                                ScoutingData.teleop.general = e.target.value;
                            }}
                            placeholder="Add any general notes about the match..." 
                            className="w-full h-24 resize-none"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Checkbox
                                className="h-5 w-5 hover:bg-gray-500"
                                checked={brokenChecked}
                                onCheckedChange={(checked: boolean) => handleBrokenChange(checked)}
                            />
                            <Label className="text-xl">Broken</Label>
                        </div>
                        <Label className="text-xl mb-2">Robot Issues</Label>
                        <Textarea 
                            value={robotIssues}
                            onChange={(e) => {
                                setRobotIssues(e.target.value);
                                ScoutingData.teleop.reason = e.target.value;
                            }}
                            placeholder="Describe any robot problems or breakdowns..." 
                            className="w-full h-24 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

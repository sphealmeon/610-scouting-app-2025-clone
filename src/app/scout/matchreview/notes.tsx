import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import React, { useState } from "react"
import { ScoutingData } from "../../data";

export default function NotesReview() {
    const [parkChecked, setParkChecked] = useState(ScoutingData.teleop.park === 1);
    const [shallowChecked, setShallowChecked] = useState(ScoutingData.teleop.shallow === 1);
    const [missedShallowChecked, setMissedShallowChecked] = useState(ScoutingData.teleop.missedshallow === 1);
    const [deepChecked, setDeepChecked] = useState(ScoutingData.teleop.deep === 1);
    const [missedDeepChecked, setMissedDeepChecked] = useState(ScoutingData.teleop.misseddeep === 1);
    const [generalNotes, setGeneralNotes] = useState(ScoutingData.teleop.general);
    const [robotIssues, setRobotIssues] = useState(ScoutingData.teleop.reason);

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Endgame Review</h2>
                <div className="grid gap-4">
                    <label className="flex items-center gap-4">
                        <Checkbox
                            className="h-6 w-6"
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
                            className="h-6 w-6"
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
                            className="h-6 w-6"
                            checked={missedShallowChecked}
                            disabled={shallowChecked} 
                            onCheckedChange={(checked: boolean) => {
                                setMissedShallowChecked(checked);
                                ScoutingData.teleop.missedshallow = checked ? 1 : 0;
                            }}
                        />
                        <span className="text-2xl">Missed Shallow Cage</span>
                    </label>

                    <label className="flex items-center gap-4">
                        <Checkbox
                            className="h-6 w-6"
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
                            className="h-6 w-6"
                            checked={missedDeepChecked}
                            disabled={deepChecked} 
                            onCheckedChange={(checked: boolean) => {
                                setMissedDeepChecked(checked);
                                ScoutingData.teleop.misseddeep = checked ? 1 : 0;
                            }}
                        />
                        <span className="text-2xl">Missed Deep Cage</span>
                    </label>
                </div>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Additional Notes</h2>
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

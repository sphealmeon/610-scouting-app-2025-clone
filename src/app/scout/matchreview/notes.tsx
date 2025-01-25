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
    return (
        <div className="text-2xl flex flex-col items-start space-y-4 p-4">
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
                    <span className="text-3xl">Park</span>
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
                    <span className="text-3xl">Shallow Cage</span>
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
                    <span className="text-3xl">Missed Shallow Cage</span>
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
                    <span className="text-3xl">Deep Cage</span>
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
                    <span className="text-3xl">Missed Deep Cage</span>
                </label>
            
            <Label>Notes</Label>
            <Textarea placeholder="Notes" className="w-1/3 h-20 resize-none"/>

            <Label>Broken?</Label>
            <Textarea placeholder="What Happened?" className="w-1/3 h-20 resize-none"/>
        </div>
    );
}

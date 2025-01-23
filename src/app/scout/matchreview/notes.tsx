import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import React, { useState } from "react"


export default function NotesReview() {
    const [parkChecked, setParkChecked] = useState(false);
    const [shallowChecked, setShallowChecked] = useState(false);
    const [missedShallowChecked, setMissedShallowChecked] = useState(false);
    const [deepChecked, setDeepChecked] = useState(false);
    const [missedDeepChecked, setMissedDeepChecked] = useState(false);
    return (
        <div className="text-2xl flex flex-col items-start space-y-4 p-4">
            <label className="flex items-center gap-4">
                    <Checkbox
                        className="h-6 w-6"
                        checked={parkChecked}
                        disabled={shallowChecked || deepChecked} 
                        onCheckedChange={(checked: boolean) => {
                            setParkChecked(checked == true);
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
                            setShallowChecked(checked == true);
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
                            setMissedShallowChecked(checked == true);
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
                            setDeepChecked(checked == true);
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
                            setMissedDeepChecked(checked == true);
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

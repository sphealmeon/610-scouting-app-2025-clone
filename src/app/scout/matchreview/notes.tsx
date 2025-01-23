import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NotesReview() {
    return (
        <div className="text-2xl flex flex-col items-start space-y-4">
            <label className="flex items-center space-x-2">
                <Checkbox className="w-6 h-6" />
                <span>Deep Cage</span>
            </label>

            <label className="flex items-center space-x-2">
                <Checkbox className="w-6 h-6" />
                <span>Shallow Cage</span>
            </label>

            <label className="flex items-center space-x-2">
                <Checkbox className="w-6 h-6" />
                <span>Park</span>
            </label>
            
            <Input placeholder="Notes"/>

            <Label>Broken?</Label>
            <Input placeholder="What Happened?"/>
        </div>
    );
}

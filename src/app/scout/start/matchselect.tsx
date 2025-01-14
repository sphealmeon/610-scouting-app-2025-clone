import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function MatchSelect(){
    const [matchNumber, setMatchNumber] = useState("");

    const handleMatchNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setMatchNumber(value);

        if (value) {
            console.log("input success");
        }
    };

    return(
        <div className="w-1/2 flex flex-col items-center justify-center">
            <p className="text-2xl mb-6 font-bold">Scouting App</p>
            <Input
                className="mb-6"
                type="text"
                placeholder="Match Number"
                value={matchNumber}
                onChange={handleMatchNumberChange}
            />
            <Input className="mb-6" type="text" placeholder="Team Number"/>
            
            {/* Container for checkbox and label */}
            <div className="flex items-center mb-6">
                <Checkbox id="preload" />
                <label 
                    htmlFor="preload" 
                    className="text-sm font-medium leading-none ml-2"
                >
                    Preload?
                </label>
            </div>
        </div>
    );
}
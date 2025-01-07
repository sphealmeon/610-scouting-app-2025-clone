import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";


export default function MatchSelect(){
    return(
        <div className="w-1/2 flex flex-col items-center justify-center">
            <p className="text-2xl mb-6 font-bold">Scouting App</p>
            <Input className="mb-6" type="text" placeholder="Match Number"/>
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
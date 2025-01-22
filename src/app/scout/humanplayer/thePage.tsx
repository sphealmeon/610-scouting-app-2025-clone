import { Button } from "@/components/ui/button";
import HumanPlayerMain from "./scoring";

export default function HumanPlayerPage({setMatchState}: {setMatchState: Function}){
    return(
        <div className="justify-center items-center">
            <HumanPlayerMain setMatchState={setMatchState}/>
        </div>
    )
}
import { Button } from "@/components/ui/button";
import ChangeButton from "../components/changeButton";

export default function ScoutSelect({setMatchState}: {setMatchState: Function}){
    return(
        <div className="flex flex-col justify-center items-center space-y-4">
            <Button 
                className="mb-20 text-xl py-6 px-8"
                onClick={() => setMatchState(1)}
            >
                Robot Scout
            </Button>
            {/* <Button 
                className="mb-20 text-xl py-6 px-8"
            >Robot Scout</Button> */}
            <Button 
                className="text-xl py-6 px-8"
                onClick={() => setMatchState(4)}
            >
                HP Scout
            </Button>
        </div>
    );
}
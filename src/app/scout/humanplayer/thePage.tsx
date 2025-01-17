import { Button } from "@/components/ui/button";

export default function HumanPlayerPage({setMatchState}: {setMatchState: Function}){
    return(
        <div className="flex h-screen justify-center items-center">
            <p className="text-2xl mb-6 font-bold">Human Player</p>
            <div className=" "></div>
            <Button
                onClick={() => setMatchState(0)}
            >
                Back to Start
            </Button>
        </div>
    )
}
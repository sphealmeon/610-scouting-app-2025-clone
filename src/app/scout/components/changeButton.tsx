import { Button } from "@/components/ui/button";
import React from "react";

export default function ChangeButton({ name, setMatchState }: {name: string; setMatchState: Function;}){
    return(
        <Button variant="outline" color="black" className="absolute bottom-4 right-4" onClick={() =>
            name == "Teleop" ? setMatchState(2) : name == "Auto" ? setMatchState(1) : name == "Match Review" ? setMatchState(3) : setMatchState(0)
        }>
        {name}
        </Button>
    );
}
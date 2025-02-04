import { Button } from "@/components/ui/button";
import React from "react";
import { ScoutingData } from "../data";

export default function ChangeButton({ name, setMatchState }: {name: string; setMatchState: Function;}) {
    const handleClick = () => {
        if (name === "Teleop") {
            setMatchState(2);
        } else if (name === "Auto") {
            setMatchState(1);
        } else if (name === "Match Review") {
            setMatchState(3);
        } else {
            setMatchState(0);
        }
        console.log("Current ScoutingData:", ScoutingData);
    };

    return (
        <Button onClick={handleClick}>
            {name}
        </Button>
    );
}
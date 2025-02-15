import { Button } from "@/components/ui/button";
import React from "react";

interface ChangeButtonProps {
    name: string;
    setMatchState: (state: number) => void;
    disabled?: boolean;
}

export default function ChangeButton({ name, setMatchState, disabled }: ChangeButtonProps) {
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
    };

    return (
        <Button 
            onClick={handleClick}
            disabled={disabled}
        >
            {name}
        </Button>
    );
}
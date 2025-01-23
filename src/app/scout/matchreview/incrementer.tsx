"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react";

const Incrementer = () => {
    const [count, setCount] = useState(0);
    // Handle increment and decrement
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);

    return(
        <div className="flex flex-col items-center h-screen justify-center">
            <p className="mb-4 text-lg">Corals Scored: {count}</p>
            <div className="flex flex-row gap-4">
                <Button onClick={decrement}>-</Button>
                <p className="text-lg">{count}</p>
                <Button onClick={increment}>+</Button>
            </div>
        </div>
    );
}

export default Incrementer;

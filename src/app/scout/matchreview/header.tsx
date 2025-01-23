'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReviewHeader({ handlePageChange }: { handlePageChange: (state: string) => void }) {
    const router = useRouter();

    return(
        <div className="bg-green-200 flex flex-row h-20 w-full items-center justify-center gap-20 rounded-r border-2 border-green-900">
            <Button 
                className="h-15 w-45 text-3xl bg-red-400 hover:bg-red-300"
                onClick={() => router.push('/scout/teleop')}
            >
                    Return
            </Button>

            <Button 
                className="h-15 w-45 text-3xl bg-green-500 hover:bg-green-400"
                onClick={() => handlePageChange("auto")}
            >Auto + Endgame</Button>
            <Button 
                className="h-15 w-40 text-3xl bg-green-500 hover:bg-green-400"
                onClick={() => handlePageChange("teleop")}
            >
                Teleop
            </Button>
            <Button 
                className="h-15 w-40 text-3xl bg-green-500 hover:bg-green-400"
                onClick={() => handlePageChange("notes")}
            >
                Notes
        </Button>
            <Button 
                className="h-15 w-40 text-3xl bg-green-500 hover:bg-green-400"
                onClick={() => router.push('/scout/start')}
            >
            Confirm
            </Button>
        </div>
    );
}

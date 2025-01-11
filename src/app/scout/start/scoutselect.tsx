import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ScoutSelect(){
    const router = useRouter();

    return(
        <div className="flex flex-col justify-center items-center space-y-4">
            <Button 
            className="mb-20 text-xl py-6 px-8"
            onClick={() => router.push('/scout/teleop')}
            >
                Robot Scout
            </Button>
            <Button className="text-xl py-6 px-8">HP Scout</Button>
        </div>
    );
}
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ScoutSelect(){
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    }

    return(
        <div className="flex flex-col justify-center items-center space-y-4">
            <Button
                className="mb-20 text-xl py-6 px-8"
                onClick={() => handleNavigation("/scout/teleop")}
            >Robot Scout</Button>
            <Button 
                className="text-xl py-6 px-8"
                onClick={() => handleNavigation("/scout/hp")}
            >HP Scout</Button>
        </div>
    );
}
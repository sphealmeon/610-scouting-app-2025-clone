import { Button } from "@/components/ui/button";

export default function ScoutSelect(){
    return(
        <div className="flex flex-col justify-center items-center space-y-4">
            <Button className="mb-20 text-xl py-6 px-8">Robot Scout</Button>
            <Button className="text-xl py-6 px-8">HP Scout</Button>
        </div>
    );
}
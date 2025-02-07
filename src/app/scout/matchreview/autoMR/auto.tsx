import ReefMR from "./reefMR";
import LeaveMR from "./leaveMR";
import AlgaeMR from "./algaeMR";

export default function AutoReview() {
    return(
        <div className="flex">
            <div className="w-1/2 p-4">
                <ReefMR/>
            </div>
            <div className="w-1/2 p-4"> 
                <LeaveMR />
            </div>
            <div className="w-1/2 p-4">
                <AlgaeMR />
            </div>
        </div>
    );
}
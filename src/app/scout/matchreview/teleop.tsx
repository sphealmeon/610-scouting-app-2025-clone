import Matchpoints from "./matchpoints";
export default function TeleopReview({setMatchState}: {setMatchState: Function}) {
    return (
        <div className="h-screen">
            <Matchpoints setMatchState={setMatchState}/>
        </div>
    );
}

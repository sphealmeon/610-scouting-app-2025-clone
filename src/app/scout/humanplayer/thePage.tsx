import HumanPlayerMain from "./scoring";

export default function HumanPlayerPage({setMatchState}: {setMatchState: (state: number) => void}){
    return(
        <div className="justify-center items-center">
            <HumanPlayerMain setMatchState={setMatchState}/>
        </div>
    )
}
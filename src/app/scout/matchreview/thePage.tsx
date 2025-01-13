import Incrementer from "./incrementer";
import ScoutHeader from "../components/scoutHeader";

export default function Home({setMatchState}: {setMatchState: Function}){
    return(
        <>
            {/*<ScoutHeader name={"MatchReview"}/>*/}
            <Incrementer></Incrementer>
        </>
    );
}

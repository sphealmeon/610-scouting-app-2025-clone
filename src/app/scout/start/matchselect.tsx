// export default function MatchSelect(){
//     const [matchNumber, setMatchNumber] = useState("");

//     const handleMatchNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value;
//         setMatchNumber(value);

//         if (value) {
//             console.log("input success");
//         }
//     };

//     return(
//         <div className="w-1/2 flex flex-col items-center justify-center">
//             <p className="text-2xl mb-6 font-bold">Scouting App</p>
//             <Input
//                 className="mb-6"
//                 type="text"
//                 placeholder="Match Number"
//                 value={matchNumber}
//                 onChange={handleMatchNumberChange}
//             />
//             <Input className="mb-6" type="text" placeholder="Team Number"/>
            
//             {/* Container for checkbox and label */}
//             <div className="flex items-center mb-6">
//                 <Checkbox id="preload" />
//                 <label 
//                     htmlFor="preload" 
//                     className="text-sm font-medium leading-none ml-2"
//                 >
//                     Preload?
//                 </label>
//             </div>
//         </div>
//     );
// }

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { key } from "@/app/globalVars"; // Assuming `key` contains the event key for the API
import { useApi } from "@/app/globalVars"; // Assuming `useApi` determines if the API should be used

export default function MatchSelect() {
    const [matchNumber, setMatchNumber] = useState("");
    const [teams, setTeams] = useState<string[]>([]);
    const [error, setError] = useState("");

    const handleMatchNumberChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setMatchNumber(value);

        if (value) {
            try {
                if (useApi) {
                    const request = await fetch(
                        "https://www.thebluealliance.com/api/v3/event/" + key + "/matches",
                        {
                            method: "GET",
                            headers: {
                                "X-TBA-Auth-Key":
                                    "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO",
                            },
                        }
                    );

                    if (!request.ok) {
                        throw new Error("Failed to fetch data from The Blue Alliance.");
                    }

                    const data = await request.json();

                    // Find the match by match number
                    const match = data.find(
                        (m: any) =>
                            m.match_number === parseInt(value, 10) &&
                            m.comp_level === "qm" // Adjust `comp_level` as necessary
                    );

                    if (match) {
                        // Extract red and blue alliance teams
                        const redTeams = match.alliances.red.team_keys;
                        const blueTeams = match.alliances.blue.team_keys;
                        setTeams([...redTeams, ...blueTeams]); // Combine teams
                        setError("");
                        console.log("Teams:", [...redTeams, ...blueTeams]);
                    } else {
                        setTeams([]);
                        setError("No match found with the specified match number.");
                    }
                } else {
                    setError("API usage is disabled.");
                }
            } catch (err) {
                setTeams([]);
                setError("An error occurred while fetching match data.");
                console.error(err);
            }
        } else {
            setTeams([]);
            setError("");
        }
    };

    return (
        <div className="w-1/2 flex flex-col items-center justify-center">
            <p className="text-2xl mb-6 font-bold">Scouting App</p>
            <Input
                className="mb-6"
                type="text"
                placeholder="Match Number"
                value={matchNumber}
                onChange={handleMatchNumberChange}
            />
            <Input className="mb-6" type="text" placeholder="Team Number" />

            {/* Display teams */}
            {/* <div className="mb-6">
                {teams.length > 0 ? (
                    <ul>
                        {teams.map((team, index) => (
                            <li key={index} className="text-lg">
                                {team}
                            </li>
                        ))}
                    </ul>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <p>No teams found yet.</p>
                )}
            </div> */}

            {/* Container for checkbox and label */}
            <div className="flex items-center mb-6">
                <Checkbox id="preload" />
                <label htmlFor="preload" className="text-sm font-medium leading-none ml-2">
                    Preload?
                </label>
            </div>
        </div>
    );
}

import { key, qualificationMatches, useApi } from "../globalVars";


export let qualMatchLength = 0;
export let semiMatchLength = 0;

export const FetchMatches = ({ setMatches }: { setMatches?: Function }) => {
    if (useApi) {
        fetch("https://www.thebluealliance.com/api/v3/event/" + key + "/matches", {
            method: "GET",
            headers: {
                "X-TBA-Auth-Key":
                    "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const allMatches: string[] = [];
                qualMatchLength = 0;
                semiMatchLength = 0;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].key.includes("_qm")) {
                        allMatches.push(allMatches.length + 1 + "");
                        qualMatchLength++;
                    }
                }
                let currentSemiFinalMatch = 1;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].key.includes("_sf")) {
                        allMatches.push("Playoffs " + currentSemiFinalMatch);
                        //   allMatches.push(allMatches.length + 1 + "");
                        //   in case this shit does not work
                        currentSemiFinalMatch++;
                        semiMatchLength++;
                    }
                }
                let currentFinalMatch = 1;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].key.includes("_f")) {
                        allMatches.push("Finals " + currentFinalMatch);
                        // allMatches.push(allMatches.length + 1 + ""); in case this shit doesnt work
                        currentFinalMatch++;
                    }
                }
                if (setMatches)
                    setMatches(allMatches);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        if (setMatches) {
            setMatches(qualificationMatches);
        }
    }
};
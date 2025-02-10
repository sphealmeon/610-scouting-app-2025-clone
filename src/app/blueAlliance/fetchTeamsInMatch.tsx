import { key, teams, useApi } from "../globalVars";

export const FetchTeams = ({ setTeams }: { setTeams: Function }) => {
    if (useApi) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        fetch("https://www.thebluealliance.com/api/v3/event/" + key + "/matches", {
            method: "GET",
            headers: {
              "X-TBA-Auth-Key":
                "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO",
            },
            signal: controller.signal
          })
          .then((response) => {
            clearTimeout(timeoutId);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const allTeams: string[] = [];
            for (let index = 0; index < data.length; index++) {
              allTeams.push(data[index].team_number + "");
            }
            setTeams(allTeams);
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.error("Request timed out after 5 seconds");
              setTeams(teams); // Fallback to default teams on timeout
            } else {
              console.error("Error:", error);
            }
          });
    } else {
        setTeams(teams);
    }
};

export const FetchAlliance = async (matchNumber: number, teamNumber: number) => {
    if (useApi) {
        try {
            const response = await fetch("https://www.thebluealliance.com/api/v3/event/" + key + "/matches", {
                method: "GET",
                headers: {
                    "X-TBA-Auth-Key": "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO",
                },
            });
            
            const data = await response.json();
            const match = data.find((m: any) => m.comp_level === "qm" && m.match_number === matchNumber);
            
            if (match) {
                const blueTeams = match.alliances.blue.team_keys.map((key: string) => parseInt(key.replace('frc', '')));
                const redTeams = match.alliances.red.team_keys.map((key: string) => parseInt(key.replace('frc', '')));
                
                if (blueTeams.includes(teamNumber)) {
                    return "blue";
                } else if (redTeams.includes(teamNumber)) {
                    return "red";
                }
            }
        } catch (error) {
            console.error("Error fetching alliance:", error);
        }
    }
    return "";
};

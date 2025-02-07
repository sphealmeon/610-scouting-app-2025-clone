import { key, useApi } from "../globalVars";

interface MatchTeams {
    red: number[];
    blue: number[];
}

export const FetchTeamsInMatch = async ({ match }: { match: number }): Promise<MatchTeams | null> => {
    if (useApi) {
        try {
            const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${key}/matches`, {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key":
                  "ZsbRGTknrkbJAl3OBXVaRh8loiP9ecki3Ag2q1DpExs7yRg9g0RVsXTY3edbMBQO",
              },
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Match data:", data);
            
            const matchData = data.find((m: any) => m.match_number === match && m.comp_level === "qm");
            console.log("Found match:", matchData);
            
            if (matchData) {
                const teams = {
                    red: matchData.alliances.red.team_keys.map((key: string) => parseInt(key.slice(3))),
                    blue: matchData.alliances.blue.team_keys.map((key: string) => parseInt(key.slice(3)))
                };
                console.log("Returning teams:", teams);
                return teams;
            }
        } catch (error) {
            console.error("Error fetching match teams:", error);
        }
    }
    return null;
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

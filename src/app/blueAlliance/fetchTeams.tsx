import { key, teams, useApi } from "../globalVars";

export const FetchTeams = ({ setTeams }: { setTeams: (teams: string[]) => void }) => {
    if (useApi) {
        fetch("https://www.thebluealliance.com/api/v3/event/" + key + "/teams", {
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
            const allTeams: string[] = [];
            for (let index = 0; index < data.length; index++) {
              allTeams.push(data[index].team_number + "");
            }
            setTeams(allTeams);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    } else {
        setTeams(teams);
    }
};

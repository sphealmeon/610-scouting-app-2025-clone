import { key, teams, useApi } from "../globalVars";

export const FetchTeams = ({ setTeams }: { setTeams: Function }) => {
  if (useApi) {
    fetch(`https://www.thebluealliance.com/api/v3/event/${key}/teams`, {
      method: "GET",
      headers: {
        "X-TBA-Auth-Key": "x3Sqnzlw0RuZZ4LcGbByIaHC5bpxa11X3YDA6NknR1VhFzYwcIyJsrAhNGh2cTcW",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API response data:", data); // Log the response data
        const allTeams: string[] = [];
        if (Array.isArray(data)) {
          for (let index = 0; index < data.length; index++) {
            allTeams.push(data[index].team_number + "");
          }
        } else {
          allTeams.push(data.team_number + "");
        }
        setTeams(allTeams);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  } else {
    setTeams(teams);
  }
};

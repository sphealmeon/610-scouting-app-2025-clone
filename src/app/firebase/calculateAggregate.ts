import { Data, AggregateData } from "../interfaces";
import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { key, useApi } from "../globalVars";
import { TeamAggregate } from "./teamaggregate";

/**
 * calcualtes Aggregate Data for a team
 * @param team the team to calculate Aggregate Data for
 */
export const CalculateAggregate = async ({ team }: { team: number }) => {
  let standing: number = 0;
  let opr: number = 0;
  let dpr: number = 0;

  //gets opr & dpr from BA or else gets it from saved database
  if (useApi) {
    await fetch(
      "https://www.thebluealliance.com/api/v3/event/" + key + "/oprs",
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key":
            "R0slEz1yXDCVyedRLzFMoE5QrgkG4i73OwRuKlNHiw7lVMuO2lBQcwuzdg6iqvAq",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        opr = data.oprs["frc" + team];
        dpr = data.dprs["frc" + team];
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    await fetch(
      "https://www.thebluealliance.com/api/v3/event/" + key + "/rankings",
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key":
            "R0slEz1yXDCVyedRLzFMoE5QrgkG4i73OwRuKlNHiw7lVMuO2lBQcwuzdg6iqvAq",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        for (let j = 0; j < data.rankings.length; j++) {
          if ("frc" + team == data.rankings[j].team_key) {
            standing = parseInt(data.rankings[j].rank);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    const tempAggData: AggregateData = await TeamAggregate({ team: team });
    opr = tempAggData.opr;
    dpr = tempAggData.dpr;
    standing = tempAggData.standing;
  }

  let numMatches: number = 0;
  let timesBroke: number = 0;

  const totalData: Data = {
    start: {
      team: 0,
      match: 0,
      preload: 0,
      position: 0,
    },
    auto: {
      leave: 0,
      ring1: 0,
      ring2: 0,
      ring3: 0,
      ring4: 0,
      ring5: 0,
      speaker: 0,
      amp: 0,
      dropped: 0,
    },
    teleop: {
      floorPickUp: 0,
      sourcePickUp: 0,
      speakerScored: 0,
      ampScored: 0,
      trapScored: 0,
      feed: 0,
      fieldDrop: 0,
      speakerDrop: 0,
      ampDrop: 0,
      trapDrop: 0,
      park: 0,
      hang: 0,
      harmony: 0,
      distShot: 0,
      missedClimb: 0,
      general: "",
      reason: "",
      explination: "",
    },
  };

  const ignoreBrokenVar: boolean = await getIgnoreBroken();
  let useLast4MatchesVar: boolean = await getUseLast4Matches();
  const last4Matches: string[] = [];

  let numMatchesForRawAverage: number = 0;

  //Calculates the average for all raw match values
  const querySnapshot = await getDocs(collection(db, team + ""));
  if (useLast4MatchesVar) {
    const tempArray: number[] = [];
    querySnapshot.forEach((document) => {
      if (!(document.id == "aggregate")) {
        if (ignoreBrokenVar) {
          if (document.data().matchData["teleop"]["reason"] == "") {
            tempArray.push(parseInt(document.id));
          }
        } else {
          tempArray.push(parseInt(document.id));
        }
      }
    });
    tempArray.sort(function (a, b) {
      return b - a;
    });
    if (tempArray.length <= 4) {
      useLast4MatchesVar = false;
    } else {
      for (let i = 0; i < 4; i++) {
        last4Matches.push(tempArray[i] + "");
      }
    }
    console.log(last4Matches);
  }
  querySnapshot.forEach((document) => {
    if (!(document.id == "aggregate")) {
      if (document.data().matchData["teleop"]["reason"] != "") {
        timesBroke++;
      }
      numMatches++;
      if (
        (ignoreBrokenVar &&
          document.data().matchData["teleop"]["reason"] == "") ||
        !ignoreBrokenVar
      ) {
        if (
          (useLast4MatchesVar && last4Matches.includes(document.id)) ||
          !useLast4MatchesVar
        ) {
          console.log("team = " + team + "match = " + document.id);
          const keys = Object.keys(totalData) as Array<keyof typeof totalData>;
          numMatchesForRawAverage++;
          keys.forEach((key) => {
            for (const value in totalData[key]) {
              if (
                value == "ring1" ||
                value == "ring2" ||
                value == "ring3" ||
                value == "ring4" ||
                value == "ring5"
              ) {
                totalData[key][value] *= numMatchesForRawAverage - 1;
                totalData[key][value] +=
                  document.data().matchData[key][value] != 0 ? 1 : 0;
                totalData[key][value] /= numMatchesForRawAverage;
              } else if (
                !(
                  value == "team" ||
                  value == "match" ||
                  value == "position" ||
                  value == "general" ||
                  value == "reason" ||
                  value == "explination"
                )
              ) {
                totalData[key][value] *= numMatchesForRawAverage - 1;
                totalData[key][value] += document.data().matchData[key][value];
                totalData[key][value] /= numMatchesForRawAverage;
              }
            }
          });
        }
      }
    }
  });

  //Converts it to an AggregateData object
  const aggregateData: AggregateData = {
    matchAggregateData: totalData,
    team: team,
    matchesPlayed: numMatches,
    autoPPG:
      totalData.auto.speaker * 5 +
      totalData.auto.amp * 2 +
      totalData.auto.leave * 2,
    autoAccuracy:
      totalData.auto.speaker == 0 && totalData.auto.amp == 0
        ? 0
        : (totalData.auto.speaker + totalData.auto.amp) /
          (totalData.auto.speaker +
            totalData.auto.amp +
            totalData.auto.dropped),
    climbAccuracy:
      totalData.teleop.hang == 0
        ? 0
        : totalData.teleop.hang /
          (totalData.teleop.hang + totalData.teleop.missedClimb),
    speakerTeleAccuracy:
      totalData.teleop.speakerScored == 0
        ? 0
        : totalData.teleop.speakerScored /
          (totalData.teleop.speakerScored + totalData.teleop.speakerDrop),
    ampTeleAccuracy:
      totalData.teleop.ampScored == 0
        ? 0
        : totalData.teleop.ampScored /
          (totalData.teleop.ampScored + totalData.teleop.ampDrop),
    trapAccuracy:
      totalData.teleop.trapScored == 0
        ? 0
        : totalData.teleop.trapScored /
          (totalData.teleop.trapScored + totalData.teleop.trapDrop),
    teleopMisses:
      totalData.teleop.fieldDrop +
      totalData.teleop.speakerDrop +
      totalData.teleop.ampDrop +
      totalData.teleop.trapDrop,
    teleopCyclesScored:
      totalData.teleop.speakerScored +
      totalData.teleop.ampScored +
      totalData.teleop.trapScored,
    teleopTotalCycles:
      totalData.teleop.speakerScored +
      totalData.teleop.ampScored +
      totalData.teleop.trapScored +
      totalData.teleop.fieldDrop +
      totalData.teleop.speakerDrop +
      totalData.teleop.ampDrop +
      totalData.teleop.trapDrop +
      totalData.teleop.feed,
    teleopAccuracy:
      totalData.teleop.speakerScored +
        totalData.teleop.ampScored +
        totalData.teleop.trapScored ==
      0
        ? 0
        : (totalData.teleop.speakerScored +
            totalData.teleop.ampScored +
            totalData.teleop.trapScored) /
          (totalData.teleop.speakerScored +
            totalData.teleop.ampScored +
            totalData.teleop.trapScored +
            totalData.teleop.fieldDrop +
            totalData.teleop.speakerDrop +
            totalData.teleop.ampDrop +
            totalData.teleop.trapDrop),
    endgamePPG:
      totalData.teleop.trapScored * 5 +
      totalData.teleop.park +
      totalData.teleop.hang * 3 +
      totalData.teleop.harmony * 5,
    distShot2:
      totalData.teleop.distShot,
    brokePercentage: numMatches == 0 ? 0 : timesBroke / numMatches,
    opr: opr,
    dpr: dpr,
    standing: standing,
  };

  //Sets the new Aggregate Data
  await setDoc(
    doc(db, team + "", "aggregate"),
    {
      aggregateData,
    },
    { merge: true }
  );
};
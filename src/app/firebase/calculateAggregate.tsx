import { Data, AggregateData } from "../interfaces";
import { ScoutingData } from "../scout/data"
import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useApi } from "../globalVars";
import { key } from "../globalVars";
import { TeamAggregate } from "./TeamAggregate";
import { getIgnoreBroken, getUseLast4Matches } from "./aggregateModifiers";

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
    standing = tempAggData.standing;
  }

  let numMatches: number = 0;
  let timesBroke: number = 0;

  const totalData: Data = {
    start: {
      team: ScoutingData.start.team,
      match: ScoutingData.start.match,
      preload: ScoutingData.start.preload,
      position: ScoutingData.start.position,
      scoutName: ScoutingData.start.scoutName,
      alliance: ScoutingData.start.alliance,
    },
    auto: {
      leave: ScoutingData.auto.leave,
      coral: ScoutingData.auto.coral,
      algae: ScoutingData.auto.algae,
      droppedCoral: ScoutingData.auto.droppedCoral,
      droppedAlgae: ScoutingData.auto.droppedAlgae,
      l4: ScoutingData.auto.l4,
      l3: ScoutingData.auto.l3,
      l2: ScoutingData.auto.l2,
      l1: ScoutingData.auto.l1,
      l4A: ScoutingData.auto.l4A,
      l4B: ScoutingData.auto.l4B,
      l4C: ScoutingData.auto.l4C,
      l4D: ScoutingData.auto.l4D,
      l4E: ScoutingData.auto.l4E,
      l4F: ScoutingData.auto.l4F,
      l4G: ScoutingData.auto.l4G,
      l4H: ScoutingData.auto.l4H,
      l4I: ScoutingData.auto.l4I,
      l4J: ScoutingData.auto.l4J,
      l4K: ScoutingData.auto.l4K,
      l4L: ScoutingData.auto.l4L,
      l3A: ScoutingData.auto.l3A,
      l3B: ScoutingData.auto.l3B,
      l3C: ScoutingData.auto.l3C,
      l3D: ScoutingData.auto.l3D,
      l3E: ScoutingData.auto.l3E,
      l3F: ScoutingData.auto.l3F,
      l3G: ScoutingData.auto.l3G,
      l3H: ScoutingData.auto.l3H,
      l3I: ScoutingData.auto.l3I,
      l3J: ScoutingData.auto.l3J,
      l3K: ScoutingData.auto.l3K,
      l3L: ScoutingData.auto.l3L,
      l2A: ScoutingData.auto.l2A,
      l2B: ScoutingData.auto.l2B,
      l2C: ScoutingData.auto.l2C,
      l2D: ScoutingData.auto.l2D,
      l2E: ScoutingData.auto.l2E,
      l2F: ScoutingData.auto.l2F,
      l2G: ScoutingData.auto.l2G,
      l2H: ScoutingData.auto.l2H,
      l2I: ScoutingData.auto.l2I,
      l2J: ScoutingData.auto.l2J,
      l2K: ScoutingData.auto.l2K,
      l2L: ScoutingData.auto.l2L,
      l1A: ScoutingData.auto.l1A,
      l1B: ScoutingData.auto.l1B,
      l1C: ScoutingData.auto.l1C,
      l1D: ScoutingData.auto.l1D,
      l1E: ScoutingData.auto.l1E,
      l1F: ScoutingData.auto.l1F,
      algaeA: ScoutingData.auto.algaeA,
      algaeB: ScoutingData.auto.algaeB,
      algaeC: ScoutingData.auto.algaeC,
      algaeD: ScoutingData.auto.algaeD,
      algaeE: ScoutingData.auto.algaeE,
      algaeF: ScoutingData.auto.algaeF,
      processor: ScoutingData.auto.processor,
      barge: ScoutingData.auto.barge,
    },
    teleop: {
      coralPickup: ScoutingData.teleop.coralPickup,
      coralPickupFromStation: ScoutingData.teleop.coralPickupFromStation,
      pickupAlgae: ScoutingData.teleop.pickupAlgae,
      pickupAlgaeFromReef: ScoutingData.teleop.pickupAlgaeFromReef,
      l4Scored: ScoutingData.teleop.l4Scored,
      l3Scored: ScoutingData.teleop.l3Scored,
      l2Scored: ScoutingData.teleop.l2Scored,
      l1Scored: ScoutingData.teleop.l1Scored,
      l4Dropped: ScoutingData.teleop.l4Dropped,
      l3Dropped: ScoutingData.teleop.l3Dropped,
      l2Dropped: ScoutingData.teleop.l2Dropped,
      l1Dropped: ScoutingData.teleop.l1Dropped,
      processorScored: ScoutingData.teleop.processorScored,
      processorDropped: ScoutingData.teleop.processorDropped,
      bargeScored: ScoutingData.teleop.bargeScored,
      bargeDropped: ScoutingData.teleop.bargeDropped,
      algaeRemoved: ScoutingData.teleop.algaeRemoved,
      isCoop: ScoutingData.teleop.isCoop,
      park: ScoutingData.teleop.park,
      shallow: ScoutingData.teleop.shallow,
      deep: ScoutingData.teleop.deep,
      missedShallow: ScoutingData.teleop.missedShallow,
      missedDeep: ScoutingData.teleop.missedDeep,
      general: ScoutingData.teleop.general,
      reason: ScoutingData.teleop.reason,
      explanation: ScoutingData.teleop.explanation,
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
    standing: standing,
    matchesPlayed: numMatches,
    autoPPG:
      totalData.auto.l4 * 7 +
      totalData.auto.l3 * 6 +
      totalData.auto.l2 * 4 +
      totalData.auto.l1 * 3 +
      totalData.auto.leave * 3 +
      totalData.auto.processor * 6 +
      totalData.auto.barge * 4, 
    teleopPPG:
      totalData.teleop.l4Scored * 5 +
      totalData.teleop.l3Scored * 4 +
      totalData.teleop.l2Scored * 3 +
      totalData.teleop.l1Scored * 2 +
      totalData.teleop.processorScored * 6 +
      totalData.teleop.bargeScored * 4,

    coralCyclesScored:
      totalData.teleop.l4Scored +
      totalData.teleop.l3Scored +
      totalData.teleop.l2Scored +
      totalData.teleop.l1Scored +
      totalData.auto.coral,
    algaeCyclesScored:
      totalData.auto.barge +
      totalData.auto.processor +
      totalData.teleop.bargeScored +
      totalData.teleop.processorScored,

    autoL1Accuracy:
      totalData.auto.l1 == 0
        ? 0
        : totalData.auto.l1 /
          (totalData.auto.l1 + totalData.auto.droppedCoral),
    autoL2Accuracy:
      totalData.auto.l2 == 0
        ? 0
        : totalData.auto.l2 /
          (totalData.auto.l2 + totalData.auto.droppedCoral),
    autoL3Accuracy:
      totalData.auto.l3 == 0
        ? 0
        : totalData.auto.l3 /
          (totalData.auto.l3 + totalData.auto.droppedCoral),
    autoL4Accuracy:
      totalData.auto.l4 == 0
        ? 0
        : totalData.auto.l4 /
          (totalData.auto.l4 + totalData.auto.droppedAlgae),
          
    teleopL1Accuracy:
      totalData.teleop.l1Scored == 0
        ? 0
        : totalData.teleop.l1Scored /
          (totalData.teleop.l1Scored + totalData.teleop.l1Dropped),
    teleopL2Accuracy:
      totalData.teleop.l2Scored == 0
        ? 0
        : totalData.teleop.l2Scored /
          (totalData.teleop.l2Scored + totalData.teleop.l2Dropped),
    teleopL3Accuracy:
      totalData.teleop.l3Scored == 0
        ? 0
        : totalData.teleop.l3Scored /
          (totalData.teleop.l3Scored + totalData.teleop.l3Dropped),
    teleopL4Accuracy:
      totalData.teleop.l4Scored == 0
        ? 0
        : totalData.teleop.l4Scored /
          (totalData.teleop.l4Scored + totalData.teleop.l4Dropped),
    teleopBargeAccuracy:
      totalData.teleop.bargeScored == 0
        ? 0
        : totalData.teleop.bargeScored /
          (totalData.teleop.bargeScored + totalData.teleop.bargeDropped),
    teleopProcessorAccuracy:
      totalData.teleop.processorScored == 0
        ? 0
        : totalData.teleop.processorScored /
          (totalData.teleop.processorScored + totalData.teleop.processorDropped),

    shallowAccuracy:
      totalData.teleop.shallow == 0
        ? 0
        : totalData.teleop.shallow /
          (totalData.teleop.shallow + totalData.teleop.missedShallow),
    deepAccuracy:
      totalData.teleop.deep == 0
        ? 0
        : totalData.teleop.deep /
          (totalData.teleop.deep + totalData.teleop.missedDeep),
    endgamePPG:
      totalData.teleop.deep * 12 +
      totalData.teleop.shallow * 6 +
      totalData.teleop.park * 2,
    brokePercentage: numMatches === 0 ? 0 : timesBroke / numMatches,
  };


  //Sets the new Aggregate Data
  await setDoc(
    doc(db, team.toString(), "aggregate"),
    {
      aggregateData,
    },
    { 
      merge: true 
    }
  );
};

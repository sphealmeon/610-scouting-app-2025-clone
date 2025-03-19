import { Data, AggregateData } from "../interfaces";
import { ScoutingData } from "../scout/data"
import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useApi } from "../globalVars";
import { key } from "../globalVars";
import { TeamAggregate } from "./TeamAggregate";

/**
 * calcualtes Aggregate Data for a team
 * @param team the team to calculate Aggregate Data for
 */
export const CalculateAggregate = async ({ team }: { team: number }) => {
  let standing: number = 0;
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
  } 
  let numMatches: number = 0;
  let timesBroke: number = 0;
  let defenseMatches: number = 0;

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
      leave: 0,
      coral: 0,
      algae: 0,
      droppedCoral: 0,
      droppedAlgae: 0,
      l4: 0,
      l3: 0,
      l2: 0,
      l1: 0,
      l4A: { made: 0, dropped: 0 },
      l4B: { made: 0, dropped: 0 },
      l4C: { made: 0, dropped: 0 },
      l4D: { made: 0, dropped: 0 },
      l4E: { made: 0, dropped: 0 },
      l4F: { made: 0, dropped: 0 },
      l4G: { made: 0, dropped: 0 },
      l4H: { made: 0, dropped: 0 },
      l4I: { made: 0, dropped: 0 },
      l4J: { made: 0, dropped: 0 },
      l4K: { made: 0, dropped: 0 },
      l4L: { made: 0, dropped: 0 },
      l3A: { made: 0, dropped: 0 },
      l3B: { made: 0, dropped: 0 },
      l3C: { made: 0, dropped: 0 },
      l3D: { made: 0, dropped: 0 },
      l3E: { made: 0, dropped: 0 },
      l3F: { made: 0, dropped: 0 },
      l3G: { made: 0, dropped: 0 },
      l3H: { made: 0, dropped: 0 },
      l3I: { made: 0, dropped: 0 },
      l3J: { made: 0, dropped: 0 },
      l3K: { made: 0, dropped: 0 },
      l3L: { made: 0, dropped: 0 },
      l2A: { made: 0, dropped: 0 },
      l2B: { made: 0, dropped: 0 },
      l2C: { made: 0, dropped: 0 },
      l2D: { made: 0, dropped: 0 },
      l2E: { made: 0, dropped: 0 },
      l2F: { made: 0, dropped: 0 },
      l2G: { made: 0, dropped: 0 },
      l2H: { made: 0, dropped: 0 },
      l2I: { made: 0, dropped: 0 },
      l2J: { made: 0, dropped: 0 },
      l2K: { made: 0, dropped: 0 },
      l2L: { made: 0, dropped: 0 },
      l1A: { made: 0, dropped: 0 },
      l1B: { made: 0, dropped: 0 },
      l1C: { made: 0, dropped: 0 },
      l1D: { made: 0, dropped: 0 },
      l1E: { made: 0, dropped: 0 },
      l1F: { made: 0, dropped: 0 },
      algaeA: 0,
      algaeB: 0,
      algaeC: 0,
      algaeD: 0,
      algaeE: 0,
      algaeF: 0,
      processor: 0,
      barge: 0,
    },
    teleop: {
      droppedOnField: 0,
      coralPickup: 0,
      coralPickupFromStation: 0,
      pickupAlgae: 0,
      pickupAlgaeFromReef: 0,
      l4Scored: 0,
      l3Scored: 0,
      l2Scored: 0,
      l1Scored: 0,
      l4Dropped: 0,
      l3Dropped: 0,
      l2Dropped: 0,
      l1Dropped: 0,
      processorScored: 0,
      processorDropped: 0,
      bargeScored: 0,
      bargeDropped: 0,
      algaeRemoved: 0,
      isCoop: 0,
      park: 0,
      shallow: 0,
      deep: 0,
      missedShallow: 0,
      missedDeep: 0, 
      playedDefense: 0,
      general: "",
      reason: "",
      explanation: "",

      coralAverageScoringTime: 0,
        processorAverageScoringTime: 0,
        bargeAverageScoringTime: 0,
        shallowAverageHangTime: 0,
        deepAverageHangTime: 0,

        coralCyclesForTimer: 0,
        processorCyclesForTimer: 0,
        bargeCyclesForTimer: 0,
    },
  };

  let numMatchesForRawAverage: number = 0;

  // Calculate averages for all matches
  const querySnapshot = await getDocs(collection(db, team + ""));
  querySnapshot.forEach((document) => {
    if (!(document.id == "aggregate")) {
      if (document.data().matchData["teleop"]["reason"] != "") {
        timesBroke++;
      }
      if (document.data().matchData["teleop"]["playedDefense"] == 1) {
        defenseMatches++;
      }
      numMatches++;
      
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
  });

  // Create aggregate data
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
    playedDefenseMatches: defenseMatches,
    brokePercentage: numMatches === 0 ? 0 : timesBroke / numMatches,
  };

  // Set the new Aggregate Data
  try {
    await setDoc(
      doc(db, team.toString(), "aggregate"),
      {
        aggregateData,
      },
    );
    console.log("Successfully updated aggregate data for team", team);
  } catch (error) {
    console.error("Error updating aggregate data:", error);
  }
};

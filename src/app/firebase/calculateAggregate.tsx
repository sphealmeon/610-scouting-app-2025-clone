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
  let timesShallowHang: number = 0;
  let timesDeepHang: number = 0;
  let totalFouls: number = 0;
  
  // Initialize accumulators for timing data
  let totalCoralScoringTime: number = 0;
  let totalProcessorScoringTime: number = 0;
  let totalBargeScoringTime: number = 0;
  let totalShallowHangTime: number = 0;
  let totalDeepHangTime: number = 0;
  let weightedBrokePercentage: number = 0;
  let totalBreakScore: number = 0;

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
      droppedInL1: 0,
      l4A: { made: 0, dropped: 0, droppedInL1: 0 },
      l4B: { made: 0, dropped: 0, droppedInL1: 0 },
      l4C: { made: 0, dropped: 0, droppedInL1: 0 },
      l4D: { made: 0, dropped: 0, droppedInL1: 0 },
      l4E: { made: 0, dropped: 0, droppedInL1: 0 },
      l4F: { made: 0, dropped: 0, droppedInL1: 0 },
      l4G: { made: 0, dropped: 0, droppedInL1: 0 },
      l4H: { made: 0, dropped: 0, droppedInL1: 0 },
      l4I: { made: 0, dropped: 0, droppedInL1: 0 },
      l4J: { made: 0, dropped: 0, droppedInL1: 0 },
      l4K: { made: 0, dropped: 0, droppedInL1: 0 },
      l4L: { made: 0, dropped: 0, droppedInL1: 0 },
      l3A: { made: 0, dropped: 0, droppedInL1: 0 },
      l3B: { made: 0, dropped: 0, droppedInL1: 0 },
      l3C: { made: 0, dropped: 0, droppedInL1: 0 },
      l3D: { made: 0, dropped: 0, droppedInL1: 0 },
      l3E: { made: 0, dropped: 0, droppedInL1: 0 },
      l3F: { made: 0, dropped: 0, droppedInL1: 0 },
      l3G: { made: 0, dropped: 0, droppedInL1: 0 },
      l3H: { made: 0, dropped: 0, droppedInL1: 0 },
      l3I: { made: 0, dropped: 0, droppedInL1: 0 },
      l3J: { made: 0, dropped: 0, droppedInL1: 0 },
      l3K: { made: 0, dropped: 0, droppedInL1: 0 },
      l3L: { made: 0, dropped: 0, droppedInL1: 0 },
      l2A: { made: 0, dropped: 0, droppedInL1: 0 },
      l2B: { made: 0, dropped: 0, droppedInL1: 0 },
      l2C: { made: 0, dropped: 0, droppedInL1: 0 },
      l2D: { made: 0, dropped: 0, droppedInL1: 0 },
      l2E: { made: 0, dropped: 0, droppedInL1: 0 },
      l2F: { made: 0, dropped: 0, droppedInL1: 0 },
      l2G: { made: 0, dropped: 0, droppedInL1: 0 },
      l2H: { made: 0, dropped: 0, droppedInL1: 0 },
      l2I: { made: 0, dropped: 0, droppedInL1: 0 },
      l2J: { made: 0, dropped: 0, droppedInL1: 0 },
      l2K: { made: 0, dropped: 0, droppedInL1: 0 },
      l2L: { made: 0, dropped: 0, droppedInL1: 0 },
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
      l4DroppedInL1: 0,
      l3Dropped: 0,
      l3DroppedInL1: 0,
      l2Dropped: 0,
      l2DroppedInL1: 0,
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
      fouls: 0,
      general: "",
      reason: "",
      explanation: "",
      breakDuration: 0,
      breakSeverity: 0,

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
  console.log(`Found ${querySnapshot.size} documents for team ${team}`);
  
  querySnapshot.forEach((document) => {
    if (!(document.id == "aggregate")) {
      // Debug the complete document structure
      const docData = document.data();
      console.log(`---- DOCUMENT ${document.id} ----`);
      console.log("Document structure:", JSON.stringify(docData, null, 2));
      
      // Specifically check the data path we're using
      if (docData.matchData && docData.matchData.teleop) {
        console.log("teleop data:", docData.matchData.teleop);
        console.log("reason:", docData.matchData.teleop.reason);
        console.log("breakSeverity:", docData.matchData.teleop.breakSeverity, typeof docData.matchData.teleop.breakSeverity);
        console.log("breakDuration:", docData.matchData.teleop.breakDuration, typeof docData.matchData.teleop.breakDuration);
      } else {
        console.log("ERROR: Missing expected data structure in document");
        console.log("docData.matchData exists:", !!docData.matchData);
        if (docData.matchData) {
          console.log("docData.matchData.teleop exists:", !!docData.matchData.teleop);
        }
      }
      
      if (docData.matchData && docData.matchData.teleop && docData.matchData.teleop.reason !== "") {
        timesBroke++;
        
        // Use explicit type conversion to ensure numbers
        const rawSeverity = docData.matchData.teleop.breakSeverity;
        const rawDuration = docData.matchData.teleop.breakDuration;
        
        const breakSeverity = typeof rawSeverity === 'string' ? parseFloat(rawSeverity) : (rawSeverity || 0);
        const breakDuration = typeof rawDuration === 'string' ? parseFloat(rawDuration) : (rawDuration || 0);
        
        console.log(`Converted values: severity=${breakSeverity}, duration=${breakDuration}`);
        
        const matchBreakScore = (breakDuration/150) * (breakSeverity/5);
        totalBreakScore += matchBreakScore;
        
        console.log(`Match ${document.id} Break Score: ${matchBreakScore.toFixed(4)}`);
        console.log(`Running Total: ${totalBreakScore.toFixed(4)}`);
      }
      if (document.data().matchData["teleop"]["playedDefense"] == 1) {
        defenseMatches++;
      }
      
      const matchData = document.data().matchData;

      // Add fouls to total
      totalFouls += matchData.teleop.fouls;
      
      // Count shallow and deep hang times separately
      if (matchData.teleop.shallowAverageHangTime > 0) {
        timesShallowHang++;
        totalShallowHangTime += matchData.teleop.shallowAverageHangTime;
      }
      if (matchData.teleop.deepAverageHangTime > 0) {
        timesDeepHang++;
        totalDeepHangTime += matchData.teleop.deepAverageHangTime;
      }
      
      // Accumulate cycle times
      totalCoralScoringTime += matchData.teleop.coralAverageScoringTime;
      totalProcessorScoringTime += matchData.teleop.processorAverageScoringTime;
      totalBargeScoringTime += matchData.teleop.bargeAverageScoringTime;
      
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
              value == "explination" ||
              value == "fouls" ||
              // Exclude timing fields from the general accumulation
              value == "coralAverageScoringTime" ||
              value == "processorAverageScoringTime" ||
              value == "bargeAverageScoringTime" ||
              value == "shallowAverageHangTime" ||
              value == "deepAverageHangTime"
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

  // Calculate averages for timing data
  totalData.teleop.coralAverageScoringTime = numMatches > 0 ? totalCoralScoringTime / numMatches : 0;
  totalData.teleop.processorAverageScoringTime = numMatches > 0 ? totalProcessorScoringTime / numMatches : 0;
  totalData.teleop.bargeAverageScoringTime = numMatches > 0 ? totalBargeScoringTime / numMatches : 0;
  totalData.teleop.shallowAverageHangTime = timesShallowHang > 0 ? totalShallowHangTime / timesShallowHang : 0;
  totalData.teleop.deepAverageHangTime = timesDeepHang > 0 ? totalDeepHangTime / timesDeepHang : 0;

  // Create aggregate data
  console.log("=== FINAL CALCULATION ===");
  console.log(`Total Matches: ${numMatches}`);
  console.log(`Times Broke: ${timesBroke}`);
  console.log(`Total Break Score: ${totalBreakScore.toFixed(4)}`);
  console.log(`Weighted Broke Percentage: ${(totalBreakScore/numMatches).toFixed(4)}`);
  console.log("========================");

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
      totalData.auto.droppedInL1 * 3 +
      totalData.auto.leave * 3 +
      totalData.auto.processor * 6 +
      totalData.auto.barge * 4, 
    teleopPPG:
      totalData.teleop.l4Scored * 5 +
      totalData.teleop.l3Scored * 4 +
      totalData.teleop.l2Scored * 3 +
      totalData.teleop.l1Scored * 2 +
      totalData.teleop.l4DroppedInL1 * 2 +
      totalData.teleop.l3DroppedInL1 * 2 +
      totalData.teleop.l2DroppedInL1 * 2 +
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
          (totalData.auto.l4 + totalData.auto.droppedCoral),
          
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
    weightedBrokePercentage: numMatches === 0 ? 0 : totalBreakScore / numMatches,
    avgFouls: numMatches === 0 ? 0 : totalFouls / numMatches,
    coralAverageScoringTime: totalData.teleop.coralAverageScoringTime,
    processorAverageScoringTime: totalData.teleop.processorAverageScoringTime,
    bargeAverageScoringTime: totalData.teleop.bargeAverageScoringTime,
    shallowAverageHangTime: totalData.teleop.shallowAverageHangTime,
    deepAverageHangTime: totalData.teleop.deepAverageHangTime,
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

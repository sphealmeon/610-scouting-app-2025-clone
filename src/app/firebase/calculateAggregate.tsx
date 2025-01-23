import { Data, AggregateData } from "../interfaces";
import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useApi } from "../globalVars";
import { key } from "../globalVars";
import { TeamAggregate } from "./TeamAggregate";

/**
 * calcualtes Aggregate Data for a team
 * @param team the team to calculate Aggregate Data for
 */
export const CalculateAggregate = async ({ team }: { team:number }) => {
  let numMatches: number = 0;
  let timesBroke: number = 0;

  const totalData: Data = {
    start: {
      team: 0,
      match: 0,
      preload: 0,
      position: "",
      scoutName: "",
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
      processor: 0,
      barge: 0,
    },
    teleop: {
      floorPickup: 0,
      sourcePickup: 0,
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
      general: "",
      reason: "",
      explanation: "",
    },
  };
  

  //Converts it to an AggregateData object
  const aggregateData: AggregateData = {
    matchAggregateData: totalData,
    team: team,
    matchesPlayed: numMatches,
    autoPPG:
      totalData.auto.l4 * 7 +
      totalData.auto.l3 * 6 +
      totalData.auto.l2 * 4 +
      totalData.auto.l1 * 3,
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

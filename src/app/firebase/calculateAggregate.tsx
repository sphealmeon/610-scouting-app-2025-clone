import { Data, AggregateData } from "../interfaces";
import { ScoutingData } from "../data"
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
      team: ScoutingData.start.team,
      match: ScoutingData.start.match,
      preload: ScoutingData.start.preload,
      position: ScoutingData.start.position,
      scoutName: ScoutingData.start.scoutName,
    },
    auto: {
      leave: ScoutingData.auto.leave,
      droppedCoral: ScoutingData.auto.droppedCoral,
      droppedAlgae: ScoutingData.auto.droppedAlgae,
      l4: ScoutingData.auto.l4,
      l3: ScoutingData.auto.l3,
      l2: ScoutingData.auto.l2,
      l1: ScoutingData.auto.l1,
      processor: ScoutingData.auto.processor,
      barge: ScoutingData.auto.barge,
    },
    teleop: {
      floorPickup: ScoutingData.teleop.floorPickup,
      sourcePickup: ScoutingData.teleop.sourcePickup,
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
  

  //Converts it to an AggregateData object
  const aggregateData: AggregateData = {
    matchAggregateData: totalData,
    team: team,
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
      totalData.auto.l1 +
      totalData.auto.l2 +
      totalData.auto.l3 +
      totalData.auto.l4,
    algaeCyclesScored:
      totalData.teleop.bargeScored +
      totalData.teleop.processorScored +
      totalData.auto.barge +
      totalData.auto.processor,

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
    { merge: true }
  );
};

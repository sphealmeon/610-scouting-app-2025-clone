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
      totalData.auto.l1 * 3 +
      totalData.auto.leave * 2
      ,
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
      totalData.teleop.l1Scored,
    algaeCyclesScored:
      totalData.teleop.pickupAlgae +
      totalData.teleop.processorScored,

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
      totalData.teleop.deep * 10 +
      totalData.teleop.shallow * 6 +
      totalData.teleop.park * 2,
    brokePercentage: 
      numMatches == 0 ? 0 : timesBroke / numMatches,
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

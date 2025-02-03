import { Data } from "@/app/interfaces";

export const ScoutingData: Data = {
    start: {
        preload: 0,
        team: 0,
        match: 0,
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

export const resetData = () => {
    ScoutingData.start.preload = 0;
    ScoutingData.start.team = 0;
    ScoutingData.start.match = 0;
    ScoutingData.start.position = "";
    ScoutingData.start.scoutName = "";

    ScoutingData.auto.leave = 0;
    ScoutingData.auto.coral = 0;
    ScoutingData.auto.algae = 0;
    ScoutingData.auto.droppedCoral = 0;
    ScoutingData.auto.droppedAlgae = 0;
    ScoutingData.auto.l4 = 0;
    ScoutingData.auto.l3 = 0;
    ScoutingData.auto.l2 = 0;
    ScoutingData.auto.l1 = 0;
    ScoutingData.auto.processor = 0;
    ScoutingData.auto.barge = 0;

    ScoutingData.teleop.floorPickup = 0;
    ScoutingData.teleop.sourcePickup = 0;
    ScoutingData.teleop.l4Scored = 0;
    ScoutingData.teleop.l3Scored = 0;
    ScoutingData.teleop.l2Scored = 0;
    ScoutingData.teleop.l1Scored = 0;
    ScoutingData.teleop.l4Dropped = 0;
    ScoutingData.teleop.l3Dropped = 0;
    ScoutingData.teleop.l2Dropped = 0;
    ScoutingData.teleop.l1Dropped = 0;
    ScoutingData.teleop.processorScored = 0;
    ScoutingData.teleop.processorDropped = 0;
    ScoutingData.teleop.bargeScored = 0;
    ScoutingData.teleop.bargeDropped = 0;
    ScoutingData.teleop.algaeRemoved = 0;
    ScoutingData.teleop.isCoop = 0;
    ScoutingData.teleop.park = 0;
    ScoutingData.teleop.shallow = 0;
    ScoutingData.teleop.deep = 0;
    ScoutingData.teleop.missedShallow = 0;
    ScoutingData.teleop.missedDeep = 0;
    ScoutingData.teleop.general = "";
    ScoutingData.teleop.reason = "";
    ScoutingData.teleop.explanation = "";
};



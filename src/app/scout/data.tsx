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
        l4A: 0,
        l4B: 0,
        l4C: 0,
        l4D: 0,
        l4E: 0,
        l4F: 0,
        l4G: 0,
        l4H: 0,
        l4I: 0,
        l4J: 0,
        l4K: 0,
        l4L: 0,
        l3A: 0,
        l3B: 0,
        l3C: 0,
        l3D: 0,
        l3E: 0,
        l3F: 0,
        l3G: 0,
        l3H: 0,
        l3I: 0,
        l3J: 0,
        l3K: 0,
        l3L: 0,
        l2A: 0,
        l2B: 0,
        l2C: 0,
        l2D: 0,
        l2E: 0,
        l2F: 0,
        l2G: 0,
        l2H: 0,
        l2I: 0,
        l2J: 0,
        l2K: 0,
        l2L: 0,
        l1A: 0,
        l1B: 0,
        l1C: 0,
        l1D: 0,
        l1E: 0,
        l1F: 0,
        processor: 0,
        barge: 0,
    },
    teleop: {
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
        general: "",
        reason: "",
        explanation: "",
    },
    humanPlayer: {
        blueScored: 0,
        redScored: 0,
        blueMissed: 0,
        redMissed: 0,
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
    ScoutingData.auto.l4A = 0;
    ScoutingData.auto.l4B = 0;
    ScoutingData.auto.l4C = 0;
    ScoutingData.auto.l4D = 0;
    ScoutingData.auto.l4E = 0;
    ScoutingData.auto.l4F = 0;
    ScoutingData.auto.l4G = 0;
    ScoutingData.auto.l4H = 0;
    ScoutingData.auto.l4I = 0;
    ScoutingData.auto.l4J = 0;
    ScoutingData.auto.l4K = 0;
    ScoutingData.auto.l4L = 0;
    ScoutingData.auto.l3A = 0;
    ScoutingData.auto.l3B = 0;
    ScoutingData.auto.l3C = 0;
    ScoutingData.auto.l3D = 0;
    ScoutingData.auto.l3E = 0;
    ScoutingData.auto.l3F = 0;
    ScoutingData.auto.l3G = 0;
    ScoutingData.auto.l3H = 0;
    ScoutingData.auto.l3I = 0;
    ScoutingData.auto.l3J = 0;
    ScoutingData.auto.l3K = 0;
    ScoutingData.auto.l3L = 0;
    ScoutingData.auto.l2A = 0;
    ScoutingData.auto.l2B = 0;
    ScoutingData.auto.l2C = 0;
    ScoutingData.auto.l2D = 0;
    ScoutingData.auto.l2E = 0;
    ScoutingData.auto.l2F = 0;
    ScoutingData.auto.l2G = 0;
    ScoutingData.auto.l2H = 0;
    ScoutingData.auto.l2I = 0;
    ScoutingData.auto.l2J = 0;
    ScoutingData.auto.l2K = 0;
    ScoutingData.auto.l2L = 0;
    ScoutingData.auto.l1A = 0;
    ScoutingData.auto.l1B = 0;
    ScoutingData.auto.l1C = 0;
    ScoutingData.auto.l1D = 0;
    ScoutingData.auto.l1E = 0;
    ScoutingData.auto.l1F = 0;
    ScoutingData.auto.processor = 0;
    ScoutingData.auto.barge = 0;

    ScoutingData.teleop.coralPickup = 0;
    ScoutingData.teleop.coralPickupFromStation = 0;
    ScoutingData.teleop.pickupAlgae = 0;
    ScoutingData.teleop.pickupAlgaeFromReef = 0;
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

    ScoutingData.humanPlayer.blueScored = 0;
    ScoutingData.humanPlayer.redScored = 0;
    ScoutingData.humanPlayer.blueMissed = 0;
    ScoutingData.humanPlayer.redMissed = 0;
};



import { Data, CoralSlots, ExtendedCoralSlots, AlgaeSlots } from "@/app/interfaces";

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
        L1: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 },
        L2: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0 },
        L3: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0 },
        L4: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0 },
        algaeSlots: {
            'L2-L3': { A: 0, E: 0, I: 0 },
            'L3-L4': { A: 0, E: 0, I: 0 }
        }
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
        missedshallow: 0,
        misseddeep: 0,
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
    ScoutingData.auto.processor = 0;
    ScoutingData.auto.barge = 0;

    // Reset coral slots
    (Object.keys(ScoutingData.auto.L1) as Array<keyof CoralSlots>).forEach(key => ScoutingData.auto.L1[key] = 0);
    (Object.keys(ScoutingData.auto.L2) as Array<keyof ExtendedCoralSlots>).forEach(key => ScoutingData.auto.L2[key] = 0);
    (Object.keys(ScoutingData.auto.L3) as Array<keyof ExtendedCoralSlots>).forEach(key => ScoutingData.auto.L3[key] = 0);
    (Object.keys(ScoutingData.auto.L4) as Array<keyof ExtendedCoralSlots>).forEach(key => ScoutingData.auto.L4[key] = 0);

    // Reset algae slots
    (Object.keys(ScoutingData.auto.algaeSlots['L2-L3']) as Array<keyof AlgaeSlots>).forEach(key => ScoutingData.auto.algaeSlots['L2-L3'][key] = 0);
    (Object.keys(ScoutingData.auto.algaeSlots['L3-L4']) as Array<keyof AlgaeSlots>).forEach(key => ScoutingData.auto.algaeSlots['L3-L4'][key] = 0);

    ScoutingData.teleop.floorPickup = 0;
    ScoutingData.teleop.sourcePickup = 0;
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
    ScoutingData.teleop.missedshallow = 0;
    ScoutingData.teleop.misseddeep = 0;
    ScoutingData.teleop.general = "";
    ScoutingData.teleop.reason = "";
    ScoutingData.teleop.explanation = "";

    ScoutingData.humanPlayer.blueScored = 0;
    ScoutingData.humanPlayer.redScored = 0;
    ScoutingData.humanPlayer.blueMissed = 0;
    ScoutingData.humanPlayer.redMissed = 0;
};
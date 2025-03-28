// import { Data, HumanPlayerData } from "@/app/interfaces";
import { Data } from "@/app/interfaces";


export const ScoutingData: Data = {
    start: {
        preload: 0,
        team: 0,
        match: 0,
        position: "",
        scoutName: "",
        alliance: "",
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
        l3Dropped: 0,
        l2Dropped: 0,
        l1Dropped: 0,
        l4DroppedInL1: 0,
        l3DroppedInL1: 0,
        l2DroppedInL1: 0,
        processorScored: 0,
        processorDropped: 0,
        bargeScored: 0,
        bargeDropped: 0,
        algaeRemoved: 0,
        isCoop: 0,
        park: 0,
        shallow: 0,
        deep: 0,
        fouls: 0,
        missedShallow: 0,
        missedDeep: 0,
        playedDefense: 0,
        general: "",
        reason: "",
        explanation: "",
        breakSeverity: 0,
        breakDuration: 0,

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

// export const HPData: HumanPlayerData = {
//     red: {
//         team: 0,
//         match: 0,
//         redScored: 0,
//         redMissed: 0,
//     },
//     blue: {
//         team: 0,
//         match: 0,
//         blueScored: 0,
//         blueMissed: 0,
//     }
// };

export const resetData = () => {
    ScoutingData.start.preload = 0;
    ScoutingData.start.team = 0;
    ScoutingData.start.match = 0;
    ScoutingData.start.position = "";
    ScoutingData.start.scoutName = "";
    ScoutingData.start.alliance = "";

    ScoutingData.auto.leave = 0;
    ScoutingData.auto.coral = 0;
    ScoutingData.auto.algae = 0;
    ScoutingData.auto.droppedCoral = 0;
    ScoutingData.auto.droppedAlgae = 0;
    ScoutingData.auto.l4 = 0;
    ScoutingData.auto.l3 = 0;
    ScoutingData.auto.l2 = 0;
    ScoutingData.auto.l1 = 0;
    ScoutingData.auto.droppedInL1 = 0;
    ScoutingData.auto.l4A = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4B = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4C = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4D = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4E = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4F = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4G = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4H = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4I = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4J = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4K = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l4L = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3A = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3B = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3C = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3D = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3E = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3F = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3G = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3H = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3I = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3J = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3K = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l3L = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2A = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2B = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2C = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2D = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2E = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2F = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2G = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2H = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2I = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2J = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2K = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l2L = { made: 0, dropped: 0, droppedInL1: 0 };
    ScoutingData.auto.l1A = { made: 0, dropped: 0 };
    ScoutingData.auto.l1B = { made: 0, dropped: 0 };
    ScoutingData.auto.l1C = { made: 0, dropped: 0 };
    ScoutingData.auto.l1D = { made: 0, dropped: 0 };
    ScoutingData.auto.l1E = { made: 0, dropped: 0 };
    ScoutingData.auto.l1F = { made: 0, dropped: 0 };
    ScoutingData.auto.algaeA = 0;
    ScoutingData.auto.algaeB = 0;
    ScoutingData.auto.algaeC = 0;
    ScoutingData.auto.algaeD = 0;
    ScoutingData.auto.algaeE = 0;
    ScoutingData.auto.algaeF = 0;
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
    ScoutingData.teleop.l4DroppedInL1 = 0;
    ScoutingData.teleop.l3DroppedInL1 = 0;
    ScoutingData.teleop.l2DroppedInL1 = 0;
    ScoutingData.teleop.processorScored = 0;
    ScoutingData.teleop.processorDropped = 0;
    ScoutingData.teleop.bargeScored = 0;
    ScoutingData.teleop.bargeDropped = 0;
    ScoutingData.teleop.algaeRemoved = 0;
    ScoutingData.teleop.isCoop = 0;
    ScoutingData.teleop.park = 0;
    ScoutingData.teleop.shallow = 0;
    ScoutingData.teleop.deep = 0;
    ScoutingData.teleop.fouls = 0;
    ScoutingData.teleop.missedShallow = 0;
    ScoutingData.teleop.missedDeep = 0;
    ScoutingData.teleop.playedDefense = 0;
    ScoutingData.teleop.general = "";
    ScoutingData.teleop.reason = "";
    ScoutingData.teleop.explanation = "";
    ScoutingData.teleop.breakSeverity = 0;
    ScoutingData.teleop.breakDuration = 0;

    ScoutingData.teleop.coralAverageScoringTime = 0;
    ScoutingData.teleop.processorAverageScoringTime = 0;
    ScoutingData.teleop.bargeAverageScoringTime = 0;
    ScoutingData.teleop.shallowAverageHangTime = 0;
    ScoutingData.teleop.deepAverageHangTime = 0;

    ScoutingData.teleop.coralCyclesForTimer = 0;
    ScoutingData.teleop.processorCyclesForTimer = 0;
    ScoutingData.teleop.bargeCyclesForTimer = 0;

    // HPData.red.team = 0;
    // HPData.red.match = 0;
    // HPData.red.redScored = 0;
    // HPData.red.redMissed = 0;
    // HPData.blue.team = 0;
    // HPData.blue.match = 0;
    // HPData.blue.blueScored = 0;
    // HPData.blue.blueMissed = 0;
};



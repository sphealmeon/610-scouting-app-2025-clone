export interface Data{
    [x: string]: any;   
    start: {
        preload: number;
        team: number;
        match: number;
        position: string;
        scoutName: string;
    };
    auto: {
        leave: number;
        coral: number;
        algae: number;
        droppedCoral: number;
        droppedAlgae: number;
        l4: number;
        l3: number;
        l2: number;
        l1: number;
        l4A: number;
        l4B: number;
        l4C: number;
        l4D: number;
        l4E: number;
        l4F: number;
        l4G: number;
        l4H: number;
        l4I: number;
        l4J: number;
        l4K: number;
        l4L: number;
        l3A: number;
        l3B: number;
        l3C: number;
        l3D: number;
        l3E: number;
        l3F: number;
        l3G: number;
        l3H: number;
        l3I: number;
        l3J: number;
        l3K: number;
        l3L: number;
        l2A: number;
        l2B: number;
        l2C: number;
        l2D: number;
        l2E: number;
        l2F: number;
        l2G: number;
        l2H: number;
        l2I: number;
        l2J: number;
        l2K: number;
        l2L: number;
        l1A: number;
        l1B: number;
        l1C: number;
        l1D: number;
        l1E: number;
        l1F: number;
        algaeA: number;
        algaeB: number;
        algaeC: number;
        algaeD: number;
        algaeE: number;
        algaeF: number;
        
        processor: number;
        barge: number;
    };
    teleop: {
        coralPickup: number;
        coralPickupFromStation: number;
        pickupAlgae: number;
        pickupAlgaeFromReef: number;
        l4Scored: number;
        l3Scored: number;
        l2Scored: number;
        l1Scored: number;
        l4Dropped: number;
        l3Dropped: number;
        l2Dropped: number;
        l1Dropped: number;
        processorScored: number;
        processorDropped: number;
        bargeScored: number;
        bargeDropped: number;
        algaeRemoved: number;
        isCoop: number;
        park: number;
        shallow: number;
        deep: number;
        missedShallow: number;
        missedDeep: number;
        general: string;
        reason: string;
        explanation: string;
    };
}

interface TeleopData {
    floorPickup: number;
    sourcePickup: number;
    pickupAlgae: number;
    pickupAlgaeFromReef: number;
    pickupCoral: number;
    pickupCoralFromStation: number;
    l4Scored: number;
    l3Scored: number;
    l2Scored: number;
    l1Scored: number;
    l4Dropped: number;
    l3Dropped: number;
    l2Dropped: number;
    l1Dropped: number;
    processorScored: number;
    processorDropped: number;
    bargeScored: number;
    bargeDropped: number;
    algaeRemoved: number;
    isCoop: number;
    park: number;
    shallow: number;
    deep: number;
    missedshallow: number;
    misseddeep: number;
    general: string;
    reason: string;
    explanation: string;
}

interface HumanPlayerData {
    blueScored: number;
    redScored: number;
    blueMissed: number;
    redMissed: number;
}

export interface AggregateData {
    team: number;
    standing: number;
    matchAggregateData: Data;
    matchesPlayed: number;
    autoPPG: number;
    teleopPPG: number;
    coralCyclesScored: number;
    algaeCyclesScored: number;
    teleopL1Accuracy: number;
    teleopL2Accuracy: number;
    teleopL3Accuracy: number;
    teleopL4Accuracy: number;
    teleopBargeAccuracy: number;
    teleopProcessorAccuracy: number;
    shallowAccuracy: number;
    deepAccuracy: number;
    endgamePPG: number;
    brokePercentage: number;
}


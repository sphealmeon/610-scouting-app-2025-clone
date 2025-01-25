export interface Data {
    start: StartData;
    auto: AutoData;
    teleop: TeleopData;
    humanPlayer: HumanPlayerData;
}

interface StartData {
    preload: number;
    team: number;
    match: number;
    position: string;
    scoutName: string;
}

export interface CoralSlots {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
}

export interface ExtendedCoralSlots extends CoralSlots {
    G: number;
    H: number;
    I: number;
    J: number;
    K: number;
    L: number;
}

export interface AlgaeSlots {
    A: number;
    E: number;
    I: number;
}

interface AutoData {
    leave: number;
    coral: number;
    algae: number;
    droppedCoral: number;
    droppedAlgae: number;
    l4: number;
    l3: number;
    l2: number;
    l1: number;
    processor: number;
    barge: number;
    L1: CoralSlots;
    L2: ExtendedCoralSlots;
    L3: ExtendedCoralSlots;
    L4: ExtendedCoralSlots;
    algaeSlots: {
        'L2-L3': AlgaeSlots;
        'L3-L4': AlgaeSlots;
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
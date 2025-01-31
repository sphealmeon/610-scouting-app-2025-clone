export interface Data{
    start: {
        preload: number;
        team: number;
        match: number;
        position: string;
        scoutName: string;
    };
    auto: {
        leave: number;
        droppedCoral: number;
        droppedAlgae: number;
        l4: number;
        l3: number;
        l2: number;
        l1: number;
        processor: number;
        barge: number;
    };
    teleop: {
        floorPickup: number;
        sourcePickup: number;
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
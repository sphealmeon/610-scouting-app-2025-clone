export interface Data{
    start: {
        preload: number;
        team: number;
        match: number;
        position: string;
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
        processor: number;
        barge: number;
    };
    teleop: {
        floorPickup: number;
        sourcePickup: number;
        l4Scored: number;
        l3Scored: number;
        l2Scored: number;
        l1scored: number;
        l4Dropped: number;
        l3Dropped: number;
        l2Dropped: number;
        l1Dropped: number;
        processorScored: number;
        processorDropped: number;
        bargeScored: number;
        bargeDropped: number;
        algaeRemoved: number;
        pickupLocation: string;
        isCoop: number;
        park: number;
        shallow: number;
        deep: number;
        missedClimb: number;
        general: string;
        reason: string;
        explaination: string;
    };
}

export interface AggregateData {
    team: number;
    matchAggregateData: Data;
    matchesPlayed: number;
    autoPPG: number;
    autoCoralAccuracy: number;
    autoAlgaeAccuracy: number;
    climbAccuracy: number;
    teleopCyclesScored: number;
    teleopAccuracy: number;
    teleopTotalCycles: number;
    endgamePPG: number;
    brokePercentage: number;
}
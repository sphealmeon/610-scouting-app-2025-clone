export interface Data{
    [x: string]: any;   
    start: {
        preload: number;
        team: number;
        match: number;
        position: string;
        scoutName: string;
        alliance: string;
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
        l4A: {
            made: number;
            dropped: number;
        };
        l4B: {
            made: number;
            dropped: number;
        };
        l4C: {
            made: number;
            dropped: number;
        };
        l4D: {
            made: number;
            dropped: number;
        };
        l4E: {
            made: number;
            dropped: number;
        };
        l4F: {
            made: number;
            dropped: number;
        };
        l4G: {
            made: number;   
            dropped: number;
        };
        l4H: {
            made: number;
            dropped: number;
        };
        l4I: {
            made: number;
            dropped: number;
        };
        l4J: {
            made: number;
            dropped: number;
        };
        l4K: {
            made: number;
            dropped: number;
        };
        l4L: {
            made: number;
            dropped: number;
        };
        l3A: {
            made: number;
            dropped: number;
        };
        l3B: {
            made: number;
            dropped: number;
        };
        l3C: {
            made: number;
            dropped: number;
        };
        l3D: {
            made: number;
            dropped: number;
        };
        l3E: {
            made: number;
            dropped: number;
        };
        l3F: {
            made: number;
            dropped: number;
        };
        l3G: {
            made: number;
            dropped: number;
        };
        l3H: {
            made: number;
            dropped: number;
        };
        l3I: {
            made: number;
            dropped: number;
        };
        l3J: {
            made: number;
            dropped: number;
        };
        l3K: {
            made: number;
            dropped: number;
        };
        l3L: {
            made: number;
            dropped: number;
        };
        l2A: {
            made: number;
            dropped: number;
        };
        l2B: {
            made: number;
            dropped: number;
        };  
        l2C: {
            made: number;
            dropped: number;
        };
        l2D: {
            made: number;
            dropped: number;
        };
        l2E: {
            made: number;
            dropped: number;
        };
        l2F: {
            made: number;
            dropped: number;
        };
        l2G: {
            made: number;
            dropped: number;
        };
        l2H: {
            made: number;
            dropped: number;
        };
        l2I: {
            made: number;
            dropped: number;
        };
        l2J: {
            made: number;
            dropped: number;
        };
        l2K: {
            made: number;
            dropped: number;
        };
        l2L: {
            made: number;
            dropped: number;
        };
        l1A: {
            made: number;
            dropped: number;
        };
        l1B: {
            made: number;
            dropped: number;
        };
        l1C: {
            made: number;
            dropped: number;
        };
        l1D: {
            made: number;
            dropped: number;
        };
        l1E: {
            made: number;
            dropped: number;
        };
        l1F: {
            made: number;
            dropped: number;
        };
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
        droppedOnField: any;
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

/*export interface HumanPlayerData {
    red: {
        team: number;
        match: number;
        redScored: number;
        redMissed: number;
    };
    blue: {
        team: number;
        match: number;
        blueScored: number;
        blueMissed: number;
    }
}*/

export interface HumanPlayerStats {
    team: number;
    matchesPlayed: number;
    totalScored: number;
    totalMissed: number;
    fieldGoalPercentage: number;
    pointsPerGame: number;
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
    autoL1Accuracy: number;
    autoL2Accuracy: number;
    autoL3Accuracy: number;
    autoL4Accuracy: number;
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


export interface Picklist {
    id?: string;
    name: string;
    teams: string[];
    createdAt: number;
} 
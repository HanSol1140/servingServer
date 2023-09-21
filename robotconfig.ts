// robotconfig.ts

// robotSettings
type PointCoordinateType = {
    x?: string,
    y?: string,
    theta?: string,
}
export let robotSettings: {
    [key: string]: {
        robotNumber:string,
        robotIP:string,
        robotRunningState:boolean,
        robotLastOrderPoint:PointCoordinateType
    }
} = {};

export function setRobotSettings(name: string, robotNumber:string, robotIP:string, robotRunningState:boolean, robotLastOrderPoint:PointCoordinateType) {
    robotSettings[name] = { robotNumber, robotIP, robotRunningState, robotLastOrderPoint };
}

// pointCoordinate
export let pointCoordinate: {
    [key: string]: {
        x: string,
        y: string,
        theta: string
    }
} = {};

export function setPointCoordinate(pointName: string, x: string, y: string, theta: string) {
    pointCoordinate[pointName] = { x, y, theta };
}

// robotIP
export let robotCoordinate:{
    [key: number]: {
        x:number,
        y:number,
        theta:number
    }
} = {};

export function setRobotCoordinate(robotNumber: number, x: number, y: number, theta: number) {
    robotCoordinate[robotNumber] = { x, y, theta };    
}


// laserCoordinate
export let laserCoordinate: {
    [key: number]: {};
} = {};

export function setLaserCoordinate(robotNumber: number , centerPortion:[]) {
    laserCoordinate[robotNumber] = centerPortion;    
}
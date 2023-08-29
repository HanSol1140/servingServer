// robotconfig.ts

// robotSettings
export interface PointCoordinate {
    x?: string;
    y?: string;
    theta?: string;
}
export let robotSettings: { [key: string]: {robotNumber:string, robotIP:string, robotRunningState:boolean, robotLastOrderPoint:PointCoordinate} } = {};

export function setRobotSettings(name: string, robotNumber:string, robotIP:string, robotRunningState:boolean, robotLastOrderPoint:PointCoordinate) {
    robotSettings[name] = { robotNumber, robotIP, robotRunningState, robotLastOrderPoint };
}
// pointCoordinate
export let pointCoordinate: { [key: string]: { x: string, y: string, theta: string } } = {};

export function setPointCoordinate(pointName: string, x: string, y: string, theta: string) {
    pointCoordinate[pointName] = { x, y, theta };
}
// robotconfig.ts
export let robotSettings: { [key: string]: {robotNumber:string, robotIP:string, robotLastOrderPoint:string} } = {};

export function setRobotSettings(name: string, robotNumber:string, robotIP:string, robotLastOrderPoint:string) {
    robotSettings[name] = { robotNumber, robotIP, robotLastOrderPoint };
}


export let pointCoordinate: { [key: string]: { x: string, y: string, theta: string } } = {};

export function setPointCoordinate(pointName: string, x: string, y: string, theta: string) {
    pointCoordinate[pointName] = { x, y, theta };
}
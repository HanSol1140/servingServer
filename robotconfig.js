"use strict";
// robotconfig.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPointCoordinate = exports.pointCoordinate = exports.setRobotSettings = exports.robotSettings = void 0;
exports.robotSettings = {};
function setRobotSettings(name, robotNumber, robotIP, robotRunningState, robotLastOrderPoint) {
    exports.robotSettings[name] = { robotNumber, robotIP, robotRunningState, robotLastOrderPoint };
}
exports.setRobotSettings = setRobotSettings;
// pointCoordinate
exports.pointCoordinate = {};
function setPointCoordinate(pointName, x, y, theta) {
    exports.pointCoordinate[pointName] = { x, y, theta };
}
exports.setPointCoordinate = setPointCoordinate;

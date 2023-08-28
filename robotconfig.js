"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPointCoordinate = exports.pointCoordinate = exports.setRobotSettings = exports.robotSettings = void 0;
// robotconfig.ts
exports.robotSettings = {};
function setRobotSettings(name, robotNumber, robotIP, robotLastOrderPoint) {
    exports.robotSettings[name] = { robotNumber, robotIP, robotLastOrderPoint };
}
exports.setRobotSettings = setRobotSettings;
exports.pointCoordinate = {};
function setPointCoordinate(pointName, x, y, theta) {
    exports.pointCoordinate[pointName] = { x, y, theta };
}
exports.setPointCoordinate = setPointCoordinate;

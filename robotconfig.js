"use strict";
// robotconfig.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLaserCoordinate = exports.laserCoordinate = exports.setRobotCoordinate = exports.robotCoordinate = exports.setPointCoordinate = exports.pointCoordinate = exports.setRobotSettings = exports.robotSettings = void 0;
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
// robotIP
exports.robotCoordinate = {};
function setRobotCoordinate(robotNumber, x, y, theta) {
    exports.robotCoordinate[robotNumber] = { x, y, theta };
}
exports.setRobotCoordinate = setRobotCoordinate;
// laserCoordinate
exports.laserCoordinate = {};
function setLaserCoordinate(robotNumber, centerPortion) {
    exports.laserCoordinate[robotNumber] = centerPortion;
}
exports.setLaserCoordinate = setLaserCoordinate;

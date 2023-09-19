"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRobotList = exports.deleteRobot = exports.updateRobot = exports.createRobot = void 0;
const RobotModel = __importStar(require("../Models/robotModels.js"));
// 로봇 목록 추가
const createRobot = (req, res) => {
    try {
        const robotName = req.body.robotName;
        const robotNumber = req.body.robotNumber;
        const robotIP = req.body.robotIP;
        const result = RobotModel.createRobotData(robotName, robotNumber, robotIP);
        res.send(result);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.createRobot = createRobot;
//로봇 데이터 수정
const updateRobot = (req, res) => {
    try {
        const robotName = req.body.robotName;
        const newRobotName = req.body.newRobotName;
        const newRobotNumber = req.body.newRobotNumber;
        const newRobotIP = req.body.newRobotIP;
        const result = RobotModel.updateRobotData(robotName, newRobotName, newRobotNumber, newRobotIP);
        res.send(result);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.updateRobot = updateRobot;
// 로봇 삭제
const deleteRobot = (req, res) => {
    try {
        const deleteRobotName = req.body.robotName;
        const result = RobotModel.deleteRobotData(deleteRobotName);
        res.send(result);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.deleteRobot = deleteRobot;
const getRobotList = (req, res) => {
    try {
        const result = RobotModel.getRobotListData();
        res.send(result);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.getRobotList = getRobotList;

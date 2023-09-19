"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRobotListData = exports.deleteRobotData = exports.updateRobotData = exports.createRobotData = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = 'Settings/RobotSettings.json';
const createRobotData = (robotName, robotNumber, robotIP) => {
    try {
        // RobotSettings.json이 없다면 생성
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify([]));
        }
        // 파일 읽기
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        const newData = {
            robotName,
            robotNumber,
            robotIP,
            robotRunningState: false,
            robotLastOrderPoint: '',
        };
        const existsName = data.some(item => item.robotName === robotName);
        const existsNumber = data.some(item => item.robotNumber === robotNumber);
        if (existsName) {
            return "로봇명이 중복되었습니다. \n기입한 정보를 확인해주세요.";
        }
        if (existsNumber) {
            return "로봇번호가 중복되었습니다. \n기입한 정보를 확인해주세요.";
        }
        data.push(newData);
        data.sort((a, b) => a.robotName.localeCompare(b.robotName));
        const jsonData = JSON.stringify(data, null, 2);
        fs_1.default.writeFileSync(filePath, jsonData);
        return "로봇 데이터 저장완료";
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
exports.createRobotData = createRobotData;
const updateRobotData = (robotName, newRobotName, newRobotNumber, newRobotIP) => {
    try {
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify([]));
        }
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        let targetRobot = data.find(item => item.robotName === robotName);
        if (!targetRobot) {
            throw new Error("Robot not found");
        }
        let otherRobots = data.filter(item => item.robotName !== robotName);
        const existsName = otherRobots.some(robot => robot.robotName === newRobotName);
        const existsNumber = otherRobots.some(robot => robot.robotNumber === newRobotNumber);
        if (existsName) {
            return "로봇명이 중복되었습니다. \n기입한 정보를 확인해주세요.";
        }
        if (existsNumber) {
            return "로봇번호가 중복되었습니다. \n기입한 정보를 확인해주세요.";
        }
        targetRobot.robotName = newRobotName;
        targetRobot.robotNumber = newRobotNumber;
        targetRobot.robotIP = newRobotIP;
        targetRobot.robotRunningState = false;
        targetRobot.robotLastOrderPoint = '';
        data.sort((a, b) => a.robotName.localeCompare(b.robotName));
        const jsonData = JSON.stringify(data, null, 2);
        fs_1.default.writeFileSync(filePath, jsonData);
        return "수정 완료";
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
exports.updateRobotData = updateRobotData;
const deleteRobotData = (robotName) => {
    try {
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify([]));
        }
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        const newData = data.filter(item => item.robotName !== robotName);
        const jsonData = JSON.stringify(newData, null, 2);
        fs_1.default.writeFileSync(filePath, jsonData);
        return "수정 완료";
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
exports.deleteRobotData = deleteRobotData;
const getRobotListData = () => {
    try {
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
exports.getRobotListData = getRobotListData;

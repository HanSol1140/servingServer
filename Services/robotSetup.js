"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverSetup = exports.setupPoints = exports.setupRobots = void 0;
const fs_1 = __importDefault(require("fs"));
const robotconfig_1 = require("../robotconfig");
// 서버 실행시 로봇리스트 받아오기
function setupRobots() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync('Settings/RobotSettings.json')) {
            console.error("File not found");
            return;
        }
        try {
            const fileData = fs_1.default.readFileSync('Settings/RobotSettings.json', 'utf8');
            let data = fileData ? JSON.parse(fileData) : [];
            return data;
        }
        catch (error) {
            console.error('Error reading file:', error);
            return [];
        }
    });
}
exports.setupRobots = setupRobots;
// 서버 실행시 포인트리스트 받아오기
function setupPoints() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync('Settings/PointSettings.json')) {
            console.error("File not found");
            return;
        }
        try {
            const fileData = fs_1.default.readFileSync('Settings/PointSettings.json', 'utf8');
            let data = fileData ? JSON.parse(fileData) : [];
            return data;
        }
        catch (error) {
            console.error('Error reading file:', error);
            return [];
        }
    });
}
exports.setupPoints = setupPoints;
// 서버 실행시 로봇 / 포인트 설정
function serverSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        // 로봇 설정
        const robots = yield setupRobots();
        console.log(robots);
        robots.forEach(robot => {
            (0, robotconfig_1.setRobotSettings)(robot.robotName, robot.robotNumber, robot.robotIP, robot.robotRunningState, robot.robotLastOrderPoint);
        });
        // 포인트 좌표 설정
        const points = yield setupPoints();
        // console.log(points);
        points.forEach(point => {
            (0, robotconfig_1.setPointCoordinate)(point.pointName, point.coordinatesX, point.coordinatesY, point.coordinatesTheta);
        });
    });
}
exports.serverSetup = serverSetup;

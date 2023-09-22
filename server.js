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
exports.setSpeed = void 0;
// server.ts
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
const axios_1 = __importDefault(require("axios"));
const PORT = process.env.PORT || 8084;
// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});
//MQTT
// import { initializeMQTT } from './mqtthandler';
const mqttHandler_1 = require("./Services/mqttHandler");
const mqttClient = (0, mqttHandler_1.initializeMQTT)();
// 라우터
const robotrouters_js_1 = __importDefault(require("./Routers/robotrouters.js"));
const pointrouters_1 = __importDefault(require("./Routers/pointrouters"));
app.use('/', robotrouters_js_1.default);
app.use('/', pointrouters_1.default);
const robotconfig_1 = require("./robotconfig");
const RobotSetup = __importStar(require("./Services/robotSetup.js"));
const Func = __importStar(require("./Services/robotCommands.js"));
// 로봇명 전역변수 설정
// serverSetup();
RobotSetup.serverSetup();
// 각 로봇의 좌표 계속 전송
// 각 로봇 레이저 좌표 계속 전송
function setSpeed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 좌표 받기
            const response = yield axios_1.default.post(`http://192.168.0.177/cmd/max_speed`, {
                speed: 0.5
            });
            if (response.status === 200) {
                // console.log(response.data); // theta 는 radian이라서 변환이 필요함
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.setSpeed = setSpeed;
setSpeed();
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    // 좌표와 레이저 정보 받기
    for (var i in robotconfig_1.robotSettings) {
        yield Func.getPose(i);
        yield Func.getLaser(i);
        console.log(robotconfig_1.robotSettings[i].robotIP);
        // console.log(robotCoordinate[robotSettings[i].robotNumber]);
    }
    // 장애물 감지 
    for (var i in robotconfig_1.robotSettings) {
        for (const coordinate of robotconfig_1.laserCoordinate[robotconfig_1.robotSettings[i].robotNumber]) {
            const robotTheta = robotconfig_1.robotCoordinate[robotconfig_1.robotSettings[i].robotNumber].theta * (180 / Math.PI);
            const robotX = robotconfig_1.robotCoordinate[robotconfig_1.robotSettings[i].robotNumber].x;
            const robotY = robotconfig_1.robotCoordinate[robotconfig_1.robotSettings[i].robotNumber].y;
            const dx = robotX - coordinate.x;
            const dy = robotY - coordinate.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 장애물과 로봇이 일정거리 이내
            // 레이저 좌표에서 벽을 제외한 통로의 값만 장애물로 감지
            if (distance < 2.5 && coordinate.x > 0.3 && coordinate.x < 3.40 && coordinate.y > -1 && coordinate.y < 8.4) {
                console.log(i + "가 인식한 장애물의 좌표" + coordinate.x + " / " + coordinate.y);
                var direction = yield Func.getDivideDirection(robotTheta, coordinate.x, coordinate.y, robotX, robotY);
                console.log(direction); // 로봇의 기준으로 장애물이 left / right인지 확인
                break;
            }
        }
    }
    const currentDate = new Date();
    console.log(currentDate);
}), 33);
// },100);
// for(var i in robotSettings){
// Func.moveCoordinates("192.168.0.177", "1.92", "7.31", "88");
// Func.moveCoordinates(i, "1.92", "-0.08", "1.5498");
// }
// setTimeout(() => {
// for(var i in robotSettings){
//     console.log(i);
//     console.log(robotSettings[i]);
// }
//원점
//155 - 244도
//157 - 244
// 170 - 227도
// 180 - 222도  
// 170 - 232도
// 244 -> 232 => 12도
//250도 -> 프로그램 153.55
//Theta 계산 // 각도 => Theta
// const degrees = 88.8;
// const radians = (degrees * Math.PI) / 180;
// console.log(radians);
// // Theta => 각도로 재변환
// // Theta * (180 / Math.PI);
// const degreesFromRadians = radians * (180 / Math.PI);
// console.log(degreesFromRadians);
// moverCoordinates('192.168.0.15', 0.0, 0.0, 0);
// moverCoordinates('192.168.0.15', -2.2, -0.65, radians);
// moverCoordinates('192.168.0.15', 6.2, -0.8, radians);
// 027.019.155.8
// movePoint('192.168.0.15', '0');
// moverCoordinates('192.168.0.15', 1.0, 0.3, radians);

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
// server.ts
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// import axios from 'axios';
// import fs from 'fs';
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
const PORT = process.env.PORT || 8084;
// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});
//MQTT
const mqtthandler_1 = require("./mqtthandler");
const mqttClient = (0, mqtthandler_1.initializeMQTT)();
// 라우터
const routerhandler_1 = __importDefault(require("./routerhandler"));
app.use('/', routerhandler_1.default);
// 함수
const func_1 = require("./func");
// 로봇명 전역변수 설정
const robotconfig_1 = require("./robotconfig");
function serverSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        const robots = yield (0, func_1.setupRobots)();
        console.log(robots);
        robots.forEach(robot => {
            robotconfig_1.robotNameIP[robot.robotName] = robot.robotIP;
        });
        console.log(robotconfig_1.robotNameIP["robot1"]);
        console.log(robotconfig_1.robotNameIP["robot2"]);
        console.log(robotconfig_1.robotNameIP["robot3"]);
        console.log(robotconfig_1.robotNameIP["robot4"]);
    });
}
serverSetup();
// cancle();
// movePoint('192.168.0.15', '1');
// setTimeout(() => { 
//     movePoint('192.168.0.15', '6');
// }, 8000);
// movePoit('192.168.0.15', 1);
// charge(3);
// test();
// setInterval(() => {
// getPose('192.168.0.15');
// moverCoordinates('192.168.0.15', 0.17, -0.03, 65,06)
// test('192.168.0.137:8002');
// test('192.168.0.137:8003');
// test('192.168.0.137:8004');
// test('192.168.0.137:8005');
// }, 30);
// setTimeout(() => {
//     movePoint('192.168.0.15', '1');
// },10);
// setTimeout(() => {
//     movePoint('192.168.0.15', '2');
// },7000);
// setTimeout(() => {
//     movePoint('192.168.0.15', '3');
// },14000);
// setTimeout(() => {
//     movePoint('192.168.0.15', '4');
// },21000);
// setInterval(() => {
//     setTimeout(() => {
//         movePoint('192.168.0.15', '1');
//     },10);
//     setTimeout(() => {
//         movePoint('192.168.0.15', '2');
//     },7000);
//     setTimeout(() => {
//         movePoint('192.168.0.15', '3');
//     },14000);
//     setTimeout(() => {
//         movePoint('192.168.0.15', '4');
//     },21000);
// }, 29000);
// setTimeout(() => {
//     movePoint('192.168.0.15', '5');
// },10);
// setTimeout(() => {
//     movePoint('192.168.0.15', '6');
// },15000);
// setInterval(() => {
//     setTimeout(() => {
//         movePoint('192.168.0.15', '5');
//     },10);
//     setTimeout(() => {
//         movePoint('192.168.0.15', '6');
//     },15000);
// }, 30000);
// movePoint('192.168.0.15', '4');
// getcurrentspeed 사용 불가 - 설정 속도가아닌 (이동중상태일때만 api가 작동함, 설정 주행속도 확인불가)
//원점
//155 - 244도
//157 - 244
// 170 - 227도
// 180 - 222도  
// 170 - 232도
// 244 -> 232 => 12도
//250도 -> 프로그램 153.55
//Theta 계산
// const degrees = 178;
// const radians = (degrees * Math.PI) / 180;
// console.log(radians);
// moverCoordinates('192.168.0.15', 0.0, 0.0, 0);
// moverCoordinates('192.168.0.15', -2.2, -0.65, radians);
// moverCoordinates('192.168.0.15', 6.2, -0.8, radians);
// 027.019.155.8
// movePoint('192.168.0.15', '0');
// moverCoordinates('192.168.0.15', 1.0, 0.3, radians);

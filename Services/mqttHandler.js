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
exports.initializeMQTT = void 0;
// mqtthandler.ts
const mqtt_1 = __importDefault(require("mqtt"));
const robotconfig_1 = require("../robotconfig");
const Func = __importStar(require("../Services/robotCommands.js"));
function initializeMQTT() {
    const mqttClient = mqtt_1.default.connect('mqtt://192.168.0.137:1883');
    mqttClient.on('error', function (err) {
        console.log('MQTT Error: ', err);
    });
    mqttClient.on('offline', function () {
        console.log("MQTT client is offline");
    });
    mqttClient.on('reconnect', function () {
        console.log("MQTT client is trying to reconnect");
    });
    mqttClient.on('connect', function () {
        mqttClient.subscribe('servingserver', function (err) {
            if (!err) {
                console.log('Connected to MQTT broker');
            }
        });
    });
    mqttClient.on('message', function (topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // 값 체크용
            console.log(message.toString());
            // mqtt 값에 따른 응답
            const data = JSON.parse(message.toString());
            // cancle => robotAPI가 "cancle" & 서빙봇 이름 => 해당 로봇의 이동을 정지합니다.
            if (data.servingAPI == "cancle" && data.robotName) {
                console.log("cancle request");
                // console.log(robotSettings[data.robotName]); // 서빙봇 정보
                console.log(robotconfig_1.robotSettings[data.robotName].robotIP); // IP
                Func.cancle(data.robotName);
                //
                // var message = {
                //     servingAPI : "cancle",
                //     robotName : "robot1",
                //   };
                // client.publish('servingserver', JSON.stringify(message));
                //
            }
            // movePoint => robotAPI : movePoint & 서빙봇 이름 => 정해진 포인트로 해당 로봇을 이동
            if (data.servingAPI == "movePoint" && data.robotName && data.point) {
                console.log("movePoint request");
                // console.log(robotSettings[data.robotName]); // 서빙봇 정보
                console.log(robotconfig_1.robotSettings[data.robotName]); // IP
                Func.movePoint(data.robotName, data.point);
                //
                // var message = {
                //     servingAPI : "movePoint",
                //     robotName : "robot1",
                //     point : "11",
                //   };
                // client.publish('servingserver', JSON.stringify(message));
                //
            }
            // movePoint => robotAPI : movePoint & 서빙봇 이름 => 정해진 포인트로 해당 로봇을 이동
            if (data.servingAPI == "retryMovePoint" && data.robotName && data.point) {
                console.log("movePoint request");
                // console.log(robotSettings[data.robotName]); // 서빙봇 정보
                console.log(robotconfig_1.robotSettings[data.robotName]); // IP
                Func.retryMovePoint(data.robotName);
                //
                // var message = {
                //     servingAPI : "movePoint",
                //     robotName : "robot1",
                //     point : "11",
                //   };
                // client.publish('servingserver', JSON.stringify(message));
                //
            }
            // moveCoordinates => 좌표 지정 이동 
            if (data.servingAPI == "moveCoordinates" && data.robotName && data.coordinatesX !== undefined && data.coordinatesY !== undefined && data.coordinatesTheta !== undefined) {
                // theta는 radian으로 계산해야함
                // 로봇의 각도 기준이 360도가 아닌 우측방향 -180도 좌측방향 +180도로 설정되어 있음
                // 0도 기준 -10도 => 오른쪽으로 -10도
                // 0도 기준 +10도 => 왼쪽으로 +10도
                const radians = String((data.coordinatesX * Math.PI) / 180);
                console.log(radians);
                console.log("moverCoordinates request");
                console.log(robotconfig_1.robotSettings[data.robotName]); // IP
                Func.moveCoordinates(data.robotName, data.coordinatesX, data.coordinatesY, radians);
                // var message = {
                //     servingAPI : "moverCoordinates",
                //     robotName : "robot1",
                //     coordinatesX : "0.11",
                //     coordinatesY : "1.22",
                //     coordinatesTheta : "20",
                //   };
                // client.publish('servingserver', JSON.stringify(message));
            }
            // charge => 배터리 충전
            if (data.servingAPI == "charge" && data.robotName && data.point) {
                console.log("charge request");
                console.log(robotconfig_1.robotSettings[data.robotName]); // IP
                Func.charge(data.robotName, data.point);
                //
                // var message = {
                //     servingAPI : "charge",
                //     robotName : "robot1",
                //     point : "11",
                //   };
                // client.publish('servingserver', JSON.stringify(message));
                //
            }
        });
    });
    return mqttClient;
}
exports.initializeMQTT = initializeMQTT;

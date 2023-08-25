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
exports.initializeMQTT = void 0;
// mqtthandler.ts
const mqtt_1 = __importDefault(require("mqtt"));
const robotconfig_1 = require("./robotconfig");
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
        mqttClient.subscribe('servingbot_in', function (err) {
            if (!err) {
                console.log('Connected to MQTT broker');
            }
        });
    });
    mqttClient.on('message', function (topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // message is Buffer
            console.log(message.toString());
            const data = JSON.parse(message.toString());
            if (data.robotName) {
                const robotIP = robotconfig_1.robotNameIP[data.robotName];
                if (robotIP) {
                    console.log(robotIP);
                }
            }
        });
    });
    return mqttClient;
}
exports.initializeMQTT = initializeMQTT;

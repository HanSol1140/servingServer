// mqtthandler.ts
import mqtt from 'mqtt';
import axios from 'axios';
import fs from 'fs';
import { robotNameIP } from './robotconfig';

export function initializeMQTT() {
    const mqttClient = mqtt.connect('mqtt://192.168.0.137:1883');
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
    mqttClient.on('message', async function (topic, message) {
        // message is Buffer
        console.log(message.toString());
        const data = JSON.parse(message.toString())

        if (data.robotName) {
            const robotIP = robotNameIP[data.robotName];
            if(robotIP) {
                console.log(robotIP);
            }
        }

    });
    return mqttClient;
}
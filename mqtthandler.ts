// mqtthandler.ts
import mqtt from 'mqtt';
import axios from 'axios';
import fs from 'fs';
import { robotSettings, setRobotSettings, pointCoordinate, setPointCoordinate } from './robotconfig';
import { cancle, movePoint, moverCoordinates, retryMovePoint, charge, checkBattery, getPose, test } from './func';
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
        // 값 체크용
        console.log(message.toString());


        // mqtt 값에 따른 응답
        const data = JSON.parse(message.toString());

        // cancle => robotAPI가 "cancle" & 서빙봇 이름 => 해당 로봇의 이동을 정지합니다.
        if (data.servingAPI == "cancle" && data.robotName) {
            console.log("cancle request");
            // console.log(robotSettings[data.robotName]); // 서빙봇 정보
            console.log(robotSettings[data.robotName].robotIP); // IP
            cancle(data.robotName);
        }


        // movePoint => robotAPI : movePoint & 서빙봇 이름 => 정해진 포인트로 해당 로봇을 이동
        if (data.servingAPI == "movePoint" && data.robotName && data.point) {
            console.log("movePoint request");
            // console.log(robotSettings[data.robotName]); // 서빙봇 정보
            console.log(robotSettings[data.robotName]); // IP
            await movePoint(data.robotName, data.point);
            setTimeout(()=>{
                retryMovePoint("robot1");
            }, 2000);
        }

        
        // moverCoordinates => 좌표 지정 이동 
        if (data.servingAPI == "moverCoordinates" && data.robotName && data.coordinatesX !== undefined && data.coordinatesY !== undefined && data.coordinatesTheta !== undefined) {
            // theta는 radian으로 계산해야함
            // 로봇의 각도 기준이 360도가 아닌 우측방향 -180도 좌측방향 +180도로 설정되어 있음
            // 0도 기준 -10도 => 오른쪽으로 -10도
            // 0도 기준 +10도 => 왼쪽으로 +10도
            const radians = String((data.coordinatesX * Math.PI) / 180);
            console.log(radians);
            console.log("moverCoordinates request");
            // console.log(robotSettings[data.robotName]); // 서빙봇 정보
            console.log(robotSettings[data.robotName]); // IP
            moverCoordinates(data.robotName, data.coordinatesX, data.coordinatesY, radians);
        }

        

    });
    return mqttClient;
}
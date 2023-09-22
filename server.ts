// server.ts
import express from 'express';
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
import axios from 'axios';
const PORT = process.env.PORT || 8084;
 
// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});

//MQTT
// import { initializeMQTT } from './mqtthandler';
import { initializeMQTT } from './Services/mqttHandler';
const mqttClient = initializeMQTT();

// 라우터
import robotRouters from './Routers/robotrouters.js';
import pointRouters from './Routers/pointrouters';
app.use('/', robotRouters);
app.use('/', pointRouters);

import {
    robotSettings,
    setRobotSettings,
    pointCoordinate,
    setPointCoordinate,
    robotCoordinate,
    setRobotCoordinate,
    laserCoordinate,
    setLaserCoordinate
} from './robotconfig';

import * as RobotSetup from './Services/robotSetup.js';
import * as Func from './Services/robotCommands.js';

// 로봇명 전역변수 설정
// serverSetup();
RobotSetup.serverSetup();

// 각 로봇의 좌표 계속 전송
// 각 로봇 레이저 좌표 계속 전송

export async function setSpeed() {
    try {
        // 좌표 받기
        const response = await axios.post(`http://192.168.0.177/cmd/max_speed`, {
            speed : 0.5
        });
        if (response.status === 200) {
            // console.log(response.data); // theta 는 radian이라서 변환이 필요함
        }
    } catch (error) {
        console.error('Error with API call:', error);
    }
}
setSpeed();

setInterval(async () => {
    // 좌표와 레이저 정보 받기
    for(var i in robotSettings){
        await Func.getPose(i);
        await Func.getLaser(i);
        console.log(robotSettings[i].robotIP);
        // console.log(robotCoordinate[robotSettings[i].robotNumber]);
    }

    // 장애물 감지 
    for(var i in robotSettings){
        for(const coordinate of laserCoordinate[robotSettings[i].robotNumber]){
            const robotTheta = robotCoordinate[robotSettings[i].robotNumber].theta * (180 / Math.PI);
            const robotX = robotCoordinate[robotSettings[i].robotNumber].x;
            const robotY = robotCoordinate[robotSettings[i].robotNumber].y;
            const dx = robotX - coordinate.x;
            const dy = robotY - coordinate.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 장애물과 로봇이 일정거리 이내
            // 레이저 좌표에서 벽을 제외한 통로의 값만 장애물로 감지
            if(distance < 2.5 && coordinate.x > 0.3 && coordinate.x < 3.40 && coordinate.y > -1 && coordinate.y < 8.4) {
                // console.log(i + "가 인식한 장애물의 좌표" + coordinate.x + " / "+ coordinate.y);
                var direction = await Func.getDivideDirection(robotTheta, coordinate.x, coordinate.y, robotX, robotY);
                console.log(direction); // 로봇의 기준으로 장애물이 left / right인지 확인
                break;
            }     
        }
    }
    const currentDate = new Date();
    console.log(currentDate);
}, 33);
    
    
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


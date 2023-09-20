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

// import { robotSettings, setRobotSettings, pointCoordinate, setPointCoordinate } from './robotconfig';

import * as RobotSetup from './Services/robotSetup.js';
// import * as Func from './Services/robotCommands.js';

// 로봇명 전역변수 설정
// serverSetup();
RobotSetup.serverSetup();


// 현재 좌표 메인서버로 계속 전송

// setInterval(() =>{
//     // console.log(i);
//     for(var i in robotSettings){
//         Func.movePlan(i);
//     }
    
    
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


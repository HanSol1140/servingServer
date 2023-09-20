// server.ts
import express from 'express';
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
import axios from 'axios';
const PORT = process.env.PORT || 8084;

import { robotSettings, setRobotSettings, pointCoordinate, setPointCoordinate } from '../robotconfig';

// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});

//MQTT
import { initializeMQTT } from './mqtthandler';
const mqttClient = initializeMQTT();

// 라우터
import routerhandler from './routerhandler';
app.use('/', routerhandler);



// import { setupRobots, setupPoints, serverSetup, cancle, movePoint, moverCoordinates, charge, checkBattery, getPose, test, retryMovePoint } from './func';
import { serverSetup, cancle, retryMovePoint, charge, checkBattery, getPose, manualMove, manualTurn, movePoint, moverCoordinates, test } from './func';

// 로봇명 전역변수 설정
serverSetup();


// 10분마다 배터리 잔량 체크
// setInterval(() => {
//     for (var i in robotSettings) {
//         console.log(i);
//         const battery = checkBattery(i);
//         var message = {
//             robotName: `${i}`,
//             battery: `${battery}`,
//         };
//         mqttClient.publish('mainserver', JSON.stringify(message));
//     }
// }, 600000);

// 현재 좌표 메인서버로 계속 전송
export async function getIMUstatus() {
    try {
        const response = await axios.get(`http://192.168.0.177/reeman/imu`);
        if (response.status === 200) {
            console.log(response.data);
            // console.log("!!");
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}

export async function getSpeed() {
    try {
        const response = await axios.get(`http://192.168.0.177/reeman/speed`);
        if (response.status === 200) {
            console.log(response.data);
            // console.log("!!");
        }

    } catch (error) {
        console.log("속도측정 에러");
        // console.error('Error with API call:', error);
    }
}

setInterval(() => {
    // getSpeed();
    getIMUstatus();
}, 100);
//속도 변경
export async function changesped() {
    try {
        const response = await axios.post(`http://192.168.0.177/cmd/nav_max_vel_x_config`, {
            max_vel: 0.4
        });
        if (response.status === 200) {
            console.log(response.data);
            console.log("test");
        }

    } catch (error) {
        console.error('Error', error);
    }
}
// setInterval(() =>{
//     manualTurn2();
//     manualMove2();
// },20);


// setTimeout(() => {
// for(var i in robotSettings){
//     console.log(i);
//     console.log(robotSettings[i]);
// }
//     // var message = {
//     //     asdf : "movePoint",
//     //     asfd : "robot1",
//     // };
//     // console.log("실행 확인");
//     // mqttClient.publish('servingbot_in', JSON.stringify(message));
// }, 2000);





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


//Theta 계산 // 각도 => Theta
const degrees = -159.85;
const radians = (degrees * Math.PI) / 180;
console.log(radians);
// Theta => 각도로 재변환
// Theta * (180 / Math.PI);
const degreesFromRadians = radians * (180 / Math.PI);
console.log(degreesFromRadians);


// moverCoordinates('192.168.0.15', 0.0, 0.0, 0);
// moverCoordinates('192.168.0.15', -2.2, -0.65, radians);
// moverCoordinates('192.168.0.15', 6.2, -0.8, radians);


// 027.019.155.8
// movePoint('192.168.0.15', '0');
// moverCoordinates('192.168.0.15', 1.0, 0.3, radians);


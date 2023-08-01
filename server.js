// server.js
const express = require('express');
const app = express();
app.use(express.json());
// const axios = require('axios');
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용




const PORT = process.env.PORT || 8084;

// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});

// 라우터
const routerhandler = require('./routerhandler');
app.use('/', routerhandler);

// 함수
const { setupRobots, cancle, movePoint, moverCoordinates, charge, checkBattery, getPose, test } = require('./func');

let bot1;
let bot2;
let bot3;
let bot4;

async function serverSetup(){
    robots = await setupRobots();
    bot1 = robots.robot1;
    bot2 = robots.robot2;
    bot3 = robots.robot2;
    bot4 = robots.robot2;

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

setInterval(() => {
    // getPose('192.168.0.15');
    // moverCoordinates('192.168.0.15', 0.17, -0.03, 65,06)
    // test('192.168.0.137:8002');
    // test('192.168.0.137:8003');
    // test('192.168.0.137:8004');
    // test('192.168.0.137:8005');
}, 30);
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

const degrees = 0;
const radians = (degrees * Math.PI) / 180;
console.log(radians);
// moverCoordinates('192.168.0.15', 0.0, 0.0, 0);
// moverCoordinates('192.168.0.15', 6.5, 0.0, radians);


// 027.019.155.8
// movePoint('192.168.0.15', '0');
// moverCoordinates('192.168.0.15', 1.0, 0.3, radians);


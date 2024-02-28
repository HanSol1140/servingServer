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
exports.manualMove = exports.manualTurn = exports.movePointList = exports.test = exports.getPose = exports.getDivideDirection = exports.getLaser = exports.getSpeed = exports.getIMUstatus = exports.changeSpeed = exports.checkBattery = exports.charge = exports.movePlan = exports.retryMovePoint = exports.moveCoordinates = exports.movePoint = exports.cancle = void 0;
// func.ts
const axios_1 = __importDefault(require("axios"));
const robotconfig_1 = require("../robotconfig");
// ────────────────────────────────────────────────────────────────────────────────────────────
// 서빙봇 이동 API
// 이동 취소
function cancle(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(`http://${robotconfig_1.robotSettings[robotName].robotIP}/cmd/cancel_goal`);
            if ((yield response.status) === 200) {
                // console.log(response.data);
                console.log("Cancle");
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.cancle = cancle;
// 포인트명으로 이동
function movePoint(robotName, point) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(`http://${robotconfig_1.robotSettings[robotName].robotIP}/cmd/nav_point`, {
                point: `${point}`
            });
            if (response.status === 200) {
                // 성공
                console.log(response.data);
                setTimeout(() => {
                    robotconfig_1.robotSettings[robotName].robotRunningState = true; // 로봇이 출발
                    console.log("state : " + robotconfig_1.robotSettings[robotName].robotRunningState);
                }, 1000);
                // robotSettings[robotName].robotLastOrderPoint에 방금 이동한 point를 저장
                // => 장애물 회피 후 다시 목적지로 보내기 위함
                robotconfig_1.robotSettings[robotName].robotLastOrderPoint = robotconfig_1.pointCoordinate[point];
                // console.log(robotSettings[robotName].robotLastOrderPoint);
            }
            // 이동한 포인트 저장 => 로봇별로 저장해야함
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.movePoint = movePoint;
// 좌표로 이동
function moveCoordinates(xstring, ystring, thetastring) {
    return __awaiter(this, void 0, void 0, function* () {
        var x = Number(xstring);
        var y = Number(ystring);
        var theta = Number(thetastring);
        try {
            const response = yield axios_1.default.post(`http://192.168.0.177/cmd/nav`, {
                x,
                y,
                theta
            });
            if (response.status === 200) {
                console.log(response.data);
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.moveCoordinates = moveCoordinates;
// 포인트 재이동
function retryMovePoint(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        // 로봇 회피 후 다시 목적지로 이동할때 사용
        // getPose를 통해 얻은 좌표에서 로봇끼리 일정거리 이하로 접근햇을때
        // 수동 이동(회전, 직진/후진을 직접적으로 명령할 수 있음)후 목적지로 이동지시를 다시하기 위함
        // 회피 동작 후 회피 동작을 수행한 로봇이 실행
        console.log("재이동 요청");
        console.log(robotName + "로봇 재이동"); // 서빙봇 명칭
        // console.log(robotSettings[robotName].robotLastOrderPoint); // 포인트에 저장된 값 확인
        moveCoordinates(robotName, robotconfig_1.robotSettings[robotName].robotLastOrderPoint.x, robotconfig_1.robotSettings[robotName].robotLastOrderPoint.y, robotconfig_1.robotSettings[robotName].robotLastOrderPoint.theta);
    });
}
exports.retryMovePoint = retryMovePoint;
function movePlan(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://${robotconfig_1.robotSettings[robotName].robotIP}/reeman/global_plan`);
            if (response.status === 200) {
                var valuelist = Object.values(response.data);
                console.log(response.data.coordinates[response.data.coordinates.length - 1]);
                // console.log(valuelist);
            }
        }
        catch (error) {
            // console.error('Error with API call:', error);
        }
    });
}
exports.movePlan = movePlan;
function charge(robotName, point) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(`http://${robotconfig_1.robotSettings[robotName].robotIP}/cmd/charge`, {
                type: 1, // 지정된 위치로 이동 후 가까운 충전 포인트를 찾아서 접속함
                point: `${point}`
            });
            if ((yield response.status) === 200) {
                console.log(response.data);
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.charge = charge;
// 배터리 체크, 이게 일정 이하가 된다면 charge실행
function checkBattery(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://${robotconfig_1.robotSettings[robotName].robotIP}/reeman/base_encode`);
            if ((yield response.status) === 200) {
                console.log(response.data);
                // console.log(response.data.battery);
                // return response.data.battery
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.checkBattery = checkBattery;
//속도 변경
//기본적인 작동테스트만함, 추가코딩필요
function changeSpeed(speedValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // max = 1;
            const response = yield axios_1.default.post(`http://192.168.0.177/cmd/nav_max_vel_x_config`, {
                max_vel: speedValue
            });
            if (response.status === 200) {
                console.log(response.data);
                console.log("test");
            }
        }
        catch (error) {
            console.error('Error', error);
        }
    });
}
exports.changeSpeed = changeSpeed;
// 속도 턴속도 측정이라는데 변하질않음
function getIMUstatus() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://192.168.0.177/reeman/imu`);
            if (response.status === 200) {
                console.log(response.data);
                // console.log("!!");
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.getIMUstatus = getIMUstatus;
// 현재 속도 측정 => 가만히 있을땐 error출력, 움직일때만 작동하는 API
function getSpeed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://192.168.0.177/reeman/speed`);
            if (response.status === 200) {
                console.log(response.data);
                // console.log("!!");
            }
        }
        catch (error) {
            console.log("속도측정 에러");
            // console.error('Error with API call:', error);
        }
    });
}
exports.getSpeed = getSpeed;
// 레이저 데이터 수집
function getLaser(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://${robotconfig_1.robotSettings[robotName].robotIP}/reeman/laser`);
            if (response.status === 200) {
                // response.data
                const coordinates = response.data.coordinates;
                const length = coordinates.length;
                const middle = Math.floor(length / 2);
                const range = Math.floor(length / 3) / 2;
                const startIndex = middle - range;
                const endIndex = middle + range;
                const rawCenterPortion = coordinates.slice(startIndex, endIndex);
                // centerPortion의 각 항목을 LaserDataType (형태로 변환
                const centerPortion = rawCenterPortion.map((item) => ({ x: item[0], y: item[1] }));
                const robotNumber = robotconfig_1.robotSettings[robotName].robotNumber;
                (0, robotconfig_1.setLaserCoordinate)(robotNumber, centerPortion);
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.getLaser = getLaser;
// 레이저 데이터 수집을 통해 방향체크
function normalizeAngle(angle) {
    while (angle <= -180)
        angle += 360;
    while (angle > 180)
        angle -= 360;
    return angle;
}
function getDivideDirection(robotTheta, obsX, obsY, robotX, robotY) {
    return __awaiter(this, void 0, void 0, function* () {
        // 좌표 기준으로 방향을 체크
        // let checkDirection = Math.atan2((장애물 y좌표 - 로봇의 y현재좌표), (장애물 x좌표 -로봇의 x현재좌표));
        // checkDirection = aaa * 180 / Math.PI ;
        // 현재 로봇이 바라보고 있는 방향 기준으로 체크
        // checkDirection 로봇의 현재 theta - checkDirection = 양수일경우 좌측, 음수일경우 우측에 장애물이 있다
        let checkDirection = Math.atan2(obsY - robotY, obsX - robotX);
        checkDirection = checkDirection * 180 / Math.PI;
        let deltaTheta = normalizeAngle(checkDirection - robotTheta);
        // 양수일 경우 좌측, 음수일 경우 우측에 장애물이 있다고 판단
        return deltaTheta > 0 ? "left" : "right";
    });
}
exports.getDivideDirection = getDivideDirection;
// type crashType = {}
// 좌표 받기
function getPose(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 좌표 받기
            const response = yield axios_1.default.get(`http://${robotconfig_1.robotSettings[robotName].robotIP}/reeman/pose`);
            if (response.status === 200) {
                // console.log(response.data); // theta 는 radian이라서 변환이 필요함
                const currentRobotIndex = (robotconfig_1.robotSettings[robotName].robotNumber);
                (0, robotconfig_1.setRobotCoordinate)(currentRobotIndex, response.data.x, response.data.y, response.data.theta);
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.getPose = getPose;
let robots = {};
let crashState = {};
// 받은 좌표를 이용하여 수동으로 접근한 로봇을 피함
let currentRobotIndex;
function test(robotName) {
    getPose(robotName); // 좌표 받기
    const tolerance = 2.5;
    try {
        // 좌표값 비교
        for (let i = 1; i <= Object.keys(robots).length; i++) {
            if (i != currentRobotIndex) { // 비교군에서 자신을 제외
                const dx = robots[currentRobotIndex].x - robots[i].x;
                const dy = robots[currentRobotIndex].y - robots[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= tolerance) { // 충돌위험
                    // console.log(`${currentRobotIndex + 1}번 서빙봇과 ${i + 1}번 서빙봇 접근`);
                    const compareTheta = robots[i].theta;
                    // 충돌 가능성 비교
                    let angle = (compareTheta - robots[currentRobotIndex].theta + 360) % 360;
                    if (angle > 180) {
                        angle -= 360;
                    }
                    // 각도 차이 20도 이하일 때 충돌 위험 판단
                    // -160 ~ -180도 혹은 160 ~ 180도
                    if (angle >= -200 && angle <= -160 && crashState[robotName] == false) {
                        // 충돌 대비 동작
                        console.log(`${currentRobotIndex + 1}번 서빙봇과 ${i + 1}번 서빙봇 충돌 위험`);
                        crashState[robotName] = true;
                        // 수동 방향전환
                        timerTurn(robotName, 2000); // 움직일 로봇, setinterval반복 시간
                        // 수동 직진
                        timerMove(robotName, 2000, 2000); // 움직일 로봇, setTimeout 대기시간, setinterval반복 시간
                    }
                }
                else if (distance > tolerance + 1 && crashState[robotName]) { // 멀어지면 ㅇ
                    crashState[robotName] = false;
                    console.log("state : false");
                }
            }
        }
    }
    catch (error) {
        console.error('Error with API call:', error);
    }
}
exports.test = test;
// =======================================================================================================================
// =======================================================================================================================
function movePointList(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip}/cmd/nav_list`, [
                { "test1": ["-0.56", "-1.78", "-131.35"] },
                { "test2": ["-1.15", "-2.33", "36.43"] }
            ]);
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.movePointList = movePointList;
// 수동 방향 전환
// // 전진,회전 setInterval로 누르고 있는 식으로 반복해야 제대로 동작함,
// API설명을 보면 지정한만큼 움직이는게아니라, 누르고있는 시간만큼 움직이기때문에 계속 요청을 보내야함
function manualTurn(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip}/cmd/speed`, {
                vx: 0.0,
                vth: 1.0
            });
            if (response.status === 200) {
                // console.log(response.data);
                // console.log("수동회전");
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.manualTurn = manualTurn;
function timerTurn(robotName, timer) {
    const manualTurnInterval = setInterval(() => {
        manualTurn(robotName);
    }, 33);
    setTimeout(() => {
        clearInterval(manualTurnInterval);
    }, timer);
}
// 수동 이동
function manualMove(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip}/cmd/speed`, {
                vx: 1.0,
                vth: 0.0
            });
            if (response.status === 200) {
                // console.log(response.data);
                // console.log("수동이동");
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.manualMove = manualMove;
function timerMove(robotName, timer1, timer2) {
    setTimeout(() => {
        const manualMoveInterval = setInterval(() => {
            manualMove(robotName);
        }, 33);
        setTimeout(() => {
            clearInterval(manualMoveInterval);
        }, timer2);
    }, timer1);
}
// 사용 보류 기능
// 해당 로봇 위치 근처의 좌표를 보내주면 로봇이 자신의 위치를 다시 설정함,
// async function relocPose() {
//     try {
//         const response = await axios.get(`http://192.168.0.13/cmd/reloc_pose`,{
//             x : 0,
//             y : 0,
//             theta : 0
//         });
//         if (response.status === 200) {
//             console.log(response.data);
//         }
//     } catch (error) {
//         console.error('Error with API call:', error);
//         console.log("error : ", error);
//     }
// }
// 로봇 이름 받기
// async function getRobotName(ip){
//     try {
//         console.log(new Date().toISOString());
//         const response = await axios.get(`http://${ip}/reeman/hostname`);
//         if (response.status === 200) {
//             console.log(response.data);
//         }
//     } catch (error) {
//         console.error('Error with API call:', error);
//     }
// }

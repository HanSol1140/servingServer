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
exports.getLaser = exports.manualMove = exports.manualTurn = exports.movePointList = exports.test = exports.getPose = exports.checkBattery = exports.charge = exports.retryMovePoint = exports.moverCoordinates = exports.movePoint = exports.cancle = exports.getSpeed = exports.getIMUstatus = exports.changeSpeed = exports.serverSetup = exports.setupPoints = exports.setupRobots = void 0;
// robotSetup.ts
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const robotconfig_1 = require("../robotconfig");
// 서버 실행시 로봇리스트 받아오기
function setupRobots() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync('RobotSettings.json')) {
            console.error("File not found");
            return;
        }
        try {
            const fileData = fs_1.default.readFileSync('RobotSettings.json', 'utf8');
            let data = fileData ? JSON.parse(fileData) : [];
            return data;
        }
        catch (error) {
            console.error('Error reading file:', error);
            return [];
        }
    });
}
exports.setupRobots = setupRobots;
// 서버 실행시 포인트리스트 받아오기
function setupPoints() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync('PointSettings.json')) {
            console.error("File not found");
            return;
        }
        try {
            const fileData = fs_1.default.readFileSync('PointSettings.json', 'utf8');
            let data = fileData ? JSON.parse(fileData) : [];
            return data;
        }
        catch (error) {
            console.error('Error reading file:', error);
            return [];
        }
    });
}
exports.setupPoints = setupPoints;
// 서버 실행시 로봇 / 포인트 설정
function serverSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        // 로봇 설정
        const robots = yield setupRobots();
        console.log(robots);
        robots.forEach(robot => {
            (0, robotconfig_1.setRobotSettings)(robot.robotName, robot.robotNumber, robot.robotIP, robot.robotRunningState, robot.robotLastOrderPoint);
        });
        // console.log(robotSettings["robot1"].robotIP);
        // console.log(robotSettings["robot2"].robotIP);
        // console.log(robotSettings["robot3"]);
        // console.log(robotSettings["robot4"]);
        // 포인트 좌표 설정
        const points = yield setupPoints();
        // console.log(points);
        points.forEach(point => {
            (0, robotconfig_1.setPointCoordinate)(point.pointName, point.coordinatesX, point.coordinatesY, point.coordinatesTheta);
        });
        // console.log(pointCoordinate["1"]);
        // console.log(pointCoordinate["1"].x);
        // console.log(pointCoordinate["1"].y);
        // console.log(pointCoordinate["1"].theta);
    });
}
exports.serverSetup = serverSetup;
//속도 변경
//기본적인 작동테스트만함, 추가코딩필요
function changeSpeed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(`http://192.168.0.177/cmd/nav_max_vel_x_config`, {
                max_vel: 1
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
// ────────────────────────────────────────────────────────────────────────────────────────────
// 서빙봇 이동 API
// 이동 취소
function cancle(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip.trim()}/cmd/cancel_goal`);
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
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip.trim()}/cmd/nav_point`, {
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
function moverCoordinates(robotName, xstring, ystring, thetastring) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        var x = Number(xstring);
        var y = Number(ystring);
        var theta = Number(thetastring);
        try {
            const response = yield axios_1.default.post(`http://${ip.trim()}/cmd/nav`, {
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
exports.moverCoordinates = moverCoordinates;
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
        moverCoordinates(robotName, robotconfig_1.robotSettings[robotName].robotLastOrderPoint.x, robotconfig_1.robotSettings[robotName].robotLastOrderPoint.y, robotconfig_1.robotSettings[robotName].robotLastOrderPoint.theta);
    });
}
exports.retryMovePoint = retryMovePoint;
function charge(robotName, point) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip.trim()}/cmd/charge`, {
                type: 1,
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
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.get(`http://${ip.trim()}/reeman/base_encode`);
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
// type crashType = {}
let robots = {};
let crashState = {};
let currentRobotIndex;
// 좌표 받기
function getPose(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        // 값이 없으면 false로 변환, 있다면 true로 유지
        crashState[robotName] = !!crashState[robotName];
        try {
            // 좌표 받기
            const response = yield axios_1.default.get(`http://${ip}/reeman/pose`);
            if (response.status === 200) {
                // console.log(response.data); // theta 는 radian이라서 변환이 필요함
                currentRobotIndex = parseInt(robotconfig_1.robotSettings[robotName].robotNumber);
                robots[currentRobotIndex] = {
                    x: response.data.x,
                    y: response.data.y,
                    theta: response.data.theta * (180 / Math.PI)
                };
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.getPose = getPose;
// 받은 좌표를 이용하여 수동으로 접근한 로봇을 피함
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
exports.default = {
    setupRobots: setupRobots,
    setupPoints: setupPoints,
    serverSetup: serverSetup,
    cancle: cancle,
    movePoint: movePoint,
    moverCoordinates: moverCoordinates,
    retryMovePoint: retryMovePoint,
    charge: charge,
    checkBattery: checkBattery,
    getPose: getPose,
    manualMove: manualMove,
    manualTurn: manualTurn,
    getLaser: getLaser,
    test: test,
};
//─────────────────────────────────────────────────────────────────────
//─────────────────────────────────────────────────────────────────────
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
// 레이저 데이터 수집 => 근데 이걸 활용이 가능할지 모르겠음
function getLaser(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.get(`http://${ip}/reeman/laser`);
            if (response.status === 200) {
                console.log(response.data);
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.getLaser = getLaser;

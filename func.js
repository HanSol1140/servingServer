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
exports.test = exports.manualMove = exports.manualTurn = exports.getPose = exports.checkBattery = exports.charge = exports.retryMovePoint = exports.moverCoordinates = exports.movePoint = exports.cancle = exports.serverSetup = exports.setupPoints = exports.setupRobots = void 0;
// func.ts
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const robotconfig_1 = require("./robotconfig");
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
// ────────────────────────────────────────────────────────────────────────────────────────────
// 서빙봇 이동 API
// 이동 취소
function cancle(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip.trim()}/cmd/cancel_goal`);
            if ((yield response.status) === 200) {
                console.log(response.data);
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
        // console.log(robotSettings[robotName].robotLastOrderPoint); // 포인트에 저장된
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
let robots = [];
let currentRobotIndex;
let state = false;
function getPose(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.get(`http://${ip}/reeman/pose`);
            if (response.status === 200) {
                // console.log((robotSettings[robotName].robotNumber) + "번 로봇 좌표");
                // console.log(response.data); // theta 는 radian이라서 변환이 필요함
                currentRobotIndex = parseInt(robotconfig_1.robotSettings[robotName].robotNumber) - 1;
                robots[currentRobotIndex] = {
                    x: response.data.x,
                    y: response.data.y,
                    theta: response.data.theta * (180 / Math.PI)
                };
                const tolerance = 2.0; // 
                for (let i = 0; i < robots.length; i++) {
                    if (i != currentRobotIndex) { // 비교군에서 자신을 제외
                        // 피타고라스 공식
                        const dx = robots[currentRobotIndex].x - robots[i].x;
                        const dy = robots[currentRobotIndex].y - robots[i].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance <= tolerance) {
                            // console.log(`${currentRobotIndex + 1}번 로봇과 ${i + 1}번 로봇 접근`);
                            const compareTheta = robots[i].theta;
                            // 충돌 가능성 비교
                            let angle = Math.abs(robots[currentRobotIndex].theta - compareTheta); // 
                            // 각도 차이 20도 이하일 때 충돌 위험 판단
                            // -160 ~ -180도 혹은 160 ~ 180도
                            if ((angle >= 150 && angle <= 180) || (angle <= -150 && angle >= -180)) {
                                // 충돌 대비 동작
                                if (state == false) {
                                    console.log(`${currentRobotIndex + 1}번 로봇과 ${i + 1}번 로봇 충돌 위험!`);
                                    state = true;
                                    // 반복문 시작
                                    // cancle(robotName);
                                    //1초간 방향전환
                                    const manualTurnInterval = setInterval(() => {
                                        manualTurn(robotName);
                                    }, 20);
                                    setTimeout(() => {
                                        clearInterval(manualTurnInterval);
                                    }, 500);
                                    // 1초 뒤에 앞으로 이동시작
                                    // 이동을 시작하면 2초뒤에 멈춤
                                    setTimeout(() => {
                                        const manualMoveInterval = setInterval(() => {
                                            manualMove(robotName);
                                        }, 20);
                                        setTimeout(() => {
                                            clearInterval(manualMoveInterval);
                                        }, 2000);
                                    }, 1050);
                                    setTimeout(() => {
                                        retryMovePoint(robotName);
                                        state = false;
                                        console.log("state : false");
                                    }, 3600);
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.getPose = getPose;
// 수동 이동
// // 전진,회전 setInterval로 누르고 있는 식으로 반복해야 제대로 동작함,
// API설명을 보면 지정한만큼 이동할거같은데 누르고있는식으로 계속 요청을 보내야함
function manualTurn(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip}/cmd/speed`, {
                vx: 0.0,
                vth: 0.1
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
exports.manualTurn = manualTurn;
function manualMove(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = robotconfig_1.robotSettings[robotName].robotIP;
        try {
            const response = yield axios_1.default.post(`http://${ip}/cmd/speed`, {
                vx: 0,
                vth: 1
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
exports.manualMove = manualMove;
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
    test: test,
    manualMove: manualMove,
    manualTurn: manualTurn
};
//─────────────────────────────────────────────────────────────────────
function test(ip, x, y, z) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(new Date().toISOString());
            const response = yield axios_1.default.post(`http://${ip}/cmd/nav`, {
                x: 0.17,
                y: -0.03,
                theta: 180.06
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
exports.test = test;
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
// async function getLaser(ip){
//     try {
//         console.log(new Date().toISOString());
//         const response = await axios.get(`http://${ip}/reeman/laser`);
//         if (response.status === 200) {
//             console.log(response.data);
//         }
//     } catch (error) {
//         console.error('Error with API call:', error);
//     }
// }

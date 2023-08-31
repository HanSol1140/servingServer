// func.ts
import axios from 'axios';
import fs from 'fs';
import { robotSettings, setRobotSettings, pointCoordinate, setPointCoordinate } from './robotconfig';



// 서버 실행시 로봇리스트 받아오기
export async function setupRobots() {
    if (!fs.existsSync('RobotSettings.json')) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs.readFileSync('RobotSettings.json', 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

// 서버 실행시 포인트리스트 받아오기
export async function setupPoints() {
    if (!fs.existsSync('PointSettings.json')) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs.readFileSync('PointSettings.json', 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

interface robotsInfo {
    robotName: string;
    robotNumber: string;
    robotIP: string;
    robotRunningState: boolean,
    robotLastOrderPoint: object
}
interface pointsInfo {
    pointName: string;
    coordinatesX: string;
    coordinatesY: string;
    coordinatesTheta: string;
}
// 서버 실행시 로봇 / 포인트 설정
export async function serverSetup() {

    // 로봇 설정
    const robots: robotsInfo[] = await setupRobots();
    console.log(robots);
    robots.forEach(robot => {
        setRobotSettings(robot.robotName, robot.robotNumber, robot.robotIP, robot.robotRunningState, robot.robotLastOrderPoint);
    });
    // console.log(robotSettings["robot1"].robotIP);
    // console.log(robotSettings["robot2"].robotIP);
    // console.log(robotSettings["robot3"]);
    // console.log(robotSettings["robot4"]);


    // 포인트 좌표 설정
    const points: pointsInfo[] = await setupPoints();
    // console.log(points);

    points.forEach(point => {
        setPointCoordinate(point.pointName, point.coordinatesX, point.coordinatesY, point.coordinatesTheta);
    });

    // console.log(pointCoordinate["1"]);
    // console.log(pointCoordinate["1"].x);
    // console.log(pointCoordinate["1"].y);
    // console.log(pointCoordinate["1"].theta);

}

// ────────────────────────────────────────────────────────────────────────────────────────────
// 서빙봇 이동 API
// 이동 취소
export async function cancle(robotName: string) {
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.post(`http://${ip.trim()}/cmd/cancel_goal`);
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}

// 포인트명으로 이동
export async function movePoint(robotName: string, point: string) {
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.post(`http://${ip.trim()}/cmd/nav_point`, {
            point: `${point}`
        });
        if (response.status === 200) {
            // 성공
            console.log(response.data);
            setTimeout(() => {
                robotSettings[robotName].robotRunningState = true; // 로봇이 출발
                console.log("state : " + robotSettings[robotName].robotRunningState);
            }, 1000);
            // robotSettings[robotName].robotLastOrderPoint에 방금 이동한 point를 저장
            // => 장애물 회피 후 다시 목적지로 보내기 위함
            robotSettings[robotName].robotLastOrderPoint = pointCoordinate[point];
            // console.log(robotSettings[robotName].robotLastOrderPoint);
        }
        // 이동한 포인트 저장 => 로봇별로 저장해야함
    } catch (error) {
        console.error('Error with API call:', error);
    }
}

// 좌표로 이동
export async function moverCoordinates(robotName: string, xstring?: string, ystring?: string, thetastring?: string) {
    let ip: string = robotSettings[robotName].robotIP;
    var x: number = Number(xstring);
    var y: number = Number(ystring);
    var theta: number = Number(thetastring);
    try {
        const response = await axios.post(`http://${ip.trim()}/cmd/nav`, {
            x,
            y,
            theta
        });
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error with API call:', error);
    }
}


// 포인트 재이동
export async function retryMovePoint(robotName: string) {
    // 로봇 회피 후 다시 목적지로 이동할때 사용
    // getPose를 통해 얻은 좌표에서 로봇끼리 일정거리 이하로 접근햇을때
    // 수동 이동(회전, 직진/후진을 직접적으로 명령할 수 있음)후 목적지로 이동지시를 다시하기 위함
    // 회피 동작 후 회피 동작을 수행한 로봇이 실행
    console.log("재이동 요청");
    console.log(robotName + "로봇 재이동"); // 서빙봇 명칭
    // console.log(robotSettings[robotName].robotLastOrderPoint); // 포인트에 저장된
    moverCoordinates(robotName, robotSettings[robotName].robotLastOrderPoint.x, robotSettings[robotName].robotLastOrderPoint.y, robotSettings[robotName].robotLastOrderPoint.theta);
}



export async function charge(robotName: string, point: string) {
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.post(`http://${ip.trim()}/cmd/charge`, {
            type: 1, // 지정된 위치로 이동 후 가까운 충전 포인트를 찾아서 접속함
            point: `${point}`
        });
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}


// 배터리 체크, 이게 일정 이하가 된다면 charge실행
export async function checkBattery(robotName: string) {  // 로봇이름
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.get(`http://${ip.trim()}/reeman/base_encode`,);
        if (await response.status === 200) {
            console.log(response.data);
            // console.log(response.data.battery);
            // return response.data.battery
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}

// ────────────────────────────────────────────────────────────────────────────────────────────
// 자기 위치 발신하기 / 

type RobotPose = {
    x: number;
    y: number;
    theta: number;
};

let robots: RobotPose[] = [];
let currentRobotIndex;
let state = false;
export async function getPose(robotName: string) {
    let ip: string = robotSettings[robotName].robotIP;

    try {
        const response = await axios.get(`http://${ip}/reeman/pose`);
        if (response.status === 200) {
            // console.log((robotSettings[robotName].robotNumber) + "번 로봇 좌표");
            // console.log(response.data); // theta 는 radian이라서 변환이 필요함

            currentRobotIndex = parseInt(robotSettings[robotName].robotNumber) - 1;

            robots[currentRobotIndex] = {
                x: response.data.x,
                y: response.data.y,
                theta: response.data.theta * (180 / Math.PI)
            }

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
    } catch (error) {
        console.error('Error with API call:', error);
    }
}

// 수동 이동
// // 전진,회전 setInterval로 누르고 있는 식으로 반복해야 제대로 동작함,
// API설명을 보면 지정한만큼 이동할거같은데 누르고있는식으로 계속 요청을 보내야함
export async function manualTurn(robotName: string) {
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.post(`http://${ip}/cmd/speed`, {
            vx: 0.0,
            vth: 0.1
        });
        if (response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}
export async function manualMove(robotName: string) {
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.post(`http://${ip}/cmd/speed`, {
            vx: 0,
            vth: 1
        });
        if (response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}
export default {
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

export async function test(ip: string, x: string, y: string, z: string) {
    try {
        console.log(new Date().toISOString());
        const response = await axios.post(`http://${ip}/cmd/nav`, {
            x: 0.17,
            y: -0.03,
            theta: 180.06
        });
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error with API call:', error);
    }
}

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


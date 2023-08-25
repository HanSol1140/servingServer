// func.ts
import axios from 'axios';
import fs from 'fs';

let state:boolean = false;

// 저장한 로봇리스트 받아오기
export async function setupRobots() {
    if (!fs.existsSync('RobotSettings.json')) {
        console.error("File not found");
        return;
    }

    try {
        const fileData = fs.readFileSync('RobotSettings.json', 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data; // 배열을 직접 반환합니다.
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}



export async function cancle() {
    try {
        const response = await axios.post(`http://192.168.0.13/cmd/cancel_goal`);
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}




export async function moverCoordinates(ip:string, x:string, y:string, theta:string) {
    try {
        console.log(new Date().toISOString());
        const response = await axios.post(`http://${ip}/cmd/nav`, {
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

let moveCommands: { [key:string]:string } = {};
export async function movePoint(ip:string, point:string) {
    try {
        const response = await axios.post(`http://${ip}/cmd/nav_point`, {
            point: `${point}`
        });
        if (response.status === 200) {
            console.log(response.data);
            setTimeout(() => {
                state = true; // 로봇이 출발했음
                console.log("state : " + state);
            }, 1000);

        }
        moveCommands[ip] = point; // moveCommands변수에 ip : point형식으로 요청을 저장 

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}


export async function retryMovePoint(ip:string) {
    let point = moveCommands[ip];
    if (point) {
        await movePoint(ip, point);
    }
}

export async function charge(ip:string, point:string) {
    try {
        const response = await axios.post(`http://${ip}/cmd/charge`, {
            type: 1,
            point: `${point}`
        });
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}


export async function checkBattery(ip:any) { //로봇별 IP정할 방법을 정해야함
    try {
        const response = await axios.get(`http://${ip}/cmd/base_encode`,);
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}

// ────────────────────────────────────────────────────────────────────────────────────────────
// 자기 위치 발신하기 / 

type RobotPose = {
    x: number;
    y: number;
    theta: number;
};
let robots:RobotPose[] = [];
let currentRobotIndex;

export async function getPose(ip:string) {
    try {
        console.log(new Date().toISOString());
        const response = await axios.get(`http://${ip}/reeman/pose`);
        if (response.status === 200) {
            console.log(response.data);

            currentRobotIndex = parseInt(response.data.robotNumber) - 1;
            robots[currentRobotIndex] = {
                x: response.data.x,
                y: response.data.y,
                theta: response.data.theta
            }
            // console.log(robots[currentRobotIndex].x);
            var currentX = robots[currentRobotIndex].x;
            var currentY = robots[currentRobotIndex].y;
            var currentTheta = robots[currentRobotIndex].theta;
            var compareX;
            var compareY;
            var compareTheta;
            const tolerance = 0.5 // 해당 값만큼 접근하면 접근 알림 출력
            for (let i = 0; i < robots.length; i++) {
                if (i != currentRobotIndex) {  // 비교할 값에서 본인을 제외
                    compareX = robots[i].x;
                    compareY = robots[i].y;
                    compareTheta = robots[i].theta;
                    if (Math.abs(currentX - compareX) <= tolerance && Math.abs(currentY - compareY) <= tolerance) {
                        console.log(`${i + 1}번 로봇 근처에 다른 로봇이 있습니다!`);
                        // 충돌가능성이 있는 로봇을 확인

                        // if()// 이제 로봇의 방향을 확인해서 서로 충돌가능성이 있는지, 있다면 회피로직, 없다면 지시없음
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error with API call:', error);
    }
}

export default {
    setupRobots: setupRobots,
    cancle: cancle,
    movePoint: movePoint,
    moverCoordinates: moverCoordinates,
    charge: charge,
    checkBattery: checkBattery,
    getPose: getPose,
    test: test,
};

//─────────────────────────────────────────────────────────────────────

export async function test(ip:string, x:string, y:string, z:string) {
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

// 레이저 데이터 수집 => 근데 이걸 우리가 활용이 가능할지 모르겠음
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

// 수동 이동
// // 전진,회전 setInterval로 누르고 있는 식으로 반복해야 제대로 동작함,
// API설명을 보면 지정한만큼 이동할거같은데 누르고있는식으로 계속 요청을 보내야함
// async function speedcheck(){
//     try {
//         const response = await axios.post(`http://192.168.0.13/cmd/speed`,{
//             vx : 1,
//             vth : 0
//         });
//         if (await response.status === 200) {
//             console.log(response.data);
//         }

//     } catch (error) {
//         console.error('Error with API call:', error);
//         console.log("error : ", error);
//     }
// }
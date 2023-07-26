const axios = require('axios');

async function cancle(){
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



async function movePoint(ip, point){
    try {
        const response = await axios.post(`http://${ip}/cmd/nav_point`,{
            point: `${point}`
        });
        if (response.status === 200) {
            console.log(response.data);
            setTimeout(() =>{
                state = true;
            }, 1000);
            
        }

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}

async function moverCoordinates(ip, x,y, theta){
    try {
        console.log(new Date().toISOString());
        const response = await axios.post(`http://${ip}/cmd/nav`,{
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

async function charge(point){
    try {
        const response = await axios.post(`http://192.168.0.13/cmd/charge`,{
            type : 1,
            point : `${point}`
        });
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}


async function checkBattery(){ //로봇별 IP정할방법을 정해야함
    try {
        const response = await axios.get(`http://192.168.0.13/cmd/base_encode`,);
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
let robots = [];
let currentRobotIndex;
async function getPose(ip){
    try {
        console.log(new Date().toISOString());
        const response = await axios.get(`http://${ip}/test`);
        if (response.status === 200) {
            // console.log(response.data);
            
            currentRobotIndex = `${response.data.robotNumber}` - 1;
            robots[currentRobotIndex] = {
                x : response.data.x,
                y : response.data.y,
                theta : response.data.theta
            }
            // console.log(robots[currentRobotIndex].x);
            var currentX = robots[currentRobotIndex].x;
            var currentY = robots[currentRobotIndex].y;
            var currentTheta = robots[currentRobotIndex].theta;
            var compareX;
            var compareY;
            var compareTheta;
            tolerance = 0.4
            for(let i = 0; i < robots.length; i++){
                if (i != currentRobotIndex) {  // 비교할 값에서 본인 좌표를 제외
                    compareX = robots[i].x;
                    compareY = robots[i].y;
                    compareTheta = robots[i].theta;
                    if(Math.abs(currentX - compareX) <= tolerance && Math.abs(currentY - compareY) <= tolerance){
                        console.log(`${i+1}번 로봇 근처에 다른 로봇이 있습니다!`);
                    }
                }
            }


        }
    } catch (error) {
        console.error('Error with API call:', error);
    }
}


module.exports = {
    cancle: cancle,
    movePoint: movePoint,
    moverCoordinates: moverCoordinates,
    charge: charge,
    checkBattery: checkBattery,
    getPose: getPose,
    test: test,

};

//─────────────────────────────────────────────────────────────────────

async function test(ip, x, y, z,){
    try {
        console.log(new Date().toISOString());
        const response = await axios.post(`http://${ip}/cmd/nav`,{
            x : 0.17,
            y : -0.03,
            theta : 180.06
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
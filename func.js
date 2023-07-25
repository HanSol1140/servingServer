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



async function move(point){
    try {
        const response = await axios.post(`http://192.168.0.13/cmd/nav_point`,{
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

var x1;
var x2
var y1
var y2;
var theta1;
var theta2;
var count = 0;
var state = false;
let getPose2;
let tolerance = 0.05;

async function getPose(){
    try {
        const response = await axios.get(`http://192.168.0.13/reeman/pose`);
        if (response.status === 200) {

            console.log(response.data);

            if(state == false){
                // target_x = -2.81
                // target_y = 1.35
                target_x = 0.17
                target_y = 0.03
                x1 = Math.floor(response.data.x * 100) / 100;
                x1 = response.data.x
                y1 = Math.floor(response.data.y * 100) / 100;
                y1 = response.data.y
                theta1 = Math.floor(response.data.theta * 100) / 100;


                console.log(x1 + " / " + y1 + " / " + theta1);

                if(Math.abs(x1 - target_x) <= tolerance && Math.abs(y1 - target_y) <= tolerance) {  
                // if(x1 == 2.59 && y1 == 1.06 && theta1 == 16.44){
                    server.close(() => {
                        clearTimeout(getPoseReStart);
                        console.log('목적지 도착');
                    });
                }

                if(x1 == x2 && y1 == y2 && theta1 == theta2){
                    count++;
                    if(count == 10){
                        console.log("!!!");
                        count = 0;
                        server.close(() => {
                            clearTimeout(getPoseReStart);
                            console.log('Server closed');
                        });
                    }
                }else{
                    count = 0;
                }

                x2 = x1;
                y2 = y1;
                theta2 = theta1;
            }

        }

    }finally{
        getPoseReStart = setTimeout(() => {
            getPose();
    }, 1000);
    }
}


// // 전진,회전 setInterval로 누르고 있는 식으로 반복해야 제대로 동작함, API설명과 다름
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

async function test() {
    try {
        const response = await axios.get(`http://192.168.0.13/cmd/pose`,[

            // { "1" : ["0.17", "-0.03", "65.06"] },
            // { "2" : ["-2.59", "1.06", -"16.44"] },
            // { "1" : [0.17, -0.03, 65.06] },
            // { "2" : [-2.59, 1.06, -16.44] },
            // { 1 : ["0.17", "-0.03", "65.06"] },
            // { 2 : ["-2.59", "1.06", -"16.44"] },
            // { 1 : [0.17, -0.03, 65.06] },
            // { 2 : [-2.59, 1.06, -16.44] },
        ]);
             
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}


module.exports = {
    cancle: cancle,
    move: move,
    charge: charge,
    checkBattery: checkBattery,
    getPose: getPose,
    test: test,

};

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
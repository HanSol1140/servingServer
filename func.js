const axios = require('axios');

async function move(){
    try {
        const response = await axios.post(`http://192.168.0.13/cmd/nav_point`,{
            point: "2"
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



var x1;
var x2
var y1
var y2;
var theta1;
var theta2;
var count = 0;
var state = false;
let getPose2;
let tolerance = 0.03;

async function getPose(){
    console.log(`getPose called at ${new Date().toISOString()}`);
    try {
        const response = axios.get(`http://192.168.0.13/reeman/pose`);
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
                // if(x1 == 2.81 && y1 == 1.35 && theta1 == 29.74){
                    server.close(() => {
                        clearTimeout(getPose2);
                        console.log('목적지 도착');
                    });
                }

                if(x1 == x2 && y1 == y2 && theta1 == theta2){
                    count++;
                    if(count == 10){
                        console.log("!!!");
                        count = 0;
                        server.close(() => {
                            clearTimeout(getPose2);
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
        getPose2 = setTimeout(() => {
            getPose();
    }, 10);
    }
}

// 주행중 속도체크(정지상태에선 오류를 발신함)
// async function speedcheck(){
//     try {
//         const response = await axios.get(`http://192.168.0.13/reeman/speed`);
//         if (await response.status === 200) {
//             console.log(response.data);
//         }

//     } catch (error) {
//         console.error('Error with API call:', error);
//         console.log("error : ", error);
//     }
// }

// speedcheck();


// 전진,회전 setInterval로 누르고 있는 식으로 반복해야 제대로 동작함, API설명과 다름
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

module.exports = {
    getPose: getPose,
    move: move
};
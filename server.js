// server.js
const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용

const PORT = process.env.PORT || 80;

// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});

app.get("/test1", async (req, res) => {
    try {
        const response = await axios.get(`http://192.168.0.3/reeman/current_version`);
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
});


var x1;
var x2
var y1
var y2;
var theta1;
var theta2;
var count = 0;
var state = false;

async function move(){
    try {
        const response = await axios.post(`http://192.168.0.3/cmd/nav_point`,{
            point: "1"
        });
        if (await response.status === 200) {
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
// move();


async function getPose(){
    // console.log(`getPose called at ${new Date().toISOString()}`);
    try {
        const response = axios.get(`http://192.168.40.67/reeman/pose`);
        // if (response.status === 200) {

            // console.log(response.data);
            // if(state == true){
                var x1 = parseFloat((response.data.x).toFixed(2));
                var y1 = parseFloat((response.data.y).toFixed(2));
                var theta1 = parseFloat((response.data.theta).toFixed(2));
                console.log(x1 + " / " + y1 + " / " + theta1);

                if(x1 == x2 && y1 == y2 && theta1 == theta2){
                    count++;
                    if(count == 10){
                        console.log("!!!");
                        count = 0;
                        server.close(() => {
                            clearInterval(intervalId); 
                            console.log('Server closed');
                        });
                    }
                }else{
                    count = 0;
                }
                x2 = x1;
                y2 = y1;
                theta2 = theta1;
            // }

        // }
    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}



let intervalId = setInterval(() => {
    getPose();
}, 1);


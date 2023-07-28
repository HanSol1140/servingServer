const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');

router.get("/test1", async (req, res) => {
    res.send("test1");
});

router.get("/", async (req, res) => {
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


// 로봇 이름, 번호, IP 저장
router.post("/api/createrobotlist", async (req, res) => {
    try {
        // RobotSettings.json이 없다면 생성
        if (!fs.existsSync('RobotSettings.json')) {
            fs.writeFileSync('RobotSettings.json', JSON.stringify([]));
        }
        //파일 읽기
        fs.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
            if (err) throw err;
            let data = [];
            data = fileData ? JSON.parse(fileData) : []; // 파일에 데이터가 없으면 빈배열 생성
            const newData = {
                robotName : req.body.robotName,
                robotNumber : req.body.robotNumber,
                robotIP : req.body.robotIP,
            };
            const exists1 = data.some(item => item.robotName === req.body.robotName);
            const exists2 = data.some(item => item.robotNumber === req.body.robotNumber);
            if (!exists1) { // 로봇명과 번호에 중복이 없다
                if(!exists2){
                    data.push(newData); // 새로운 데이터를 배열에 추가
                    const jsonData = JSON.stringify(data, null, 2);
                    fs.writeFileSync('RobotSettings.json', jsonData); // 동기적으로 파일 작성
                    res.send("저장 완료");

                }else{
                    res.status(409).send("로봇번호가 중복되었습니다. \n기입한 정보를 확인해주세요.");    
                }
            } else {
                res.status(409).send("로봇명이 중복되었습니다. \n기입한 정보를 확인해주세요.");
            }
        });

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
});

// 로봇 정보 수정
router.post("/api/updaterobot", async (req, res) => {
    try {
        if (!fs.existsSync('RobotSettings.json')) {
            return res.status(404).send("File not found");
        }

        fs.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
            if (err) throw err;
            let data = fileData ? JSON.parse(fileData) : [];
            let targetRobot = data.find(item => item.robotName === req.body.robotName);
            if (!targetRobot) {
                return res.status(404).send("Robot not found");
            }

            let otherRobots = data.filter(item => item.robotName !== req.body.robotName);

            const exists1 = otherRobots.some(targetRobot => targetRobot.robotName === req.body.newRobotName);
            const exists2 = otherRobots.some(targetRobot => targetRobot.robotNumber === req.body.newRobotNumber);

            if (!exists1) {
                if(!exists2){
                targetRobot.robotName = req.body.newRobotName;
                targetRobot.robotNumber = req.body.newRobotNumber;
                targetRobot.robotIP = req.body.newRobotIP;

                const jsonData = JSON.stringify(data, null, 2);
                fs.writeFileSync('RobotSettings.json', jsonData);
                res.send("Update successful");
                }else {
                    res.status(409).send("로봇번호가 중복되었습니다. \n기입한 정보를 확인해주세요.");  
                }
            } else {
                res.status(409).send("로봇명이 중복되었습니다. \n기입한 정보를 확인해주세요.");
            }
        });
    } catch (error) {
        console.error('Error with API call:', error);
    }
});

// 로봇 이름을 받아서 매칭된 RobotList삭제
router.post("/api/deleterobotlist", async (req, res) => {
    try {
        if (!fs.existsSync('RobotSettings.json')) {
            return res.status(404).send("File not found");
        }
        fs.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
            if (err) throw err;
            let data = fileData ? JSON.parse(fileData) : [];
            const newData = data.filter(item => item.robotName !== req.body.robotName);
            const jsonData = JSON.stringify(newData, null, 2);
            fs.writeFileSync('RobotSettings.json', jsonData);
            res.send("Delete successful");
        });
    } catch (error) {
        console.error('Error with API call:', error);
        res.status(500).send("Server error");
    }
});

// 저장된 RobotSettings리액트 페이지에 출력
router.get("/api/getrobotlist", async (req, res) => {
    fs.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
        if (err) throw err;
        let data = [];
        data = fileData ? JSON.parse(fileData) : []; // 파일에 데이터가 없으면 빈배열 생성
        res.send(data); // 파일 데이터를 클라이언트에 응답으로 보냅니다.
    });
});

module.exports = router;
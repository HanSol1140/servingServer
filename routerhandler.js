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
// routerhandler.ts
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.get("/test1", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("test1");
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`http://192.168.0.15/reeman/current_version`);
        if ((yield response.status) === 200) {
            console.log(response.data);
        }
    }
    catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}));
// 로봇 이름, 번호, IP 저장
router.post("/api/createrobotlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // RobotSettings.json이 없다면 생성
        if (!fs_1.default.existsSync('RobotSettings.json')) {
            fs_1.default.writeFileSync('RobotSettings.json', JSON.stringify([]));
        }
        // 파일 읽기
        fs_1.default.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = fileData ? JSON.parse(fileData) : []; // 파일에 데이터가 없으면 빈 배열 생성
            const newData = {
                robotName: req.body.robotName,
                robotNumber: req.body.robotNumber,
                robotIP: req.body.robotIP,
                robotLastOrderPoint: '',
            };
            const exists1 = data.some(item => item.robotName === req.body.robotName);
            const exists2 = data.some(item => item.robotNumber === req.body.robotNumber);
            if (!exists1) { // 로봇명과 번호에 중복이 없다
                if (!exists2) {
                    data.push(newData); // 새로운 데이터를 배열에 추가
                    // 데이터 오름차순 정렬
                    data.sort((a, b) => a.robotName.localeCompare(b.robotName));
                    // 데이터 오름차순 정렬 끝
                    const jsonData = JSON.stringify(data, null, 2);
                    fs_1.default.writeFileSync('RobotSettings.json', jsonData); // 동기적으로 파일 작성
                    res.send("저장 완료");
                }
                else {
                    res.status(409).send("로봇번호가 중복되었습니다. \n기입한 정보를 확인해주세요.");
                }
            }
            else {
                res.status(409).send("로봇명이 중복되었습니다. \n기입한 정보를 확인해주세요.");
            }
        });
    }
    catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}));
// 로봇 정보 수정
router.post("/api/updaterobot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync('RobotSettings.json')) {
            return res.status(404).send("File not found");
        }
        fs_1.default.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = fileData ? JSON.parse(fileData) : [];
            let targetRobot = data.find(item => item.robotName === req.body.robotName);
            if (!targetRobot) {
                return res.status(404).send("Robot not found");
            }
            let otherRobots = data.filter(item => item.robotName !== req.body.robotName);
            const exists1 = otherRobots.some(targetRobot => targetRobot.robotName === req.body.newRobotName);
            const exists2 = otherRobots.some(targetRobot => targetRobot.robotNumber === req.body.newRobotNumber);
            if (!exists1) {
                if (!exists2) {
                    targetRobot.robotName = req.body.newRobotName;
                    targetRobot.robotNumber = req.body.newRobotNumber;
                    targetRobot.robotIP = req.body.newRobotIP;
                    targetRobot.robotLastOrderPoint = '';
                    // 데이터 오름차순 정렬
                    data.sort((a, b) => a.robotName.localeCompare(b.robotName));
                    // 데이터 오름차순 정렬 끝
                    const jsonData = JSON.stringify(data, null, 2);
                    fs_1.default.writeFileSync('RobotSettings.json', jsonData);
                    res.send("Update successful");
                }
                else {
                    res.status(409).send("로봇번호가 중복되었습니다. \n기입한 정보를 확인해주세요.");
                }
            }
            else {
                res.status(409).send("로봇명이 중복되었습니다. \n기입한 정보를 확인해주세요.");
            }
        });
    }
    catch (error) {
        console.error('Error with API call:', error);
    }
}));
// 로봇 정보 삭제
router.post("/api/deleterobotlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync('RobotSettings.json')) {
            return res.status(404).send("File not found");
        }
        fs_1.default.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = fileData ? JSON.parse(fileData) : [];
            const newData = data.filter(item => item.robotName !== req.body.robotName);
            const jsonData = JSON.stringify(newData, null, 2);
            fs_1.default.writeFileSync('RobotSettings.json', jsonData);
            res.send("Delete successful");
        });
    }
    catch (error) {
        console.error('Error with API call:', error);
        res.status(500).send("Server error");
    }
}));
// 로봇 리스트 받아서 브라우저에 출력
router.get("/api/getrobotlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
        if (err)
            throw err;
        let data = fileData ? JSON.parse(fileData) : [];
        res.send(data);
    });
}));
// 포인트저장
router.post("/api/createPointList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // RobotSettings.json이 없다면 생성
        if (!fs_1.default.existsSync('PointSettings.json')) {
            fs_1.default.writeFileSync('PointSettings.json', JSON.stringify([]));
        }
        //파일 읽기
        fs_1.default.readFile('PointSettings.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = [];
            data = fileData ? JSON.parse(fileData) : []; // 파일에 데이터가 없으면 빈배열 생성
            const newData = {
                pointName: req.body.pointName,
                coordinatesX: req.body.coordinatesX,
                coordinatesY: req.body.coordinatesY,
                coordinatesTheta: req.body.coordinatesTheta,
            };
            const exists1 = data.some(item => item.pointName === req.body.pointName);
            if (!exists1) { // 포인트명에 중복이 없다.
                data.push(newData); // 새로운 데이터를 배열에 추가
                data.sort((a, b) => a.pointName.localeCompare(b.pointName, 'kr'));
                const jsonData = JSON.stringify(data, null, 2);
                fs_1.default.writeFileSync('PointSettings.json', jsonData); // 동기적으로 파일 작성
                res.send("저장 완료");
            }
            else {
                res.status(409).send("포인트의 명칭이 중복되었습니다. \n기입한 정보를 확인해주세요.");
            }
        });
    }
    catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
}));
// 포인트명을 받아서 매칭된 PointList삭제
router.post("/api/deletepointlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync('PointSettings.json')) {
            return res.status(404).send("File not found");
        }
        fs_1.default.readFile('PointSettings.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = fileData ? JSON.parse(fileData) : [];
            const newData = data.filter(item => item.pointName !== req.body.pointName);
            const jsonData = JSON.stringify(newData, null, 2);
            fs_1.default.writeFileSync('PointSettings.json', jsonData);
            res.send("Delete successful");
        });
    }
    catch (error) {
        console.error('Error with API call:', error);
        res.status(500).send("Server error");
    }
}));
// 저장된 PointSettings리액트 페이지에 출력
router.get("/api/getpointlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.readFile('PointSettings.json', 'utf8', (err, fileData) => {
        if (err)
            throw err;
        let data = [];
        data = fileData ? JSON.parse(fileData) : [];
        res.send(data);
    });
}));
// ====================================================================================================
// ====================================================================================================
exports.default = router;

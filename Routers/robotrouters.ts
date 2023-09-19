// roboutRouter.ts
import express, { Router } from 'express';
import fs from 'fs';
import * as RobotController from '../Controllers/robotControllers';
const robotRouter: Router = express.Router();



// 로봇 이름, 번호, IP 저장
robotRouter.post("/api/createrobotlist", RobotController.createRobot);
robotRouter.post("/api/updaterobot", RobotController.updateRobot);
robotRouter.post("/api/deleterobot", RobotController.deleteRobot);
robotRouter.get("/api/getrobotlist", RobotController.getRobotList);

 
// 리팩토링 완료
// interface RobotData {
//     robotName: string;
//     robotNumber: string;
//     robotIP: string;
//     robotRunningState: boolean;
//     robotLastOrderPoint: string;
// }
///////////////////////////////////////////////////////////////////////////////
// //로봇 저장
// robotRouter.post("/api/createrobotlist", async (req: Request, res: Response) => {
//     try {
//         // RobotSettings.json이 없다면 생성
//         if (!fs.existsSync('RobotSettings.json')) {
//             fs.writeFileSync('RobotSettings.json', JSON.stringify([]));
//         }
//         // 파일 읽기
//         fs.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
//             if (err) throw err;
//             let data: RobotData[] = fileData ? JSON.parse(fileData) : []; // 파일에 데이터가 없으면 빈 배열 생성
//             const newData: RobotData = {
//                 robotName: req.body.robotName,
//                 robotNumber: req.body.robotNumber,
//                 robotIP: req.body.robotIP,
//                 robotRunningState : false,
//                 robotLastOrderPoint : '',
//             };
//             const exists1 = data.some(item => item.robotName === req.body.robotName);
//             const exists2 = data.some(item => item.robotNumber === req.body.robotNumber);
//             if (!exists1) { // 로봇명과 번호에 중복이 없다
//                 if (!exists2) {
//                     data.push(newData); // 새로운 데이터를 배열에 추가
//                     // 데이터 오름차순 정렬
//                     data.sort((a, b) => a.robotName.localeCompare(b.robotName));
//                     // 데이터 오름차순 정렬 끝
//                     const jsonData = JSON.stringify(data, null, 2);
//                     fs.writeFileSync('RobotSettings.json', jsonData); // 동기적으로 파일 작성
//                     res.send("저장 완료");
//                 } else {
//                     res.status(409).send("로봇번호가 중복되었습니다. \n기입한 정보를 확인해주세요.");
//                 }
//             } else {
//                 res.status(409).send("로봇명이 중복되었습니다. \n기입한 정보를 확인해주세요.");
//             }
//         });
//     } catch (error) {
//         console.error('Error with API call:', error);
//         console.log("error : ", error);
//     }
// });



// // 로봇 정보 수정
// robotRouter.post("/api/updaterobot", async (req: Request, res: Response) => {
//     try {
//         if (!fs.existsSync('RobotSettings.json')) {
//             return res.status(404).send("File not found");
//         }

//         fs.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
//             if (err) throw err;
//             let data: RobotData[] = fileData ? JSON.parse(fileData) : [];
//             let targetRobot = data.find(item => item.robotName === req.body.robotName);
//             if (!targetRobot) {
//                 return res.status(404).send("Robot not found");
//             }

//             let otherRobots = data.filter(item => item.robotName !== req.body.robotName);
//             const exists1 = otherRobots.some(targetRobot => targetRobot.robotName === req.body.newRobotName);
//             const exists2 = otherRobots.some(targetRobot => targetRobot.robotNumber === req.body.newRobotNumber);
//             if (!exists1) {
//                 if(!exists2){
//                     targetRobot.robotName = req.body.newRobotName;
//                     targetRobot.robotNumber = req.body.newRobotNumber;
//                     targetRobot.robotIP = req.body.newRobotIP;
//                     targetRobot.robotRunningState = false;
//                     targetRobot.robotLastOrderPoint = '';
//                     // 데이터 오름차순 정렬
//                     data.sort((a, b) => a.robotName.localeCompare(b.robotName));
//                     // 데이터 오름차순 정렬 끝
//                     const jsonData = JSON.stringify(data, null, 2);
//                     fs.writeFileSync('RobotSettings.json', jsonData);
//                     res.send("Update successful");
//                 } else {
//                     res.status(409).send("로봇번호가 중복되었습니다. \n기입한 정보를 확인해주세요.");  
//                 }
//             } else {
//                 res.status(409).send("로봇명이 중복되었습니다. \n기입한 정보를 확인해주세요.");
//             }
//         });
//     } catch (error) {
//         console.error('Error with API call:', error);
//     }
// });


// // 로봇 정보 삭제
// robotRouter.post("/api/deleterobot", async (req: Request, res: Response) => {
//     try {
//         if (!fs.existsSync('RobotSettings.json')) {
//             return res.status(404).send("File not found");
//         }

//         fs.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
//             if (err) throw err;
//             let data: RobotData[] = fileData ? JSON.parse(fileData) : [];
//             const newData = data.filter(item => item.robotName !== req.body.robotName);
//             const jsonData = JSON.stringify(newData, null, 2);
//             fs.writeFileSync('RobotSettings.json', jsonData);
//             res.send("Delete successful");
//         });
//     } catch (error) {
//         console.error('Error with API call:', error);
//         res.status(500).send("Server error");
//     }
// });

// // 로봇 리스트 받아서 브라우저에 출력
// robotRouter.get("/api/getrobotlist", async (req: Request, res: Response) => {
//     fs.readFile('RobotSettings.json', 'utf8', (err, fileData) => {
//         if (err) throw err;
//         let data: RobotData[] = fileData ? JSON.parse(fileData) : [];
//         res.send(data);
//     });
// });


export default robotRouter;

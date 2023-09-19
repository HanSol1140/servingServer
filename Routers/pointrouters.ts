// routerhandler.ts
import express, { Request, Response, Router } from 'express';
// import express, { Router } from 'express';
import axios from 'axios';
import fs from 'fs';

import * as PointController from '../Controllers/pointControllers'
const pointRouter: Router = express.Router();


pointRouter.post("/api/createPointList", PointController.createPoint);
pointRouter.post("/api/deletepointlist", PointController.deletePoint);
pointRouter.get("/api/getpointlist", PointController.getPointList);
// pointRouter.get("/api/getpointlist", async (req:Request, res:Response) => {
//     fs.readFile('PointSettings.json', 'utf8', (err, fileData) => {
//         if (err) throw err;
//         let data:PointData[] = [];
//         data = fileData ? JSON.parse(fileData) : [];
//         res.send(data); 
//     });
// });
// ====================================================================================================
// 리팩토링 완료

// interface PointData {
//     pointName: string,
//     coordinatesX : string,
//     coordinatesY : string,
//     coordinatesTheta :string
// }
// 포인트저장
// pointRouter.post("/api/createPointList", async (req:Request, res:Response) => {
//     try {
//         // RobotSettings.json이 없다면 생성
//         if (!fs.existsSync('PointSettings.json')) {
//             fs.writeFileSync('PointSettings.json', JSON.stringify([]));
//         }
//         //파일 읽기
//         fs.readFile('PointSettings.json', 'utf8', (err, fileData) => {
//             if (err) throw err;
//             let data: PointData[] = [];
//             data = fileData ? JSON.parse(fileData) : []; // 파일에 데이터가 없으면 빈배열 생성
//             const newData = {
//                 pointName : req.body.pointName,
//                 coordinatesX : req.body.coordinatesX,
//                 coordinatesY : req.body.coordinatesY,
//                 coordinatesTheta : req.body.coordinatesTheta,
//             };
//             const exists1 = data.some(item => item.pointName === req.body.pointName);

//             if (!exists1) { // 포인트명에 중복이 없다.
                
//                 data.push(newData); // 새로운 데이터를 배열에 추가
//                 data.sort((a, b) => a.pointName.localeCompare(b.pointName, 'kr'));
//                 const jsonData = JSON.stringify(data, null, 2);
//                 fs.writeFileSync('PointSettings.json', jsonData); // 동기적으로 파일 작성
//                 res.send("저장 완료");
               
//             } else {
//                 res.status(409).send("포인트의 명칭이 중복되었습니다. \n기입한 정보를 확인해주세요.");
//             }
//         });

//     } catch (error) {
//         console.error('Error with API call:', error);
//         console.log("error : ", error);
//     }
// });
// // 포인트명을 받아서 매칭된 PointList삭제
// pointRouter.post("/api/deletepointlist", async (req:Request, res:Response) => {
//     try {
//         if (!fs.existsSync('PointSettings.json')) {
//             return res.status(404).send("File not found");
//         }
//         fs.readFile('PointSettings.json', 'utf8', (err, fileData) => {
//             if (err) throw err;
//             let data:PointData[] = fileData ? JSON.parse(fileData) : [];
//             const newData = data.filter(item => item.pointName !== req.body.pointName);
//             const jsonData = JSON.stringify(newData, null, 2);
//             fs.writeFileSync('PointSettings.json', jsonData);
//             res.send("Delete successful");
//         });
//     } catch (error) {
//         console.error('Error with API call:', error);
//         res.status(500).send("Server error");
//     }
// });

// // 저장된 PointSettings리액트 페이지에 출력
// pointRouter.get("/api/getpointlist", async (req:Request, res:Response) => {
//     fs.readFile('PointSettings.json', 'utf8', (err, fileData) => {
//         if (err) throw err;
//         let data:PointData[] = [];
//         data = fileData ? JSON.parse(fileData) : [];
//         res.send(data); 
//     });
// });

// ====================================================================================================
// ====================================================================================================


export default pointRouter;
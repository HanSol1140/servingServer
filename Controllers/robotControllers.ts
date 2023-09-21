// robotControllers.ts
import { Request, Response } from 'express';
import * as RobotModel from '../Models/robotModels.js';

// 로봇 목록 추가
export const createRobot = (req:Request, res:Response) => {
    try {
        const robotName = req.body.robotName;
        const robotNumber = parseInt(req.body.robotNumber);
        const robotIP =req.body.robotIP;
        const result = RobotModel.createRobotData(robotName, robotNumber, robotIP);
        res.send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

//로봇 데이터 수정
export const updateRobot = (req:Request, res:Response) => {
    try {
        const robotName = req.body.robotName;
        const newRobotName = req.body.newRobotName;
        const newRobotNumber = parseInt(req.body.newRobotNumber);
        const newRobotIP =req.body.newRobotIP;
        const result = RobotModel.updateRobotData(robotName, newRobotName, newRobotNumber, newRobotIP);
        res.send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

// 로봇 삭제
export const deleteRobot = (req:Request, res:Response) => {
    try {
        const deleteRobotName = req.body.robotName;
        const result = RobotModel.deleteRobotData(deleteRobotName);
        res.send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const getRobotList = (req:Request, res:Response) => {
    try {
        const result = RobotModel.getRobotListData();
        res.send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
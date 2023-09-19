import { Request, Response, Router } from 'express';
import * as PointModel from '../Models/pointModels.js';

export const createPoint = (req:Request, res:Response) => {
    try {
        var pointName = req.body.pointName;
        var coordinatesX = req.body.coordinatesX;
        var coordinatesY = req.body.coordinatesY;
        var coordinatesTheta = req.body.coordinatesTheta;
        const result = PointModel.createPointData(pointName, coordinatesX, coordinatesY, coordinatesTheta);
        res.send(result);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const deletePoint = (req:Request, res:Response) => {
    try {
        var pointName = req.body.pointName;
        const result = PointModel.deletePoinrtData(pointName);
        res.send(result);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const getPointList = (req:Request, res:Response) => {
    try {
        const result = PointModel.getPoinstListData();
        res.send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
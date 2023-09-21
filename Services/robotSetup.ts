// func.ts
import axios from 'axios';
import fs from 'fs';
import {
    robotSettings,
    setRobotSettings,
    pointCoordinate,
    setPointCoordinate,
    robotCoordinate,
    setRobotCoordinate,
    laserCoordinate,
    setLaserCoordinate
} from '../robotconfig';



// 서버 실행시 로봇리스트 받아오기
export async function setupRobots() {
    if (!fs.existsSync('Settings/RobotSettings.json')) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs.readFileSync('Settings/RobotSettings.json', 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

// 서버 실행시 포인트리스트 받아오기
export async function setupPoints() {
    if (!fs.existsSync('Settings/PointSettings.json')) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs.readFileSync('Settings/PointSettings.json', 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

interface robotsInfo {
    robotName: string;
    robotNumber: number;
    robotIP: string;
    robotRunningState: boolean,
    robotLastOrderPoint: object
}
interface pointsInfo {
    pointName: string;
    coordinatesX: string;
    coordinatesY: string;
    coordinatesTheta: string;
}
// 서버 실행시 로봇 / 포인트 설정
export async function serverSetup() {

    // 로봇 설정
    const robots: robotsInfo[] = await setupRobots();
    console.log(robots);
    robots.forEach(robot => {
        setRobotSettings(robot.robotName, robot.robotNumber, robot.robotIP, robot.robotRunningState, robot.robotLastOrderPoint);
    });

    // 포인트 좌표 설정
    const points: pointsInfo[] = await setupPoints();
    // console.log(points);

    points.forEach(point => {
        setPointCoordinate(point.pointName, point.coordinatesX, point.coordinatesY, point.coordinatesTheta);
    });

}
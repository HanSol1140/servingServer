"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoinstListData = exports.deletePoinrtData = exports.createPointData = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = 'Settings/PointSettings.json';
const createPointData = (pointName, coordinatesX, coordinatesY, coordinatesTheta) => {
    try {
        // RobotSettings.json이 없다면 생성
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify([]));
        }
        // 파일 읽기
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        const newData = {
            pointName,
            coordinatesX,
            coordinatesY,
            coordinatesTheta,
        };
        const exists = data.some(item => item.pointName === pointName);
        if (exists) {
            return "포인트명이 중복되었습니다. \n기입한 정보를 확인해주세요.";
        }
        data.push(newData);
        data.sort((a, b) => a.pointName.localeCompare(b.pointName, 'kr'));
        const jsonData = JSON.stringify(data, null, 2);
        fs_1.default.writeFileSync(filePath, jsonData);
        return "포인트 데이터 저장 완료";
    }
    catch (error) {
        console.error('Error with API call:', error);
        throw error;
    }
};
exports.createPointData = createPointData;
const deletePoinrtData = (pointName) => {
    try {
        // 파일 읽기
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        const newData = data.filter(item => item.pointName !== pointName);
        const jsonData = JSON.stringify(newData, null, 2);
        fs_1.default.writeFileSync(filePath, jsonData);
        return "삭제완료";
    }
    catch (error) {
        console.error('Error with API call:', error);
        throw error;
    }
};
exports.deletePoinrtData = deletePoinrtData;
const getPoinstListData = () => {
    try {
        // RobotSettings.json이 없다면 생성
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify([]));
        }
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
exports.getPoinstListData = getPoinstListData;

import fs from 'fs';
const filePath = 'Settings/PointSettings.json';

interface PointData {
    pointName: string,
    coordinatesX : string,
    coordinatesY : string,
    coordinatesTheta :string
}
export const createPointData = (pointName: string, coordinatesX: string, coordinatesY: string, coordinatesTheta: string) => {
    try {
        // RobotSettings.json이 없다면 생성
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }

        // 파일 읽기
        const fileData = fs.readFileSync(filePath, 'utf8');
        let data: PointData[] = fileData ? JSON.parse(fileData) : [];
        const newData = {
            pointName,
            coordinatesX,
            coordinatesY,
            coordinatesTheta,
        };
        const exists = data.some(item => item.pointName === pointName);

        if (exists) {
            return "포인트명이 중복되었습니다. \n기입한 정보를 확인해주세요."
        }
        data.push(newData); 
        data.sort((a, b) => a.pointName.localeCompare(b.pointName, 'kr'));
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData);
        return "포인트 데이터 저장 완료"
    } catch (error) {
        console.error('Error with API call:', error);
        throw error;
    }
};

export const deletePoinrtData = (pointName: string) => {
    try {
        // 파일 읽기
        const fileData = fs.readFileSync(filePath, 'utf8');
        let data: PointData[] = fileData ? JSON.parse(fileData) : [];
        const newData = data.filter(item => item.pointName !== pointName)
        const jsonData = JSON.stringify(newData, null, 2);
        fs.writeFileSync(filePath, jsonData);
        return "삭제완료"
    } catch (error) {
        console.error('Error with API call:', error);
        throw error;
    }
};

export const getPoinstListData = () => {
    try{
            // RobotSettings.json이 없다면 생성
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify([]));
            }
        const fileData = fs.readFileSync(filePath, 'utf8');
        let data: PointData[] = fileData ? JSON.parse(fileData) : [];
        return data;
    }catch(error){
        console.error(error)
        throw error;
    }
}